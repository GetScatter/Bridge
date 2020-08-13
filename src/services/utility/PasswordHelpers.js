import StoreService from "@walletpack/core/services/utility/StoreService";
import PopupService from "./PopupService";
import {Popup} from "../../models/popups/Popup";

export default class PasswordHelpers {

	static async verifyPIN(){
		return true;
		// if(!StoreService.get().state.scatter.pin || !StoreService.get().state.scatter.pin.length) return true;
		// return new Promise(resolve => {
		// 	PopupService.push(Popup.enterPIN(verified => {
		// 		resolve(verified);
		// 	}))
		// })
	}

}
