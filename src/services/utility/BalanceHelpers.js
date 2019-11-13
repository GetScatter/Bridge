import {store} from "../../store/store";
import BalanceService from '@walletpack/core/services/blockchain/BalanceService'
import SingularAccounts from "./SingularAccounts";

export default class BalanceHelpers {

	static async loadBalances(){
		const accounts = SingularAccounts.accounts();
		console.log('accounts', accounts);
		return await Promise.all(accounts.map(account => BalanceService.loadBalancesFor(account)));

	}

}
