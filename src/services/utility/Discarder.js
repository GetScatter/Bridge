import BalanceHelpers from "./BalanceHelpers";
import PluginRepository from '@walletpack/core/plugins/PluginRepository';
import SingularAccounts from "./SingularAccounts";
import PopupService from "./PopupService";
import Popups from "../../util/Popups";
import {Blockchains} from '@walletpack/core/models/Blockchains'
import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
import {store} from "../../store/store";
import * as Actions from '@walletpack/core/store/constants';

export default class Discarder {

	static canDiscard(token){
		if(BalanceHelpers.isStableCoin(token) || BalanceHelpers.isSystemToken(token)) return false;
		if(!PluginRepository.plugin(token.blockchain).isEndorsedNetwork(token.network())) return false;
		if(!Discarder.tokenAddress(token)) return false;

		return true;
	}

	static tokenAddress(token){
		switch(token.blockchain){
			case Blockchains.EOSIO: return 'burnmytokens';
		}
	}

	static async discard(token){
		const plugin = PluginRepository.plugin(token.blockchain);
		const account = SingularAccounts.accounts([token.network()])[0];
		if(!account) return PopupService.push(Popups.snackbar("Can't find account for this token."));
		return plugin.transfer({
			account,
			to:Discarder.tokenAddress(token),
			amount:token.amount,
			token
		}).then(x => {
			const accepted = x.hasOwnProperty('transaction_id');
			if(accepted){
				let balances = store.state.balances[account.identifiable()];
				balances = balances.filter(x => x.uniqueWithChain() !== token.uniqueWithChain());
				store.dispatch(Actions.SET_BALANCES, {account:account.identifiable(), balances});
			} else {
				console.error(x);
			}
			return accepted;
		}).catch(err => {
			console.error(err);
			return false;
		});
	}

}
