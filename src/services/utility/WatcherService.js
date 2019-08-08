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

let running;

export default class WatcherService {

	static async watchAll(){
		console.log('watching', stillWatching());
		if(!stillWatching()) return;
		if(running) return;
		running = true;

		const boughtIds = Object.keys(watching.bought);
		for(let i = 0; i < boughtIds.length; i++){
			if(watching.bought[boughtIds[i]] === PAYMENT_SERVICES.Moonpay) await Moonpay.checkIfComplete(boughtIds[i]);
		}

		running = false;
		setTimeout(() => this.watchAll(), 10000);
	}

	static alignWatchers(){
		const bought = StoreService.get().state.bought;
		console.log('bought', bought);
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