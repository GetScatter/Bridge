import {RUNNING_TESTS, TestStore} from "@walletpack/core/util/TestingHelper";

const ABIS_NAME = 'abi';
const HISTORIES_NAME = 'histories';
const TRANSLATION_NAME = 'translation';
const SCATTER_DATA_NAME = 'scatter';
const SCATTER_INTERMED_NAME = 'scatter_intermed';

import {AES} from "aes-oop";
import {HISTORY_TYPES} from "@walletpack/core/models/histories/History";
import HistoricTransfer from "@walletpack/core/models/histories/HistoricTransfer";
import HistoricExchange from "@walletpack/core/models/histories/HistoricExchange";
import HistoricAction from "@walletpack/core/models/histories/HistoricAction";
import Seeder from "@walletpack/core/services/secure/Seeder";
import {saveFile} from "./FileService";
import Compressor from "../../util/Compressor";
import {GET, POST} from "../../util/API";
import Hasher from "@walletpack/core/util/Hasher";
import PopupService from "./PopupService";
import Popups from "../../util/Popups";

const isPopup = typeof location !== 'undefined' ? location.hash.indexOf('popout') > -1 : false;

let timeout;
export default class StorageService {

	constructor(){}

	static async saveFile(...params){
		// return saveFile(...params);
	};

	static async setScatter(scatter){
		// if(isPopup) return;
		//
		// const clone = scatter.clone();
		// clone.keychain.cards = [];
		//
		// const seed = await Seeder.getSeed();
		// const savable = AES.encrypt(clone.savable(seed), seed);
		//
		// return new Promise((resolve) => {
		// 	clearTimeout(timeout);
		// 	timeout = setTimeout(() => {
		// 		const data = Compressor.compress(savable).toString();
		// 		POST('data', {data});
		// 		return resolve(true);
		// 	}, 10000);
		// })
	};

	static async getScatter() {
		// let data = await GET('data').catch(() => null);
		// if(!data) return;
		// if(typeof data === 'object' && data.hasOwnProperty('error')) return PopupService.push(Popups.snackbar(data.error));
		// data = Compressor.decompress(data);
		// return data;
	}



	static getSalt(){
		// return window.localStorage.getItem('salt') || 'SALT_ME';
	}

	// TODO: Need to set a global salt,
	// TODO: maybe hashes of parts of the entropy and encryption keys so that it can be recreated instead?
	static setSalt(salt){
		// return window.localStorage.setItem('salt', salt);
	}

	static async getHistory(){
		// let history = window.localStorage.getItem('history');
		// if(!history) return [];
		// history = AES.decrypt(history, await Seeder.getSeed());
		//
		// history = history.map(x => {
		// 	if(x.type === HISTORY_TYPES.Transfer) return HistoricTransfer.fromJson(x);
		// 	if(x.type === HISTORY_TYPES.Exchange) return HistoricExchange.fromJson(x);
		// 	if(x.type === HISTORY_TYPES.Action) return HistoricAction.fromJson(x);
		// 	return null;
		// }).filter(x => x);
		//
		// return history;
	}

	static async updateHistory(x){
		// let history = await this.getHistory();
		// if(history.find(h => h.id === x.id)) history = history.filter(h => h.id !== x.id);
		// history.unshift(x);
		// const encrypted = AES.encrypt(history, await Seeder.getSeed());
		// return window.localStorage.setItem('history', encrypted);
	}

	static async deltaHistory(x){
		// let history = await this.getHistory();
		// if(x === null) history = [];
		// else {
		// 	if(history.find(h => h.id === x.id)) history = history.filter(h => h.id !== x.id);
		// 	else history.unshift(x);
		// }
		//
		// const encrypted = AES.encrypt(history, await Seeder.getSeed());
		// return window.localStorage.setItem('history', encrypted);
	}

	static async swapHistory(history){
		// const encrypted = AES.encrypt(history, await Seeder.getSeed());
		// return window.localStorage.setItem('history', encrypted);
	}

	static async setCard(card){
		// if(card) {
		// 	const seed = await Seeder.getSeed();
		// 	card.encrypt(seed);
		// 	const encrypted = AES.encrypt(card, seed);
		// 	return window.localStorage.setItem('_c', encrypted);
		// } else {
		// 	return window.localStorage.removeItem('_c');
		// }
	}

	static async getCard(){
		// let card = window.localStorage.getItem('_c');
		// if(!card) return null;
		// return AES.decrypt(card, await Seeder.getSeed());
	}

	static async deltaBought(id, data = null){
		let bought = await this.getBought();
		if(!bought) bought = [];
		if(data === null) bought = bought.filter(x => x.id !== id);
		else bought.push({id, data});

		if(bought.length === null){
			window.localStorage.removeItem(`bought`);
			return [];
		}

		const encrypted = window.wallet.encrypt(bought);
		window.localStorage.setItem(`bought`, encrypted);
		return bought;
	}

	static async getBought(){
		const bought = window.localStorage.getItem(`bought`);
		if(!bought) return [];
		return await window.wallet.decrypt(bought);
	}
}
