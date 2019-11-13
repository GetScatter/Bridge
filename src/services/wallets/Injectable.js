import PopupService from "../utility/PopupService";
import {Popup} from "../../models/popups/Popup";

export default class Injectable {

	static async appPath(){
		return window.wallet.storage.getDefaultPath();
	}

	static async openLink(link, filepath = false){
		return window.wallet.utility.openLink(link, filepath);
	}

	static async copy(text){
		PopupService.push(Popup.snackbar("Copied Text"));
		return window.wallet.utility.copy(text);
	}

}
