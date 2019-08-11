import * as Actions from '@walletpack/core/store/constants';
import PriceService from "@walletpack/core/services/apis/PriceService";
import StoreService from "@walletpack/core/services/utility/StoreService";
import SocketService from "@walletpack/core/services/utility/SocketService";
import AppsService from "@walletpack/core/services/apps/AppsService";
import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
import PurchasingService from "../credit/PurchasingService";
import WatcherService from "./WatcherService";
import KYCService from "../kyc/KYCService";
import Loader from "../../util/Loader";

let initialized = false;

export default class SingletonService {

	static isInit(){
		return initialized;
	}

	static async init(){
		if(initialized) return true;
		initialized = true;

		await BalanceService.loadAllBalances();
		await PriceService.watchPrices();

		setTimeout(() => SocketService.initialize(), 300);
		setTimeout(() => AppsService.getApps({include:AppsService.linkedApps().map(x => x.applink)}), 1000);
		setTimeout(() => KYCService.required(), 1500);


		setTimeout(() => {
			WatcherService.alignWatchers();
			WatcherService.watchAll()
		}, 5000);


		// TODO: FIX
		// await StoreService.get().dispatch(Actions.LOAD_HISTORY);
		// await StoreService.get().dispatch(Actions.LOAD_LANGUAGE);
		return true;
	}

}