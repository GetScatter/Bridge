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

	static addContact(recipient, blockchain, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('addContact', {recipient, blockchain}, callback))
	}

	static buyTokens(token, amount = null, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('buyTokens', {token, amount}, callback))
	}

	static getPassword(callback, confirm = false){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('getPassword', {confirm}, callback))
	}

	static twoFactorAuth(callback, firstTime = false){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('twoFactorAuth', {firstTime}, callback))
	}

}