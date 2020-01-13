import IdGenerator from "@walletpack/core/util/IdGenerator";
import * as CoreSocketService from "@walletpack/core/services/utility/SocketService";
import ApiService from "@walletpack/core/services/apis/ApiService";
import * as UIActions from "../store/ui_actions";
import {store} from "../store/store";
import {AES} from "aes-oop";

const scatterChats = {};


export default class WalletTalk {

	static setup(){

		WalletTalk.checkMobileWallet();

		window.wallet.socketResponse = data => {
			if(typeof data === 'string') data = JSON.parse(data);
			switch(data.type){
				case 'ext_api': return ApiService.handler(data.request);
				case 'api': return CoreSocketService.handleApiResponse(data.request, data.id);
				case 'pair': return CoreSocketService.handlePairedResponse(data.request, data.id);
				case 'ports': return store.dispatch(UIActions.SET_PORTS, data.ports);
				default: return;
			}
		}

		window.wallet.popout = popOut => {
			store.dispatch(UIActions.SET_POPOUT, popOut);
		}
	}

	// Mobile doesn't allow injection of window objects the same way.
	// So we're building a communication system for mobile instead which
	// proxies all requests over the connection.
	static checkMobileWallet(){
		if(typeof window.ReactNativeWebView !== 'undefined' || typeof window.PopOutWebView !== 'undefined'){
			const parseIfNeeded = x => {
				if(x && typeof x === 'string' && x.indexOf(`{`) > -1) x = JSON.parse(x);
			}

			// For mobile popouts only.
			if(typeof window.ReactNativeWebView === 'undefined'){
				window.ReactNativeWebView = {
					postMessage:() => {}
				};
			}

			let resolvers = {};

			window.ReactNativeWebView.response = ({id, result}) => {
				parseIfNeeded(result);
				resolvers[id](result);
				delete resolvers[id];
			}

			const proxyGet = (prop, target, key) => {
				if (key === 'then') {
					return (prop ? target[prop] : target).then.bind(target);
				}

				if(key === 'socketResponse'){
					return (prop ? target[prop] : target)[key];
				}

				return (...params) => new Promise(async resolve => {
					const id = IdGenerator.text(24);
					resolvers[id] = resolve;
					window.ReactNativeWebView.postMessage(JSON.stringify({id, prop, key, params}));
				});
			};

			const proxied = (prop) => new Proxy({}, { get(target, key){ return proxyGet(prop, target, key); } });


			window.wallet = new Proxy({
				storage:proxied('storage'),
				utility:proxied('utility'),
				sockets:proxied('sockets'),
				biometrics:proxied('biometrics'),
			}, {
				get(target, key) {
					if(['storage', 'utility', 'sockets', 'biometrics'].includes(key)) return target[key];
					return proxyGet(null, target, key);
				},
			});



			// --------------------------------------------------------------------------------------------------------------------
			// These methods are being used temporarily in the mobile version
			// since there is no viable port of sjcl or aes-gcm
			window.ReactNativeWebView.mobileEncrypt = ({id, data, key}) => {
				parseIfNeeded(data);
				window.ReactNativeWebView.postMessage(JSON.stringify({type:'mobile_response', id, result:AES.encrypt(data, key)}));
				return true;
			};

			window.ReactNativeWebView.mobileDecrypt = ({id, data, key}) => {
				parseIfNeeded(data);
				window.ReactNativeWebView.postMessage(JSON.stringify({type:'mobile_response', id, result:AES.decrypt(data, key)}));
				return true;
			};

			const Mnemonic = require('@walletpack/core/util/Mnemonic').default;
			window.ReactNativeWebView.seedPassword = async ({id, password, salt}) => {
				const [_, seed] = await Mnemonic.generateMnemonic(password, salt);
				window.ReactNativeWebView.postMessage(JSON.stringify({type:'mobile_response', id, result:seed}));
				return true;
			};

			// Just because doing sha256 on a buffer in react is dumb.
			const ecc = require('eosjs-ecc');
			window.ReactNativeWebView.sha256 = ({id, data}) => {
				parseIfNeeded(data);
				window.ReactNativeWebView.postMessage(JSON.stringify({type:'mobile_response', id, result:ecc.sha256(Buffer.from(data))}));
				return true;
			};

			const log = console.log;
			const error = console.error;

			console.log = (...params) => {
				window.ReactNativeWebView.postMessage(JSON.stringify({type:'console', params}));
				return log(...params);
			};

			console.error = (...params) => {
				window.ReactNativeWebView.postMessage(JSON.stringify({type:'console', params}));
				return error(...params);
			};

		}
	}


	static setFakeWallet(){
		return new Promise(resolve => {
			require('@walletpack/core/services/utility/Framework').default.init({
				getVersion:() => '1.0.0',
			});

			let unlocked = true;

			require('@walletpack/core/models/Scatter').default.create().then(fakeScatter => {
				fakeScatter.onboarded = true;

				const network = require('@walletpack/core/models/Network').default.fromJson({
					blockchain:'eos',
					name:'EOS Mainnet',
					host:'nodes.get-scatter.com',
					port:443,
					protocol:'https',
					chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
				});

				const network2 = require('@walletpack/core/models/Network').default.fromJson({
					blockchain:'eos',
					name:'Telos Mainnet',
					host:'api.eos.miami',
					port:443,
					protocol:'https',
					chainId:'4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
					token:{
						blockchain:'eos',
						symbol:"TLOS",
						contract:"eosio.token",
						decimals:4
					}
				});

				const network3 = require('@walletpack/core/models/Network').default.fromJson({
					blockchain:'eth',
					name:'ETH Mainnet',
					host:'ethnodes.get-scatter.com',
					port:443,
					protocol:'https',
					chainId:'1'
				});

				const keypair = require('@walletpack/core/models/Keypair').default.fromJson({
					name:'testkey',
					privateKey:'{test:"key"}',
					publicKeys:[{key:'EOS7w5aJCv5B7y3a6f4WCwPSvs6TpCAoRGnGpiLMsSWbmxaZdKigd', blockchain:'eos'}],
					blockchains:['eos']
				});

				const keypair2 = require('@walletpack/core/models/Keypair').default.fromJson({
					name:'testkey2',
					privateKey:'{test:"key"}',
					publicKeys:[{key:'0xf4baba092bb9aaf76e0c03b856398b9ebed0819f', blockchain:'eth'}],
					blockchains:['eth']
				});

				const account = require('@walletpack/core/models/Account').default.fromJson({
					name:'ramdeathtest',
					authority:'active',
					publicKey:keypair.publicKeys[0].key,
					keypairUnique:keypair.unique(),
					networkUnique:network.unique(),
				})

				const account2 = require('@walletpack/core/models/Account').default.fromJson({
					name:'ramijames123',
					authority:'active',
					publicKey:keypair.publicKeys[0].key,
					keypairUnique:keypair.unique(),
					networkUnique:network.unique(),
				})

				const account3 = require('@walletpack/core/models/Account').default.fromJson({
					name:'telosmiamibp',
					authority:'active',
					publicKey:keypair.publicKeys[0].key,
					keypairUnique:keypair.unique(),
					networkUnique:network2.unique(),
				})

				const account4 = require('@walletpack/core/models/Account').default.fromJson({
					name:'',
					authority:'',
					publicKey:keypair2.publicKeys[0].key,
					keypairUnique:keypair2.unique(),
					networkUnique:network3.unique(),
				})

				fakeScatter.settings.networks.push(network);
				fakeScatter.settings.networks.push(network2);
				fakeScatter.settings.networks.push(network3);
				fakeScatter.keychain.keypairs.push(keypair);
				fakeScatter.keychain.keypairs.push(keypair2);
				fakeScatter.keychain.accounts.push(account);
				fakeScatter.keychain.accounts.push(account2);
				fakeScatter.keychain.accounts.push(account3);
				fakeScatter.keychain.accounts.push(account4);

				fakeScatter.keychain.identities[0].personal.email = 'nsjames@get-scatter.com';

				window.wallet = {
					getVersion:() => `testing_0.0.0`,
					/************************************/
					/**       SIGNING & WALLET         **/
					/************************************/
					availableBlockchains:() => ({
						EOSIO:'eos',
						ETH:'eth',
						TRX:'trx',
						BTC:'btc',
					}),
					exists:() => true,
					unlocked:() => unlocked,
					unlock:() => {
						unlocked = true;
						return fakeScatter;
					},
					lock:() => true,
					verifyPassword:async () => true,
					changePassword:async () => true,
					hardwareTypes:async () => [],
					hardwareKeys:() => [],
					getPrivateKey:() => null,
					sign:() => 'tester',
					encrypt:() => null,
					decrypt:() => null,
					getSalt:() => null,
					setSalt:() => null,



					/************************************/
					/**        FILES / STORAGE         **/
					/************************************/
					storage:{
						setWalletData:() => fakeScatter,
						getWalletData:() => fakeScatter,
						clearWalletData:() => true,
						getDefaultPath:() => 'nopath',

						saveFile:() => true,
						openFile:() => true,
						getFileLocation:() => true,
						getFolderLocation:() => true,
						mkdir:() => true,

						cacheABI:() => true,
						getCachedABI:() => true,
						getTranslation:() => true,
						setTranslation:() => true,
						getHistory:() => [],
						updateHistory:() => true,
						deltaHistory:() => true,
						swapHistory:() => true,
					},


					/************************************/
					/**           UTILITIES            **/
					/************************************/
					utility:{
						openTools:() => true,
						closeWindow:() => true,
						flashWindow:() => true,
						openLink:() => true,
						reload:() => window.reload(),
						copy:() => true,
						screenshot:() => true,
						openPopOut:() => true,
						popoutResponse:() => true,
						socketResponse:() => {},
						pushNotification:() => true
					},

					sockets:{
						initialize:() => true,
					},
				}

				resolve(true);
			});
		})
	}

}
