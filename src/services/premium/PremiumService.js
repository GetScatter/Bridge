import {store} from "../../store/store";
import {Blockchains} from "@walletpack/core/models/Blockchains";
import PluginRepository from '@walletpack/core/plugins/PluginRepository'
import ecc from 'eosjs-ecc';
import BalanceHelpers from "../utility/BalanceHelpers";
import PopupService from "../utility/PopupService";
import Popups from "../../util/Popups";
import Token from "@walletpack/core/models/Token";
import SingularAccounts from "../utility/SingularAccounts";
import TransferService from "@walletpack/core/services/blockchain/TransferService";
import * as UIActions from '../../store/ui_actions'

const HOST = 'https://premium.get-scatter.com';
const GET = (route) => fetch(`${HOST}/${route}`).then(x => x.json()).catch(() => null);
const POST = (route,body, method = "POST") => fetch(`${HOST}/${route}`, {
	method,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	},
	body:JSON.stringify(body),
}).then(x => x.json());

const identity = () => store.state.scatter.keychain.identities[0];
const hasPremium = () => store.state.hasPremium;

export default class PremiumService {

	static async checkPremium(){
		if(!store.state.featureFlags.premium) return;
		try {
			const timestamp = +new Date();
			const signature = ecc.signHash(ecc.sha256(`timestamp::${timestamp}`), await window.wallet.decrypt(identity().privateKey));
			const check = await POST(`check`, {
				timestamp,
				signature,
				publicKey:identity().publicKey,
				scatterHash:store.state.scatter.hash,
			}).catch(() => false);

			store.dispatch(UIActions.SET_PREMIUM, check);
		} catch(e){
			// console.error('Premium check error', e);
		}
	}

	static async goPremium(payment /* 10 is monthly, 100 is yearly */){
		return true;
	}

	static async payForPremium(){
		const paymentMethods = await GET(`payment/methods`).then(tokens => tokens.map(x => Token.fromJson(x))).catch(() => []);
		const availablePaymentMethods = BalanceHelpers.tokens().filter(token => {
			const pair = paymentMethods.find(x => x.uniqueWithChain() === token.uniqueWithChain());
			if (!pair) return false;
			return pair.amount <= token.amount;
		}).sort((a, b) => b.amount - a.amount);

		if (!availablePaymentMethods.length) return PopupService.push(Popups.snackbar(`You don't have any tokens to pay for this identity with.`));

		const paymentMethod = availablePaymentMethods[0];
		const payingToken = BalanceHelpers.tokens().find(x => x.uniqueWithChain() === paymentMethod.uniqueWithChain()).clone();

		const payment = POST('payment/create', {
			publicKey:identity().publicKey,
			token:payingToken.unique(),
		}).catch(() => null);

		if(!payment) return PopupService.push(Popups.snackbar("There was an issue creating your payment, please try again."));

		const payingAccount = SingularAccounts.accounts([payingToken.network()])[0];
		const txid = await TransferService[payingAccount.blockchain()]({
			account: payingAccount,
			recipient: payment.toAccount,
			amount: payment.requiredAmount,
			memo: payment.memo,
			token: payingToken,
		}).catch(err => {
			PopupService.push(Popups.snackbar(`There was an issue sending: ${err}`));
			return false;
		}).then(x => {
			if (x.hasOwnProperty('error')) {
				PopupService.push(Popups.snackbar(`There was an issue sending: ${x.error}`));
				return false;
			}

			return TransferService.getTransferId(x, payingToken.blockchain);
		});

		if(txid){
			const finished = await POST('payment/finish', {
				publicKey:identity().publicKey,
				paymentId:payment.id,
				txid,
			}).catch(() => null);
		} else {
			PopupService.push(Popups.snackbar("There was a problem sending your payment."));
		}
	}

	static async checkMonthlyPaymentDue(){
		const nextPaymentDue = GET(`payment/due`, { publicKey:identity().publicKey });
		if(!nextPaymentDue) return false;
		// User needs to pay for their monthly subscription again.
		if(nextPaymentDue.nextPayment < +new Date()){
			return PremiumService.payForPremium();
		}
	}

	static async changePremiumKey(newPrivateKey){
		if(!hasPremium()) return true;

		const newPublicKey = PluginRepository.plugin('eos').privateToPublic(newPrivateKey);
		const oldPrivateKey = await window.wallet.decrypt(identity().privateKey);
		const signature = ecc.signHash(ecc.sha256(newPublicKey), oldPrivateKey);
		return POST(`change-key`, {
			oldPublicKey:identity().publicKey,
			newPublicKey,
			scatterHash:store.state.scatter.hash,
		});
	}

}
