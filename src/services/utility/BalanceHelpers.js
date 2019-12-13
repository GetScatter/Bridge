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

	static isSystemToken(token){
		return token.network().systemToken().unique() === token.unique()
	}

}
