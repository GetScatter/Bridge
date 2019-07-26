import * as Actions from 'scatter-core/store/constants';
import PriceService from "scatter-core/services/apis/PriceService";
import StoreService from "scatter-core/services/utility/StoreService";
import SocketService from "scatter-core/services/utility/SocketService";
import AppsService from "scatter-core/services/apps/AppsService";

let initialized = false;

export default class SingletonService {

	static async init(){
		if(initialized) return true;
		initialized = true;
		SocketService.initialize();
		AppsService.getApps();
		PriceService.watchPrices();
		StoreService.get().dispatch(Actions.LOAD_HISTORY);
		StoreService.get().dispatch(Actions.LOAD_LANGUAGE);
		return true;
	}

}