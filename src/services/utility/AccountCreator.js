import PluginRepository from '@walletpack/core/plugins/PluginRepository';
import {Blockchains} from '@walletpack/core/models/Blockchains';
import PopupService from "./PopupService";
import Popups from "../../util/Popups";
import {store} from "../../store/store";
import EosioHelpers from "../special/EosioHelpers";
import Moonpay from "../credit/Moonpay";
import SingularAccounts from "./SingularAccounts";
import Account from '@walletpack/core/models/Account'
import AccountService from '@walletpack/core/services/blockchain/AccountService'
import BalanceService from '@walletpack/core/services/blockchain/BalanceService'

export default class AccountCreator {

	static async createAccount(keypair, network, buyAmount = null){
		if(!keypair) return PopupService.push(Popups.snackbar('There was an error loading your wallet (no keypair)'));
		if(!keypair.blockchains[0] === Blockchains.EOSIO) return PopupService.push(Popups.snackbar('There was an error loading your wallet (wrong enabled blockchain on keypair)'));

		// TODO: Add other chains!
		if(!PluginRepository.plugin(Blockchains.EOSIO).isEndorsedNetwork(network))
			return PopupService.push(Popups.snackbar("Can only create an account on EOS Mainnet"));

		const token = network.systemToken();
		const randomName = await EosioHelpers.getRandomName();


		const publicKey = keypair.publicKeys.find(x => x.blockchain === Blockchains.EOSIO).key;
		if(!publicKey) return PopupService.push(Popups.snackbar('There was an error loading your wallet (no public key)'));

		const created = await AccountCreator.createFromCard(token, buyAmount, keypair, randomName, publicKey);

		if(created){
			const account = Account.fromJson({
				keypairUnique:keypair.unique(),
				networkUnique:network.unique(),
				publicKey,
				name:randomName,
				authority:'active',
			});

			await AccountService.addAccount(account);
			BalanceService.loadBalancesFor(account);
		}

		return created;
	}

	static async createFromCard(token, buyAmount, keypair, randomName, publicKey){
		const email = store.state.scatter.keychain.identities[0].personal.email;

		const bought = await PopupService.push(Popups.moonpay(
			token,
			buyAmount,
			'makeaccounts',
			`${publicKey},${randomName}`,
			email,
			randomName
		));

		const check = async (tries = 0) => {
			// 1 minute timeout
			if(tries > 120) return false;

			let completed = await Moonpay.checkStatus(randomName);
			if(!completed || !completed.length){
				PopupService.push(Popups.snackbar("We couldn't verify the purchase automatically, please check your email."));
			} else {
				completed = completed[0];

				if(completed.status === 'completed'){
					await Moonpay.removeHook(completed.unique);
					PopupService.push(Popups.snackbar('Funds loaded!'));
					return true;
				}

				else if(completed.status === 'failed'){
					await Moonpay.removeHook(completed.unique);
					PopupService.push(Popups.snackbar('There was an issue loading your funds.'));
					return false;
				}

				// Recurse if still pending
				else return new Promise(r => setTimeout(async () => r(await check(tries++)), 500));
			}
		};

		return check();
	}

}
