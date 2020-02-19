import RIDL from 'ridl-js';
import PluginRepository from '@walletpack/core/plugins/PluginRepository';
import {Blockchains} from '@walletpack/core/models/Blockchains'
import Token from '@walletpack/core/models/Token'
import BalanceHelpers from "./BalanceHelpers";
import PopupService from "./PopupService";
import Popups from "../../util/Popups";
import TransferService from "@walletpack/core/services/blockchain/TransferService";
import SingularAccounts from "./SingularAccounts";
import EosioHelpers from "../special/EosioHelpers";

// const HOST = 'https://ridlapi.get-scatter.com';
const HOST = 'http://localhost:6542';
const api = RIDL(() => {}, HOST);

const getSigner = publicKey => async hash => window.wallet.sign({blockchain:Blockchains.EOSIO}, publicKey, {data:hash}, true, true)

let storedPayment, storedPaymentTime;

export default class RidlService {

	static async isAvailable(){
		return await Promise.race([
			new Promise(r => setTimeout(() => r(false), 2000)),
			api.chains().then(x => true).catch(() => false)
		]);
	}

	static async getChains(){
		return api.chains().catch(() => []);
	}

	static async getAppReputation(app){
		return api.findReputation(`app::${app.applink}`).catch(() => null);
	}

	static async getTokenContracts(){
		return api.getTokenContracts().catch(() => []);
	}

	static validName(username){
		return api.validName(username);
	}

	static async findIdentity(username){
		return await api.findIdentity(username).catch(() => null);
	}

	static async payForIdentity(identity){
		const FIVE_MINUTES = 1000*60*5;

		if(!identity.personal.email.length){
			return PopupService.push(Popups.snackbar('You must add an email before you can register your identity.'));
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

		if(storedPayment && storedPayment.username === identity.name){
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
				console.warn('status', status);
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


		if(sentPayment){
			const finished = await api.finishPayment(storedPayment.id, sentPayment.txid, sentPayment.block_num);
			console.log('finished', finished);
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
		const changed = await RIDL(getSigner(old_key), HOST).changekey(identity_id, key, chain);
		if(!changed) PopupService.push(Popups.snackbar('There was an error sending this rating.'));
		if(changed && !changed.success) PopupService.push(Popups.snackbar(changed.error));
		return changed && changed.success ? {txid:changed.txid} : false;
	}

	static async repute(identity_id, entity, fragments, tokens, chain, details = '', publicKey){
		const reputed = await RIDL(getSigner(publicKey), HOST).repute(identity_id, entity, fragments, tokens, chain, details);
		if(!reputed) PopupService.push(Popups.snackbar('There was an error sending this rating.'));
		if(reputed && !reputed.success) PopupService.push(Popups.snackbar(reputed.error));
		return reputed && reputed.success;
	}



	static async moveTokensToAccount(account, token, recipient, network){
		const plugin = PluginRepository.plugin(Blockchains.EOSIO);
		const accountData = await plugin.accountData(null, network, recipient);
		if(network.blockchain !== 'eos') return false;
		if(!accountData) return PopupService.push(Popups.snackbar(`The account you specified does not exist on ${network.name}.`));


		return new Promise(async (resolve, reject) => {
			const eos = plugin.getSignableEosjs(account, reject);
			await eos.transact({
				actions:[{
					account: token.contract,
					name:'movechainacc',
					authorization:[{ actor: account.sendable(), permission: account.authority, }],
					data:{
						from: account.name,
						to:recipient,
						quantity:`${parseFloat(token.amount).toFixed(token.decimals)} ${token.symbol}`,
						chain:network.chainId,
					},
				}]
			}, {
				blocksBehind: 3,
				expireSeconds: 30,
			})
				.catch(res => resolve({error:EosioHelpers.parseErrorMessage(res)}))
				.then(result => resolve(result))
		})
	}

	static async moveTokensToIdentity(account, token, username){
		if(username.indexOf('@')) username = username.split('@')[0];
		const found = await this.findIdentity(username);
		if(!found) return PopupService.push(Popups.snackbar('The identity you are trying to send to does not exist.'));

		if(found.chain === account.network().chainId){
			const logicContract = await api.getLogicContract(found.chain);
			if(!logicContract) return PopupService.push(Popups.snackbar("There was an error getting the logic contract for this chain."));
			return new Promise(async (resolve, reject) => {
				const eos = PluginRepository.plugin(Blockchains.EOSIO).getSignableEosjs(account, reject);
				await eos.transact({
					actions:[{
						account: token.contract,
						name:'transfer',
						authorization:[{ actor: account.sendable(), permission: account.authority, }],
						data:{
							from: account.name,
							to:logicContract,
							quantity:`${parseFloat(token.amount).toFixed(token.decimals)} ${token.symbol}`,
							memo:username
						},
					}]
				}, {
					blocksBehind: 3,
					expireSeconds: 30,
				})
					.catch(res => resolve({error:EosioHelpers.parseErrorMessage(res)}))
					.then(result => resolve(result))
			})
		} else {
			return new Promise(async (resolve, reject) => {
				const eos = PluginRepository.plugin(Blockchains.EOSIO).getSignableEosjs(account, reject);
				await eos.transact({
					actions:[{
						account: token.contract,
						name:'movechainid',
						authorization:[{ actor: account.sendable(), permission: account.authority, }],
						data:{
							from: account.name,
							username,
							quantity:`${parseFloat(token.amount).toFixed(token.decimals)} ${token.symbol}`
						},
					}]
				}, {
					blocksBehind: 3,
					expireSeconds: 30,
				})
					.catch(res => resolve({error:EosioHelpers.parseErrorMessage(res)}))
					.then(result => resolve(result))
			})
		}


	}

}
