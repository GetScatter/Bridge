import IdGenerator from '@walletpack/core/util/IdGenerator';
import ecc from 'eosjs-ecc';
const PROOF_KEY = 'EOS62b3WxfuRyP7JYaDbF3gr49joLWYpsF3kPmo2HPxPuGRDiRUwj';
import * as Actions from '@walletpack/core/store/constants';
import StoreService from '@walletpack/core/services/utility/StoreService';
import BalanceHelpers from "./BalanceHelpers";

const HOST = 'wss://api.get-scatter.com/ws';

let ws;
let resolvers = {
	// [id]:resolver()
};

let priceInterval;
let intervalTime = 60000 * 5;

const validate = (id, signed) => {
	try {
		return ecc.recover(signed, id) === PROOF_KEY;
	} catch(e){ return false; }
};

export default class WebsocketAPIService {

	static async connect(){
		return new Promise((resolve) => {
			if(!ws || !ws.connected){
				ws = new WebSocket(HOST);
				ws.onopen = () => resolve(true);
				ws.onerror = () => resolve(false);
				ws.onmessage = event => {
					try {
						const {data, id, signed} = JSON.parse(event.data);
						const resolver = resolvers[id];
						delete resolvers[id];
						if(!validate(id, signed)) return resolver(console.error('API websocket validation error'));
						resolver(data);
					}catch(e){
						console.error('e', e);
					}
				}
			} else resolve(true);
		});
	}

	static async send(route, data){
		const id = IdGenerator.text(24);
		let resolver;
		const promise = new Promise(r => resolver = r);
		resolvers[id] = resolver;
		ws.send(JSON.stringify({ route, data, id }));
		return promise;
	}

	static async getApps(include = [], store = true, imageBackend = 'https://rawgit.com/GetScatter/ScatterApps/master/logos', filetype = 'svg'){
		if(!await this.connect()) return console.error('Could not connect to websocket');
		const apps = await WebsocketAPIService.send(`apps`, include);
		const formattedApps = apps.reduce((acc,x) => {
			if(x.hasOwnProperty('hasimage')) x.img = `${imageBackend}/${x.applink}.${filetype}`;

			acc[x.applink] = x;
			return acc;
		}, {});

		if(store && StoreService.get()) {
			StoreService.get().dispatch(Actions.SET_DAPP_DATA, formattedApps);
		}

		return formattedApps;
	}

	static async watchPrices(enable = true){
		clearInterval(priceInterval);
		if(!enable) return;
		return new Promise(async resolve => {

			const setPrices = async () => {
				await WebsocketAPIService.setPrices();
				resolve(true);
			}

			await setPrices();
			priceInterval = setInterval(async () => {
				await setPrices();
			}, intervalTime);
		})
	}

	static async setPrices(){
		if(!await this.connect()) return console.error('Could not connect to websocket');
		const prices = await Promise.race([
			new Promise(resolve => setTimeout(() => resolve(false), 10000)),
			WebsocketAPIService.send(`prices`, BalanceHelpers.getStableCoinUniques().concat([
				'eos:eosio.token:tlos:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'
			])).catch(() => {
				return null;
			})
		]);
		if(prices && Object.keys(prices).length) {
			await StoreService.get().dispatch(Actions.SET_PRICES, prices);
		}
	}

	static async getRoute(route){
		if(!await this.connect()) return console.error('Could not connect to websocket');
		return Promise.race([
			await WebsocketAPIService.send(route),
			new Promise(r => setTimeout(() => r(null), 2000))
		]);
	}

}
