import RIDL from 'ridl-js';
import PluginRepository from '@walletpack/core/plugins/PluginRepository';
import {Blockchains} from '@walletpack/core/models/Blockchains'
import Token from '@walletpack/core/models/Token'
import BalanceHelpers from "./BalanceHelpers";
import PopupService from "./PopupService";
import Popups from "../../util/Popups";
import TransferService from "@walletpack/core/services/blockchain/TransferService";
import SingularAccounts from "./SingularAccounts";

const api = RIDL(() => {});

const getSigner = publicKey => async hash => window.wallet.sign({blockchain:Blockchains.EOSIO}, publicKey, {data:hash}, true, true)

let storedPayment, storedPaymentTime;

export default class RidlService {

	static async getAppReputation(app){
		return api.findReputation(`app::${app.applink}`).catch(() => null);
	}

	static validName(username){
		return api.validName(username);
	}

	static async findIdentity(username){
		return await api.findIdentity(username);
	}

	static async payForIdentity(identity){
		const FIVE_MINUTES = 1000*60*5;

		if(!identity.personal.email.length){
			PopupService.push(Popups.snackbar('You must add an email before you can register your identity.'));
		}

		let sentPayment = null;
		const sendPayment = async (payingToken) => {
			const payingAccount = SingularAccounts.accounts([payingToken.network()])[0];
			sentPayment = await TransferService[payingAccount.blockchain()]({
				account: payingAccount,
				recipient: storedPayment.toAccount,
				amount: storedPayment.requiredAmount,
				memo: storedPayment.memo,
				token: payingToken,
			}).catch(err => {
				PopupService.push(Popups.snackbar(`There was an issue sending: ${err}`));
				return false;
			}).then(x => {
				if (x.hasOwnProperty('error')) {
					PopupService.push(Popups.snackbar(`There was an issue sending: ${x.error}`));
					return false;
				}
				return {txid: x.processed.id, block_num: x.processed.block_num}
			});
		};

		if(storedPayment){
			const status = await api.getPaymentStatus(storedPayment.id);
			if(status === 'setup'){
				const timeleft = (storedPaymentTime + FIVE_MINUTES - +new Date());
				// We don't want to hit a situation where a payment log is about to expire.
				// So if the time left is less than 1 minute, we will wait for it and then
				// re-do it. (assuming here that signing time + TTL would be > 1 minute)
				if(timeleft < (1000*60)) {
					await new Promise(r => setTimeout(() => r(true), timeleft + 2000));
					return RidlService.payForIdentity(identity);
				} else {
					const payingToken = BalanceHelpers.tokens().find(x => x.uniqueWithChain() === storedPayment.tokenUnique).clone();
					await sendPayment(payingToken);
				}
			} else {
				// We should never actually hit this, but in the case it does happen we will just
				// bypass payment stage and let api+chain decide.
				console.log('status', status);
				return RidlService.identify(identity);
			}

		} else {

			const paymentMethods = await api.getIdentityPaymentMethods().catch(() => []).then(tokens => tokens.map(x => Token.fromJson(x)));
			// These tokens exist within the user's balances, and also have enough balance to pay for an identity.
			const availablePaymentMethods = BalanceHelpers.tokens().filter(token => {
				const pair = paymentMethods.find(x => x.uniqueWithChain() === token.uniqueWithChain());
				if (!pair) return false;
				return pair.amount <= token.amount;
			}).sort((a, b) => b.amount - a.amount);

			if (!availablePaymentMethods.length) return PopupService.push(Popups.snackbar(`You don't have any tokens to pay for this identity with.`));

			const paymentMethod = availablePaymentMethods[0];
			const payingToken = BalanceHelpers.tokens().find(x => x.uniqueWithChain() === paymentMethod.uniqueWithChain()).clone();

			const payment = await api.startIdentityPayment(identity.name, identity.personal.email, paymentMethod).catch(() => null);
			if (!payment) return PopupService.push(Popups.snackbar('There was an issue paying for this identity. Please contact support. [1]'));
			if (!payment.success) return PopupService.push(Popups.snackbar(payment.error));
			storedPayment = payment.data;
			storedPaymentTime = +new Date();

			await sendPayment(payingToken);
		}

		// For testing local chains, just disregards payment mechanism on front-end.
		return RidlService.identify(identity);

		if(sentPayment){
			const finished = await api.finishPayment(storedPayment.id, sentPayment.txid, sentPayment.block_num);
			await new Promise(r => setTimeout(() => r(true), 1000));
			return RidlService.identify(identity);
		} else {
			// Payment setups are expired after 5 minutes.
			setTimeout(() => {
				storedPayment = null;
				storedPaymentTime = null;
			}, FIVE_MINUTES);
			return false;
		}
	}

	static async identify(identity){
		// TODO: WARNING 'local' for testing enabled
		const registered = await api.identify(identity.name, identity.publicKey, 'local');
		if(!registered || !registered.success) return false;

		let ridlId = null;
		while(!ridlId){
			ridlId = await RidlService.findIdentity(identity.name);
			if(!ridlId) await new Promise(r => setTimeout(() => r(true), 500));
		}

		if(!ridlId) return PopupService.push(Popups.snackbar('There was an error registering this identity. Please try again.'));

		return ridlId;
	}

	static async changeKey(identity_id, key, chain, old_key){
		const changed = await RIDL(getSigner(old_key)).changekey(identity_id, key, chain);
		if(!changed) PopupService.push(Popups.snackbar('There was an error sending this rating.'));
		if(changed && !changed.success) PopupService.push(Popups.snackbar(changed.error));
		return changed && changed.success ? {txid:changed.txid} : false;
	}

	static async repute(identity_id, entity, fragments, tokens, chain, details = '', publicKey){
		const reputed = await RIDL(getSigner(publicKey)).repute(identity_id, entity, fragments, tokens, chain, details);
		if(!reputed) PopupService.push(Popups.snackbar('There was an error sending this rating.'));
		if(reputed && !reputed.success) PopupService.push(Popups.snackbar(reputed.error));
		return reputed && reputed.success;
	}

}
