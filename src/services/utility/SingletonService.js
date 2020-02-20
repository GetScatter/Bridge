
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

let initialized = false;

export default class SingletonService {

	static isInit(){
		return initialized;
	}

	static async init(){
		if(initialized) return true;
		initialized = true;

		// Need to initialize the tron plugin.
		PluginRepository.plugin(Blockchains.TRX).init();

		await WebsocketAPIService.connect();

		await Promise.all([
			PremiumService.checkPremium(),
			SocketService.initialize(),
			BalanceHelpers.loadBalances(),
			WebsocketAPIService.watchPrices(),
		])

		setTimeout(async () => {
			Promise.all([
				store.dispatch(Actions.LOAD_HISTORY),
				store.dispatch(UIActions.SET_FEATURE_FLAGS, await WebsocketAPIService.getRoute('flags/bridge')),
				store.dispatch(UIActions.SET_TOKEN_METAS, await WebsocketAPIService.getRoute('tokenmeta')),
				store.dispatch(UIActions.SET_CURRENCIES, await WebsocketAPIService.getRoute('currencies/prices').catch(() => {})),
			])
		}, 100);

		WebsocketAPIService.getApps();

		// Adding in dual signer here.
		// EosioHelpers.apiPayingEosio();

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
			if(SingularAccounts.accounts([account.network()])[0].unique() !== account.unique()) {
				needsToUpdateScatter = true;
				clone.keychain.removeAccount(account);
			}
		});
		if(needsToUpdateScatter) store.dispatch(Actions.SET_SCATTER, clone);


		return true;
	}

}
