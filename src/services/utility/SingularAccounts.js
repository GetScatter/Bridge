import {store} from "../../store/store";
import Network from '@walletpack/core/models/Network'
import Account from '@walletpack/core/models/Account'
import NetworkService from "@walletpack/core/services/blockchain/NetworkService";
import AccountService from "@walletpack/core/services/blockchain/AccountService";
import PluginRepository from "@walletpack/core/plugins/PluginRepository";
import * as UIActions from "../../store/ui_actions";
import * as Actions from "@walletpack/core/store/constants";

export default class SingularAccounts {

	// static keypairs(){
	// 	return store.state.scatter.keychain.keypairs.reduce((acc,keypair) => {
	// 		if(!acc.find(x => x.blockchains[0] === keypair.blockchains[0])){
	// 			acc.push(keypair);
	// 		}
	// 		return acc;
	// 	}, []);
	// }

	static accounts(networks = null){

		if(!networks) networks = store.state.scatter.settings.networks;
		return networks.map(network => {
			if(!network) return;

			if(!network instanceof Network) network = Network.fromJson(network);

			const firstAccount = () => store.state.scatter.keychain.accounts.find(x => x.networkUnique === network.unique());

			const predefined = window.localStorage.getItem(`acc_${network.unique()}`) || null;
			if(predefined){
				const account = store.state.scatter.keychain.accounts.find(x => x.unique() === predefined);
				if(!account) {
					SingularAccounts.setPredefinedAccount(network, null);
					return firstAccount();
				}

				return account;
			}

			return firstAccount();
		}).filter(x => !!x);
	}

	static setPredefinedAccount(network, account){
		if(account) window.localStorage.setItem(`acc_${network.unique()}`, account.unique());
		else window.localStorage.removeItem(`acc_${network.unique()}`);
	}

	static async loadAccountsForNetwork(keypair, network, scatter = null){
		if(keypair.blockchains[0] !== network.blockchain) return;

		const loadedAccount = SingularAccounts.accounts([network])[0];
		let accounts = await AccountService.getAccountsFor(keypair, network);

		if(loadedAccount && loadedAccount.keypairUnique === keypair.unique() && !accounts.find(x => x.unique() === loadedAccount.unique())){
			accounts.unshift(loadedAccount);
		}

		if(keypair.blockchains.includes('fio')){
			const plugin = PluginRepository.plugin('fio');
			const publicKey = keypair.publicKeys.find(x => x.blockchain === network.blockchain).key;
			const fioAddresses = await plugin.getNames(network, publicKey).catch(err => {
				console.error("Error getting FIO addresses", err);
				return false;
			}).then(x => x.fio_addresses);

			if(fioAddresses){
				accounts = [];
				fioAddresses.map(x => {
					accounts.unshift(Account.fromJson({
						keypairUnique: keypair.unique(),
						networkUnique: network.unique(),
						publicKey,
						account_hash:plugin.accountHash(publicKey),
						name:x.fio_address.split('@')[0],
						authority:x.fio_address.split('@')[1],
						fio_address:x.fio_address
					}));
				})
			}
		}

		const concatenatedAccounts = (store.state.accountCache[network.unique()] || []).concat(accounts).reduce((acc, account) => {
			if(acc.find(x => x.unique() === account.unique())) return acc;
			acc.push(account);
			return acc;
		}, []);
		store.dispatch(UIActions.SET_ACCOUNT_CACHE, {key:network.unique(), value:concatenatedAccounts});

		if(!SingularAccounts.accounts([network]).length && accounts.length){
			SingularAccounts.setPredefinedAccount(network, accounts[0]);
		}

		if(scatter) concatenatedAccounts.map(account => {
			scatter.keychain.addAccount(account);
		})
	}

	static async refreshAccounts(networks, keys){
		const scatter = store.state.scatter.clone();
		await Promise.all(networks.map(async network => {
			await Promise.all(keys.map(keypair => {
				return SingularAccounts.loadAccountsForNetwork(keypair, network, scatter);
			}))
		}));
		await store.dispatch(Actions.SET_SCATTER, scatter);
	}

}
