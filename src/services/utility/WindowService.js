import WindowMessage from '../../models/popups/WindowMessage';
import StoreService from "@walletpack/core/services/utility/StoreService";
import AppsService from "@walletpack/core/services/apps/AppsService";
import PopupService from "./PopupService";
import Popups from "../../util/Popups";


let _OPEN_WINDOW;

let pendingMessages = [];
const getPending = msg => pendingMessages.find(x => x.id === msg.id);
const addPending = msg => pendingMessages.push(msg);
const removePending = msg => pendingMessages = pendingMessages.filter(x => x.id !== msg.id);

const handlers = [];

// todo:

// ipcRenderer.on('result', (event, result) => {
// 	if(!result) return;
//
// 	const pending = getPending(result.original);
// 	if(pending) pending.resolver(result.result);
//
// 	const rWin = remote.BrowserWindow.fromId(result.windowId);
// 	rWin.webContents.send('ack', true);
//
// });

let popouts = [];

const sendMessage = (windowId, type, data, resolver = null) => {
	// const message = new WindowMessage(type, data, remote.getCurrentWindow().id, resolver);
	// if(resolver) addPending(message);

	// remote.BrowserWindow.fromId(windowId).webContents.send(type, message);
};

export default class WindowService {

	static openSafeWindow(url){
		window.open(url, '_blank', 'noopener')
	}

	static sendResult(original, result = null){
		return new Promise(resolve => {
			// setTimeout(() => resolve(true), 5500);
			// const windowId = remote.getCurrentWindow().id;
			//
			// ipcRenderer.sendTo(original.windowId, 'result', {original, result, windowId});
			// ipcRenderer.once(`ack`, () => resolve(true))

		})
	}

	static async openPopOut(popup){
		// if(process.env.VUE_APP_NO_WALLET){
		// 	console.log(popup);
		// 	return false;
		// }

		if(!process.env.VUE_APP_NO_WALLET && window.wallet) {
			return await window.wallet.utility.openPopOut(popup);
		}

		return new Promise(async (resolve, reject) => {
			let responded = false;

			const scatter = StoreService.get().state.scatter.clone();
			scatter.keychain.keypairs.map(keypair => delete keypair.privateKey);
			scatter.keychain.identities.map(identity => delete identity.privateKey);
			delete scatter.keychain.avatars;

			const respond = result => {
				popouts = popouts.filter(x => x.id !== popup.id);
				popup.data.callback(Object.assign(popup, {result}));
				resolve(Object.assign(popup, {result}));
			};

			// Rate limiting: One open pop out at a time per origin.
			if(popouts.find(x => x.data.props.payload.origin === popup.data.props.payload.origin))
				return resolve(false);

			if(popup.data.props.payload){
				const appData = AppsService.appIsInLocalData(popup.data.props.payload.origin);
				popup.data.props.appData = appData ? appData : await AppsService.getAppDataFromServer(popup.data.props.payload.origin);
			}

			popouts.push(popup);

			openWindow(
				readyWindow => {
					const message = new WindowMessage('popup', {scatter, popup, balances:{}}, '0', null);
					readyWindow.getData = () => message;
					readyWindow.respond = (...data) => {
						responded = true;
						respond(...data);
					}
				},
				closedWithoutAction => { if(!responded) respond(null); },
				popup.dimensions.width, popup.dimensions.height,
				popup.internal
			);
		})
	}

	static arePopupsBlocked(){
		if(window.wallet) return false;
		const _window = window.open('', '_blank');
		if(_window) {
			_window.close();
			return false;
		}
		return true;
	}

}

const openWindow = (onReady = () => {}, onClosed = () => {}, width = 800, height = 600, dontHide = false) => {
	const left = (screen.width/2)-(width/2);
	const top = (screen.height/2)-(height/2);
	const localUrl = location.origin + '/#/popout'
	_OPEN_WINDOW =  window.open(localUrl,'Popup',`toolbar=no, location=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`);
	if(!_OPEN_WINDOW){
		onClosed(null);
		// PopupService.push(Popups.snackbar("You must allows popups from Scatter"))
		return alert("You must allow popups from Scatter");
	}

	onReady(_OPEN_WINDOW);
	_OPEN_WINDOW.onbeforeunload = onClosed;
	return true;
}
