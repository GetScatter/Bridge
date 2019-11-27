import StoreService from "@walletpack/core/services/utility/StoreService";
import * as Actions from "@walletpack/core/store/constants";
import StorageService from "../utility/StorageService";


export default class CreditCardService {

	static async saveCard(card){
		const scatter = StoreService.get().state.scatter.clone();

		if(card){
			await this.alignIdentity(scatter, card);
			card.lastFour = card.secure.number.slice(card.secure.number.length-4, card.secure.number.length);
			card.hash();
		}

		// Bridge
		// await StorageService.setCard(card);
		scatter.keychain.cards = card ? [card.clone()] : [];
		return await StoreService.get().dispatch(Actions.SET_SCATTER, scatter);
	}

	static async alignIdentity(scatter, card){
		const identity = StoreService.get().state.scatter.keychain.identities[0].clone();
		const location = StoreService.get().state.scatter.keychain.locations[0].clone();

		const names = card.secure.personalInformation.name.split(' ')
		if(!identity.personal.firstname.length){
			if(names.length === 1){
				identity.personal.firstname = names[0];
			} else {
				identity.personal.firstname = names.slice(0, names.length - 1);
				identity.personal.lastname = names.slice(names.length - 1, names.length);
			}
		}

		if(!identity.personal.email.length) identity.personal.email = card.secure.personalInformation.email;
		if(!identity.personal.birthdate.length) identity.personal.birthdate = card.secure.personalInformation.birthdate;
		if(!identity.personal.birthdate.length) identity.personal.birthdate = card.secure.personalInformation.birthdate;
		if(!location.address.length) location.address = card.secure.personalInformation.address;
		if(!location.city.length) location.city = card.secure.personalInformation.city;
		if(!location.state.length) location.state = card.secure.personalInformation.state;
		if(!location.country.length) location.country = card.secure.personalInformation.country;
		if(!location.zipcode.length) location.zipcode = card.secure.personalInformation.zipcode;
		scatter.keychain.identities = [identity];
		scatter.keychain.locations = [location];
		return true;
	}

	static async removeCard(){
		return this.saveCard(null);
	}

	static isValid(number){

		const luhnCheck = val => {
			let sum = 0;
			for (let i = 0; i < val.length; i++) {
				let intVal = parseInt(val.substr(i, 1));
				if (i % 2 === 0) {
					intVal *= 2;
					if (intVal > 9) intVal = 1 + (intVal % 10);
				}
				sum += intVal;
			}
			return (sum % 10) === 0;
		};

		return new RegExp("^[0-9]{15,16}$").test(number) && luhnCheck(number);
	}

}
