import ScatterCore from "@walletpack/core";
import * as ApiRoutes from '@walletpack/core/models/api/ApiActions';
import {store} from "../../store/store";
import StorageService from "./StorageService";
import WindowService from "./WindowService";
import SocketService from "./SocketService";
import {Popup, PopupData, PopupDisplayTypes} from "../../models/popups/Popup";
import Network from "@walletpack/core/models/Network";
import StoreService from "@walletpack/core/services/utility/StoreService";
import Error from "@walletpack/core/models/errors/Error";
import PermissionService from "@walletpack/core/services/apps/PermissionService";
const pjson = require('../../../package');

// Seed is session based, and only exists in this running javascript scope
let seed;
export default class WebHelpers {

	static initializeCore(){
		const eventListener = async (type, data) => {
			if(type === 'popout') {
				const popup =  new Popup(PopupDisplayTypes.POP_OUT, new PopupData(data.type, data));
				return WindowService.openPopOut(popup);
			}

		};
		ScatterCore.initialize(
			{
				blockchains:{
					EOSIO:'eos',
					ETH:'eth',
					// TRX:'trx',
					BTC:'btc',
				},
				plugins:[
					require('@walletpack/eosio').default,
					require('@walletpack/ethereum').default,
					// require('@walletpack/tron').default,
					require('@walletpack/bitcoin').default,
				]
			},
			store,
			{
				getSalt:StorageService.getSalt,
				get:() => seed,
				set:(_seed) => seed = _seed,
				clear:() => seed = null,
			},
			{
				getVersion:WebHelpers.getVersion,
				pushNotification:WebHelpers.pushNotificationMethod(),
			},
			eventListener,
			{
				socketService:SocketService,
				publicToPrivate:async publicKey => {
					console.log('pubkey', publicKey);
					return false;
				}
			}
		);

		// ---------------------------------------
		// Bridge only allows one account per network.
		// ---------------------------------------
		(() => {
			const originalFn = ScatterCore.services.apis.ApiService[ApiRoutes.LINK_ACCOUNT];
			ScatterCore.services.apis.ApiService[ApiRoutes.LINK_ACCOUNT] = (request) => {
				const passOn = () => originalFn(request);
				if(!request.hasOwnProperty('payload')) return passOn();
				if(!request.payload.hasOwnProperty('network')) return passOn();

				const network = StoreService.get().state.scatter.settings.networks.find(x => x.unique() === Network.fromJson(request.payload.network).unique());
				if(!network) return passOn();

				const account = StoreService.get().state.scatter.keychain.accounts.find(x => x.networkUnique === network.unique());
				if(account) return {id:request.id, result:Error.malicious("The user already has an account for this network and is using a wallet that doesn't support multiple accounts per network.")};

				return passOn();
			}
		})();

		// PluginRepository.plugin(Blockchains.TRX).init();

		return true;
	}

	static getVersion(){
		return pjson.version;
	}

	static pushNotificationMethod(){
		return () => {
			console.log('notification')
		}
	}





}