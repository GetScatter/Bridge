import {Popup, PopupData, PopupDisplayTypes} from "scatter-core/models/popups/Popup";

export default class Popups {

	static addCreditCard(callback){
		return new Popup(PopupDisplayTypes.POP_IN, new PopupData('addCreditCard', {}, callback))
	}

}