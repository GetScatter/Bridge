import SingularAccounts from "../utility/SingularAccounts";
import PopupService from "../utility/PopupService";
import Popups from "../../util/Popups";
import ExchangeService from "@walletpack/core/services/apis/ExchangeService";
import TransferService from "@walletpack/core/services/blockchain/TransferService";
import HistoricExchange from "@walletpack/core/models/histories/HistoricExchange";
import {Blockchains} from '@walletpack/core/models/Blockchains';
import Token from '@walletpack/core/models/Token';
import * as Actions from '@walletpack/core/store/constants'
import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
import TokenService from "@walletpack/core/services/utility/TokenService";
import {store} from "../../store/store";

const fail = msg => {
	PopupService.push(Popups.snackbar(msg));
	return false;
}

export const STABLE_COINS = {
	[Blockchains.EOSIO]:Token.fromJson({
		blockchain:Blockchains.EOSIO,
		contract:'eosdtsttoken',
		symbol:'EOSDT',
		name:'EOSDT',
		decimals:9,
		chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
	}),
	[Blockchains.ETH]:Token.fromJson({
		blockchain:Blockchains.ETH,
		contract:'0xb9e31a22e3a1c743c6720f3b723923e91f3c0f8b',
		symbol:'USDC',
		name:'USDC',
		decimals:6,
		chainId:'1'
	})
};

export default class Stabilizer {

	static canStabilize(token){
		if(!store.state.featureFlags.stabilize) return false;
		return [
			// `eth:eth:eth:1`,
			`eos:eosio.token:eos:aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`,

		].includes(token.uniqueWithChain())
	}

	static async stabilize(token, amount){
		if(!Stabilizer.canStabilize(token)) return fail(`Cannot stabilize ${token.symbol}`);

		const service = token.blockchain === 'eos' ? 'bancor_eos' : 'coinswitch';
		const stableCoin = STABLE_COINS[token.blockchain];

		if(amount <= 0) return fail(`You cannot stabilize ${amount} ${token.symbol}. Amount must be greater than 0.`);

		const account = SingularAccounts.accounts([token.network()])[0];
		if(!account) return fail(`There was an error getting the account that holds this ${token.symbol}.`);

		const from = { account:account.sendable() };
		const to = { account:account.sendable() };

		const order = await ExchangeService.order(service, token, stableCoin.symbol, amount, from, to);
		if(!order) return fail('There was an issue connecting to the Exchange API');


		ExchangeService.accepted(order.id);
		const sent = await TransferService[account.blockchain()]({
			account:account,
			recipient:order.account,
			amount,
			memo:order.memo,
			token:token,
			promptForSignature:true,
			bypassHistory:true,
		}).catch(err => {
			PopupService.push(Popups.snackbar(`There was an error converting: ${err}`))
			return false
		});

		if(sent && !sent.hasOwnProperty('error')){
			if(!TokenService.hasToken(stableCoin)){
				if(!!stableCoin.contract && !!stableCoin.contract.length) {
					await TokenService.addToken(stableCoin, false, false);
				}
			}

			const clone = token;
			clone.amount = amount;

			const history = new HistoricExchange(account, account, clone, stableCoin, order, TransferService.getTransferId(sent, token.blockchain));
			store.dispatch(Actions.DELTA_HISTORY, history);
			setTimeout(() => {
				ExchangeService.watch(history);
			}, 1000);
			setTimeout(() => {
				BalanceService.loadBalancesFor(account);
			}, 3000);
		}

		if(sent && sent.hasOwnProperty('error')){
			PopupService.push(Popups.snackbar(sent.error));
		}

		return sent && !sent.hasOwnProperty('error');
	}

}
