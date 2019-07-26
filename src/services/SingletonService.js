import * as Actions from 'scatter-core/store/constants';
import PriceService from "scatter-core/services/apis/PriceService";
import StoreService from "scatter-core/services/utility/StoreService";
import SocketService from "scatter-core/services/utility/SocketService";
import AppsService from "scatter-core/services/apps/AppsService";
import BalanceService from "scatter-core/services/blockchain/BalanceService";

let initialized = false;

export default class SingletonService {

	static async init(){
		if(initialized) return true;
		initialized = true;
		await Promise.all([
			BalanceService.loadAllBalances(),
			PriceService.watchPrices()
		])
		await SocketService.initialize();
		await StoreService.get().dispatch(Actions.LOAD_HISTORY);
		await StoreService.get().dispatch(Actions.LOAD_LANGUAGE);
		await AppsService.getApps();
		return true;
	}

}