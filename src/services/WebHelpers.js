import ScatterCore from "@walletpack/core";
import {store} from "../store/store";
import StorageService from "./StorageService";
import WindowService from "./WindowService";
import SocketService from "./SocketService";
import StoreService from "@walletpack/core/services/utility/StoreService";
import * as Actions from "@walletpack/core/store/constants";
import Scatter from "@walletpack/core/models/Scatter";
import Keypair from "@walletpack/core/models/Keypair";
import Account from "@walletpack/core/models/Account";
import Network from "@walletpack/core/models/Network";
import PluginRepository from "@walletpack/core/plugins/PluginRepository";
import {Blockchains} from "@walletpack/core/models/Blockchains";
const pjson = require('../../package');

let ks = {};
export const ipcFaF = (key, data) => {
	return ks[key] = data;
}

export const ipcAsync = (key, data) => {
	return ks[key];
}

// Seed is session based, and only exists in this running javascript scope
let seed;
export default class WebHelpers {

	static initializeCore(){
		const eventListener = (type, data) => {
			console.log('event', type, data);
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

		// TODO: Testing only
		// this.loadDummyData();
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

	static reload(){
		location.reload();
	}

	static copy(txt){
		console.log('copied', txt);
	}

	static openLinkInBrowser(link, filepath = false){
		window.open(link, '_blank', 'noopener=yes')
	}

	static getDefaultPath(){
		return '';
	}





	static loadDummyData(){
		const mainnet = Network.fromJson({
			"id":"662173882135",
			"name":"EOS Mainnet",
			"protocol":"https",
			"host":"nodes.get-scatter.com",
			"port":443,
			"path":"",
			"blockchain":"eos",
			"chainId":"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
			"fromOrigin":null,
			"createdAt":1564088063156,
			"token":null
		})
		const acc = Account.fromJson({
			name:'ramdeathtest',
			networkUnique:mainnet.unique(),

		})
		const dummy = Scatter.fromJson({
			"meta":{
				"version":"0.1.0",
				"lastVersion":"0.1.0",
				"acceptedTerms":true,
				"lastSuggestedVersion":null
			},
			"keychain":{
				"keypairs":[

				],
				"accounts":[
					acc
				],
				"identities":[
					{
						"id":"fIZQkRUNxXKVObRi4rQWIhLx",
						"hash":"b19bbddf07ecc6cc6a556fef5be152c4b2ab72ba4b6b96d81522ad4c01068d24",
						"privateKey":"{\"iv\":\"AR4cp0l43cpqInD/K56m+w==\",\"salt\":\"lABdeyVGwFM=\",\"ct\":\"LRJPWRueOyImUwAUwDwbnH37nXmTrL0mepH/hMQ+IH2S3kCGe8M5eouQkPu2ZUfwqX3EC4MUIiBMHxM=\"}",
						"publicKey":"EOS56BBh36198a2txyptvNBf9jFLMcZj3EovEPcxyoUtabLCb2MXk",
						"name":"MyFirstIdentity",
						"personal":{
							"firstname":"",
							"lastname":"",
							"email":"",
							"birthdate":""
						},
						"location":{
							"id":"9965218099",
							"name":"Home",
							"isDefault":false,
							"phone":"",
							"address":"",
							"city":"",
							"state":"",
							"country":"",
							"zipcode":""
						},
						"kyc":false,
						"ridl":-1
					}
				],
				"locations":[
					{
						"id":"9965218099",
						"name":"Home",
						"isDefault":false,
						"phone":"",
						"address":"",
						"city":"",
						"state":"",
						"country":"",
						"zipcode":""
					}
				],
				"permissions":[

				],
				"cards":[

				],
				"apps":[

				],
				"avatars":{

				},
				"lastUsedIdentity":null
			},
			"settings":{
				"networks":[
					{
						"id":"662173882135",
						"name":"EOS Mainnet",
						"protocol":"https",
						"host":"nodes.get-scatter.com",
						"port":443,
						"path":"",
						"blockchain":"eos",
						"chainId":"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
						"fromOrigin":null,
						"createdAt":1564088063156,
						"token":null
					},
					{
						"id":"310839732188",
						"name":"Tron Mainnet",
						"protocol":"https",
						"host":"api.trongrid.io",
						"port":443,
						"path":"",
						"blockchain":"trx",
						"chainId":"1",
						"fromOrigin":null,
						"createdAt":1564088063156,
						"token":null
					},
					{
						"id":"710747013564",
						"name":"ETH Mainnet",
						"protocol":"https",
						"host":"ethnodes.get-scatter.com",
						"port":443,
						"path":"",
						"blockchain":"eth",
						"chainId":"1",
						"fromOrigin":null,
						"createdAt":1564088063156,
						"token":null
					},
					{
						"id":"816623195303",
						"name":"Bitcoin Mainnet",
						"protocol":"https",
						"host":"btcnodes.get-scatter.com",
						"port":443,
						"path":"",
						"blockchain":"btc",
						"chainId":"1",
						"fromOrigin":null,
						"createdAt":1564088063157,
						"token":null
					}
				],
				"language":"English",
				"autoBackup":"auto",
				"backupLocation":"[object Promise]/scatter_backups",
				"explorers":{
					"eos":{
						"raw":{
							"name":"Bloks",
							"account":"https://bloks.io/account/{x}",
							"transaction":"https://bloks.io/transaction/{x}",
							"block":"https://bloks.io/block/{x}"
						},
						"name":"Bloks"
					},
					"eth":{
						"raw":{
							"name":"Etherscan",
							"account":"https://etherscan.io/address/{x}",
							"transaction":"https://etherscan.io/tx/{x}",
							"block":"https://etherscan.io/block/{x}"
						},
						"name":"Etherscan"
					},
					"trx":{
						"raw":{
							"name":"Tronscan",
							"account":"https://tronscan.org/#/address/{x}",
							"transaction":"https://tronscan.org/#/transaction/{x}",
							"block":"https://tronscan.org/#/block/{x}"
						},
						"name":"Tronscan"
					},
					"btc":{
						"raw":{
							"name":"Blockcypher",
							"account":"https://live.blockcypher.com/btc/address/{x}",
							"transaction":"https://live.blockcypher.com/btc/tx/{x}",
							"block":"https://live.blockcypher.com/btc/block/{x}"
						},
						"name":"Blockcypher"
					}
				},
				"showNotifications":true,
				"firewall":{
					"enabled":false,
					"lastKnownBlock":0
				},
				"showMainnetsOnly":true,
				"displayToken":null,
				"displayCurrency":"USD",
				"tokens":[

				],
				"blacklistTokens":[

				],
				"blacklistActions":{
					"eos::eosio":[
						"updateauth"
					],
					"eos::eosio.msig":[
						"approve"
					]
				},
				"balanceFilters":{

				},
				"hideMainBalance":false,
				"simpleMode":false
			},
			"contacts":[

			],
			"hash":"b19bbddf07ecc6cc6a556fef5be152c4b2ab72ba4b6b96d81522ad4c01068d24",
			"recurring":{
				"proxies":[

				],
				"payments":[

				]
			},
			"onboarded":false,
			"pin":null,
			"pinForAll":false
		})
		StoreService.get().dispatch(Actions.HOLD_SCATTER, dummy).then(() => {
			ScatterCore.start()
		});
	}

}