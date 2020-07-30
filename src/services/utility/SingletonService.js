
import PriceService from "@walletpack/core/services/apis/PriceService";
import SocketService from "@walletpack/core/services/utility/SocketService";
import AppsService from "@walletpack/core/services/apps/AppsService";
import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
import WatcherService from "./WatcherService";
import KYCService from "../kyc/KYCService";
import BalanceHelpers from "./BalanceHelpers";
import PluginRepository from '@walletpack/core/plugins/PluginRepository';
import {Blockchains} from '@walletpack/core/models/Blockchains'
import * as UIActions from "../../store/ui_actions";
import {GET, POST} from "@walletpack/core/services/apis/BackendApiService";
import {store} from "../../store/store";
import * as Actions from '@walletpack/core/store/constants';
import EosioHelpers from "../special/EosioHelpers";
import SingularAccounts from "./SingularAccounts";
import PremiumService from "../premium/PremiumService";
import WebsocketAPIService from "./WebsocketAPIService";
import WalletHelpers from "../../util/WalletHelpers";

let initialized = false;

export default class SingletonService {

	static isInit(){
		return initialized;
	}

	static async init(){
		if(initialized) return true;
		initialized = true;

		let needsToUpdateScatter = false;
		const clone = store.state.scatter.clone();
		clone.keychain.accounts.map(account => {
			// Fixing dangling accounts
			if(
				!clone.keychain.keypairs.find(x => x.unique() === account.keypairUnique) ||
				!clone.settings.networks.find(x => x.unique() === account.networkUnique)
			) {
				needsToUpdateScatter = true;
				clone.keychain.removeAccount(account);
			}
			// Remove unused accounts (left over from embed)
			// if(account.network() && SingularAccounts.accounts([account.network()])[0].unique() !== account.unique()) {
			// 	needsToUpdateScatter = true;
			// 	clone.keychain.removeAccount(account);
			// }
		});
		if(needsToUpdateScatter) store.dispatch(Actions.SET_SCATTER, clone);

		WalletHelpers.initializePlugins();

		await WebsocketAPIService.connect();

		await Promise.all([
			// PremiumService.checkPremium(),
			SocketService.initialize(),
			BalanceHelpers.loadBalances(),
			WebsocketAPIService.watchPrices(),
			store.dispatch(Actions.LOAD_HISTORY)
		])



		WebsocketAPIService.getRoute('currencies/prices').catch(() => {}).then(x => store.dispatch(UIActions.SET_CURRENCIES, x));
		WebsocketAPIService.getRoute('flags/bridge').then(x => store.dispatch(UIActions.SET_FEATURE_FLAGS, x));
		WebsocketAPIService.getRoute('tokenmeta').then(x => store.dispatch(UIActions.SET_TOKEN_METAS, x))
		WebsocketAPIService.getApps();

		// Allows free CPU for EOS Mainnet
		EosioHelpers.apiPayingEosio();




		return true;
	}

}
