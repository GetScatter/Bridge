import Moonpay from "./Moonpay";
import PopupService from "../utility/PopupService";
import Popups from "../../util/Popups";

let availableServices = [];

export const PAYMENT_SERVICES = {
	Moonpay:'moonpay',
}

export default class PurchasingService {

	static async init(){
		return availableServices.push(Moonpay);
		if(await Moonpay.isAvailable()) availableServices.push(Moonpay);
	}

	static async purchase(token, account, card, cvx, reinit = false){
		console.log('availableServices', availableServices);
		if(!availableServices.length) {
			if(reinit) return PopupService.push(Popups.snackbar("There are no available credit card services in your region."));
			await this.init();
			return this.purchase(token, account, card, cvx, true)
		}

		const bought = await availableServices[0].buy(token, account, card.clone(), cvx);
		console.log('bought', bought);
	}

	static async addPurchase(service, id){

	}

}