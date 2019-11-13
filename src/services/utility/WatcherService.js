import StorageService from "./StorageService";
import StoreService from "@walletpack/core/services/utility/StoreService";
import * as UIActions from "../../store/ui_actions";
import {PAYMENT_SERVICES} from "../credit/PurchasingService";
import Moonpay from "../credit/Moonpay";

let watching = {
	bought:{},
};

const stillWatching = () => {
	if(Object.keys(watching.bought).length) return true;
	return false;
}

let running, timeout;

export default class WatcherService {

	static async watchAll(){
		if(!stillWatching()) return;
		if(running) return;
		running = true;

		if(timeout) clearTimeout(timeout);

		const boughtIds = Object.keys(watching.bought);
		for(let i = 0; i < boughtIds.length; i++){
			if(watching.bought[boughtIds[i]] === PAYMENT_SERVICES.Moonpay) await Moonpay.checkIfComplete(boughtIds[i]);
		}

		running = false;
		timeout = setTimeout(() => this.watchAll(), 60000);
	}

	static alignWatchers(){
		const bought = StoreService.get().state.bought;
		bought.map(x => {
			if(watching.bought[x.id]) return;
			watching.bought[x.id] = x.data;
		});

		return true;
	}

	static async addCreditCardPayment(id, service){
		const bought = await StorageService.deltaBought(id, service);
		StoreService.get().dispatch(UIActions.SET_BOUGHT, bought);
		watching.bought[id] = service;
		this.watchAll();
	}

	static async removeCreditCardPayment(id){
		delete watching.bought[id];
		const bought = await StorageService.deltaBought(id, null);
		StoreService.get().dispatch(UIActions.SET_BOUGHT, bought);
	}

}
