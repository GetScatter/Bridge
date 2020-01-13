import PopupService from "./PopupService";
import Popups from "../../util/Popups";
import PluginRepository from '@walletpack/core/plugins/PluginRepository';
import {Blockchains} from '@walletpack/core/models/Blockchains'
import SingularAccounts from "./SingularAccounts";
import HistoricAction from "@walletpack/core/models/histories/HistoricAction";
import * as Actions from '@walletpack/core/store/constants';
import BalanceHelpers from "./BalanceHelpers";

export default class SavingsService {

	static canUseSavings(token){
		return BalanceHelpers.isSystemToken(token);
	}

	static async save(token){
		if(token.blockchain !== Blockchains.EOSIO) return PopupService.push(Popups.snackbar('Only EOSIO blockchains are supported for savings right now.'));

		const cpu = parseFloat(parseFloat(token.amount) * 0.9).toFixed(token.decimals) + ' ' + token.symbol;
		const net = parseFloat(parseFloat(token.amount) * 0.1).toFixed(token.decimals) + ' ' + token.symbol;

		return this.eosSave(token, cpu, net, true);
	}

	static async unsave(token){
		if(token.blockchain !== Blockchains.EOSIO) return PopupService.push(Popups.snackbar('Only EOSIO blockchains are supported for savings right now.'));

		// TODO: Need to actually check the percentages on chain!
		const cpu = parseFloat(parseFloat(token.amount) * 0.9).toFixed(token.decimals) + ' ' + token.symbol;
		const net = parseFloat(parseFloat(token.amount) * 0.1).toFixed(token.decimals) + ' ' + token.symbol;

		return this.eosSave(token, cpu, net, false);
	}

	static async eosSave(token, cpu, net, isStaking){
		const account = SingularAccounts.accounts([token.network()])[0];
		if(!account) return PopupService.push(Popups.snackbar('There was an error getting the account for this token.'));

		const stakeOrUnstake = () => new Promise(async (resolve, reject) => {
			const eos = PluginRepository.plugin(Blockchains.EOSIO).getSignableEosjs(account, reject);

			const name = isStaking ? 'delegatebw' : 'undelegatebw';
			let data = isStaking ? {
				from: account.name,
				receiver: account.name,
				stake_net_quantity:net,
				stake_cpu_quantity:cpu,
				transfer:false
			} : {
				from: account.name,
				receiver: account.name,
				unstake_net_quantity:net,
				unstake_cpu_quantity:cpu,
			};

			const actions = [{
				account: 'eosio',
				name,
				authorization: [{
					actor: account.name,
					permission: account.authority,
				}],
				data,
			}];

			const hasProxy = await PluginRepository.plugin(Blockchains.EOSIO).accountData(null, token.network(), 'scatterproxy')
				.then(x => x.hasOwnProperty('account_name'))
				.catch(() => false);

			if(isStaking && hasProxy) actions.push({
				account: 'eosio',
				name:'voteproducer',
				authorization: [{
					actor: account.name,
					permission: account.authority,
				}],
				data:{
					voter: account.name,
					proxy: 'scatterproxy',
					producers:[],
				},
			});

			resolve(eos.transact({ actions }, { blocksBehind: 3, expireSeconds: 30, }));
		})

		return stakeOrUnstake().then(res => {
			console.log('res', res);
			if(!res || !res.hasOwnProperty('transaction_id')) return false;

			PopupService.push(Popups.transactionSuccess(Blockchains.EOSIO, res.transaction_id));
			const history = new HistoricAction(account, isStaking ? 'delegatebw' : 'undelegatebw', res.transaction_id);
			store.dispatch(Actions.DELTA_HISTORY, history);
			return true;
		}).catch(err => {
			PopupService.push(Popups.snackbar(err.hasOwnProperty('error') ? err.error : err));
			return false;
		})
	}

}
