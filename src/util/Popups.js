import {Popup, PopupData, PopupDisplayTypes} from "../models/popups/Popup";

export default class Popups {

	static transactionSuccess(blockchain, tx){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('transactionSuccess', {blockchain, tx}, () => {}))
	}

	static checkHardwareWalletScreen(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('checkHardwareWalletScreen', {}, callback))
	}

	static viewAppRatings(app){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('viewAppRatings', {app}, () => {}))
	}

	static manageIdentity(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('manageIdentity', {}, callback))
	}

	static addCreditCard(callback, card = null){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('addCreditCard', {card}, callback))
	}

	static noAccount(network, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('noAccount', {network}, callback))
	}

	static createEosAccount(network, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('createEosAccount', {network}, callback))
	}

	static discardTokens(token, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('discardTokens', {token}, callback))
	}

	static exchange(token, callback, toToken = null){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('exchange', {token, toToken}, callback))
	}

	static savings(token, callback, open = false){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('savings', {token, open}, callback))
	}

	static transfer(account, token, callback, recipient = null){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('transfer', {account, token, recipient}, callback))
	}

	static transferStable(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('transferStable', {}, callback))
	}

	static importMnemonic(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('importMnemonic', {}, callback))
	}

	static requestStable(friend, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('requestStable', {friend}, callback))
	}

	static buyTokens(token, amount = null, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('buyTokens', {token, amount}, callback))
	}

	static stabilize(token, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('stabilize', {token}, callback))
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

	static editNetworkAccount(network, callback, importing = false){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('editNetworkAccount', {network, importing}, callback))
	}

	static exportPrivateKey(keypair, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('exportPrivateKey', {keypair}, callback))
	}

	static convertKeypair(keypair, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('convertKeypair', {keypair}, callback))
	}

	static exportMnemonic(callback = () => {}){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('exportMnemonic', {}, callback))
	}

	static receive(token = null){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('receive', {token}, () => {}))
	}

	static receiveIdentity(){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('receiveIdentity', {}, () => {}))
	}

	static confirmDeleteKeypair(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('confirmDeleteKeypair', {}, callback))
	}

	static confirmDeleteHistory(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('confirmDeleteHistory', {}, callback))
	}

	static goPremium(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('goPremium', {}, callback))
	}

	static friendsList(callback, token = null, addFriendFrom = null){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('friendsList', {token, addFriendFrom}, callback))
	}

	static moveRidlTokens(token, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('moveRidlTokens', {token}, callback))
	}

	static changeIdentityKey(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('changeIdentityKey', {}, callback))
	}

	static addOrEditNetwork(network, callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('addOrEditNetwork', {network}, callback))
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





	/********************************/
	/**********   WIDGETS   *********/
	/********************************/

	static moonpay(token = null, amount = null, to = null, memo = null, email = null, random = null){
		return new Popup(PopupDisplayTypes.POP_OUT, new PopupData('moonpay', {token, amount, to, memo, email, random}), false, {width:600, height:600})
	}

	static kyc(identity){
		return new Popup(PopupDisplayTypes.POP_OUT, new PopupData('kyc', {identity}), false, {width:1080, height:800})
	}

}
