
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
import {GET} from "@walletpack/core/services/apis/BackendApiService";
import {store} from "../../store/store";

let initialized = false;

export default class SingletonService {

	static isInit(){
		return initialized;
	}

	static async init(){
		if(initialized) return true;
		initialized = true;

		PluginRepository.plugin(Blockchains.TRX).init();

		SocketService.initialize();
		BalanceHelpers.loadBalances();
		PriceService.watchPrices();

		store.dispatch(UIActions.SET_TOKEN_METAS, await GET('tokenmeta'));
		store.dispatch(UIActions.SET_CURRENCIES, await PriceService.getCurrencyPrices().catch(() => {}));

		// TODO: Enable KYC
		// setTimeout(() => KYCService.required(), 1500);


		setTimeout(async () => {
			WatcherService.alignWatchers();
			WatcherService.watchAll();
		}, 5000);

		return true;
	}

}
