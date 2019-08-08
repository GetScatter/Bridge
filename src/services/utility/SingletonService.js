import * as Actions from '@walletpack/core/store/constants';
import PriceService from "@walletpack/core/services/apis/PriceService";
import StoreService from "@walletpack/core/services/utility/StoreService";
import SocketService from "@walletpack/core/services/utility/SocketService";
import AppsService from "@walletpack/core/services/apps/AppsService";
import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
import PurchasingService from "../credit/PurchasingService";
import WatcherService from "./WatcherService";

let initialized = false;

export default class SingletonService {

	static async init(){
		if(initialized) return true;
		initialized = true;

		setTimeout(() => BalanceService.loadAllBalances(), 100);
		setTimeout(() => PriceService.watchPrices(), 200);
		setTimeout(() => SocketService.initialize(), 300);
		setTimeout(() => AppsService.getApps(), 1000);


		setTimeout(() => {
			WatcherService.alignWatchers();
			WatcherService.watchAll()
		}, 1500);


		// TODO: FIX
		// await StoreService.get().dispatch(Actions.LOAD_HISTORY);
		// await StoreService.get().dispatch(Actions.LOAD_LANGUAGE);
		return true;
	}

}