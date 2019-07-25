import {Popup} from "scatter-core/models/popups/Popup";
import {localizedState} from "scatter-core/localization/locales";
import LANG_KEYS from "scatter-core/localization/keys";
import ScatterCore from "scatter-core";
import {store} from "../store/store";
import StorageService from "./StorageService";
import WindowService from "./WindowService";
import SocketService from "./SocketService";
const pjson = require('../../package');

let popupService;
const PopupService = () => {
	if(!popupService) popupService = require("scatter-core/services/utility/PopupService").default;
	return popupService;
}

export const ipcFaF = (key, data) => {
	return window.localStorage.setItem(key, data);
}

export const ipcAsync = (key, data) => {
	window.localStorage.getItem(key);
}

// Seed is session based, and only exists in this running javascript scope
let seed;
export default class WebHelpers {

	static initializeCore(){
		return ScatterCore.initialize(
			[
				require('scatter-core/plugins/defaults/eos').default,
				require('scatter-core/plugins/defaults/trx').default,
				require('scatter-core/plugins/defaults/eth').default,
				require('scatter-core/plugins/defaults/btc').default,
			],
			store,
			StorageService,
			{
				get:() => seed,
				set:(_seed) => seed = _seed,
				clear:() => seed = null,
			},
			{
				getVersion:WebHelpers.getVersion,
				pushNotification:WebHelpers.pushNotificationMethod(),
			},
			WindowService.openPopOut,
			null,
			SocketService,
			async publicKey => {
				console.log('pubkey', publicKey);
				return false;
			}
		)
	}

	static getVersion(){
		return pjson.version;
	}

	static pushNotificationMethod(){
		return () => {
			console.log('notification')
		}
	}

	static reload(){
		location.reload();
	}

	static copy(txt){
		console.log('copied', txt);
		// clipboard.writeText(txt);
		PopupService().push(Popup.snackbar(localizedState(LANG_KEYS.SNACKBARS.CopiedToClipboard), 'check'))
	}

	static openLinkInBrowser(link, filepath = false){
		window.open(link, '_blank', 'noopener=yes')
	}

	static getDefaultPath(){
		return '';
	}

}