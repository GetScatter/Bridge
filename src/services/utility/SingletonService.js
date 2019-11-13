
import PriceService from "@walletpack/core/services/apis/PriceService";
import SocketService from "@walletpack/core/services/utility/SocketService";
import AppsService from "@walletpack/core/services/apps/AppsService";
import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
import WatcherService from "./WatcherService";
import KYCService from "../kyc/KYCService";
import BalanceHelpers from "./BalanceHelpers";

let initialized = false;

export default class SingletonService {

	static isInit(){
		return initialized;
	}

	static async init(){
		if(initialized) return true;
		initialized = true;

		BalanceHelpers.loadBalances();
		PriceService.watchPrices();
		SocketService.initialize();

		// TODO: Enable KYC
		// setTimeout(() => KYCService.required(), 1500);


		setTimeout(() => {
			WatcherService.alignWatchers();
			WatcherService.watchAll()
		}, 5000);

		return true;
	}

}
