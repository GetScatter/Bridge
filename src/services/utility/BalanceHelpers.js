import {store} from "../../store/store";
import BalanceService from '@walletpack/core/services/blockchain/BalanceService'
import SingularAccounts from "./SingularAccounts";

export default class BalanceHelpers {

	static async loadBalances(){
		const accounts = SingularAccounts.accounts();
		return await Promise.all(accounts.map(account => BalanceService.loadBalancesFor(account)));
	}

	static isStableCoin(token){
		return [
			`eos:eosdtsttoken:eosdt:aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`,
			`eos:stablecarbon:cusd:aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`,
		].includes(token.uniqueWithChain())
	}

	static canBuy(token){
		if(!store.state.featureFlags.buy) return false;
		return [
			`btc:btc:btc:1`,
			`eth:eth:eth:1`,
			`trx:trx:trx:1`,
			`eos:eosio.token:eos:aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`,
			`eos:eosdtsttoken:eosdt:aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`,
			`eth:0x0d8775f648430679a709e98d2b0cb6250d2887ef:BAT:1`,
			`eth:0xdac17f958d2ee523a2206206994597c13d831ec7:TUSD:1`,
			`eth:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48:USDC:1`,
			`eth:0x0000000000085d4780B73119b644AE5ecd22b376:TUSD:1`,

		].includes(token.uniqueWithChain())
	}

	static isSystemToken(token){
		return token.network() && token.network().systemToken().unique() === token.unique()
	}

	static tokens(){
		let balances = BalanceService.totalBalances(true).totals;
		balances = Object.keys(balances).map(key => balances[key]);

		balances = balances.reduce((acc,token) => {
			const existing = acc.find(x => x.uniqueWithChain(false) === token.uniqueWithChain(false));
			if(!existing){
				acc.push(token.clone());
			} else {
				existing.amount = parseFloat(parseFloat(existing.amount) + parseFloat(token.amount)).toFixed(existing.decimals);
			}
			return acc;
		}, []);

		balances = balances.sort((a,b) => {
			return b.amount - a.amount;
		}).sort((a,b) => {
			const bySystem = BalanceHelpers.isSystemToken(b) ? 1 : BalanceHelpers.isSystemToken(a) ? -1 : 0;
			const byStableCoin = BalanceHelpers.isStableCoin(b) ? 1 : BalanceHelpers.isStableCoin(a) ? -1 : 0;
			return byStableCoin || bySystem;
		});

		return balances
	}

	static fiatTotalFor(tokens){
		return tokens.reduce((acc,x) => {
			if(x.fiatBalance(false)) acc += parseFloat(x.fiatBalance(false) || 0);
			return acc;
		}, 0).toFixed(2)
	}

}
