import {Popup, PopupData, PopupDisplayTypes} from "../models/popups/Popup";

export default class Popups {

	static addCreditCard(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('addCreditCard', {}, callback))
	}

	static createEosAccount(network, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('createEosAccount', {network}, callback))
	}

	static exchange(token, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('exchange', {token}, callback))
	}

	static transfer(account, token, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('transfer', {account, token}, callback))
	}

}