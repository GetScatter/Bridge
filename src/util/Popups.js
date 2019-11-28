import {Popup, PopupData, PopupDisplayTypes} from "../models/popups/Popup";

export default class Popups {

	static transactionSuccess(blockchain, tx){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('transactionSuccess', {blockchain, tx}, () => {}))
	}

	static addCreditCard(callback, card = null){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('addCreditCard', {card}, callback))
	}

	static createEosAccount(network, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('createEosAccount', {network}, callback))
	}

	static exchange(token, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('exchange', {token}, callback))
	}

	static transfer(account, token, callback, recipient = null){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('transfer', {account, token, recipient}, callback))
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

	static scanQR(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('scanQR', {}, callback))
	}

	static enterSecurityCode(text, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('enterSecurityCode', {text}, callback))
	}

	static resetScatter(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('resetScatter', {}, callback))
	}

	static moonpayCode(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('moonpayCode', {}, callback))
	}

	static allowRestrictedApps(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('allowRestrictedApps', {}, callback))
	}

	static editNetworkAccount(network, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('editNetworkAccount', {network}, callback))
	}

	static exportPrivateKey(keypair, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('exportPrivateKey', {keypair}, callback))
	}

	static allowPopups(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('allowPopups', {}, callback))
	}

	static showTerms(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('showTerms', {}, callback))
	}

	static snackbar(message, timeout = 5000){
		return new Popup(PopupDisplayTypes.SNACKBAR, new PopupData('', { message, timeout }))
	}

}
