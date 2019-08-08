import StoreService from "@walletpack/core/services/utility/StoreService";
import PopupService from "../utility/PopupService";
import Popups from "../../util/Popups";

const API_PUB_KEY = 'pk_test_uQlwYQs3jLbrl53VWKv1xW1XZ7eHsr65';

let token;
const BASE = `https://api.moonpay.io/v2`;
const POST = (route,body, method = "POST") => fetch(`${BASE}/${route}`, {
	method,
	headers: {
		"Authorization":token ? `Bearer ${token}` : null,
		"Content-Type": "application/json",
	},
	body:JSON.stringify(body),
}).then(x => x.json());
const GET = (route) => fetch(`${BASE}/${route}`, {
	headers:{
		"Authorization":token ? `Bearer ${token}` : null,
		"Content-Type": "application/json",
	}
}).then(x => x.json());


const identity = () => StoreService.get().state.scatter.keychain.identities[0];

export default class Moonpay {

	static async isAvailable(){
		return GET('ip_address').then(x => x.isAllowed).catch(() => {
			console.error(`Can't reach moonpay API`);
			return false;
		})
	}

	static async login(card){
		if(token) return GET(`customers/me`);
		return new Promise(async resolve => {
			const check = securityCode => POST(`customers/email_login?apiKey=${API_PUB_KEY}`, {
				email:identity().personal.email,
				securityCode
			})

			const prelim = await check(null);
			if(prelim.hasOwnProperty('preAuthenticated')){
				PopupService.push(Popups.enterSecurityCode(`Check your email for a security code from Moonpay.`, async code => {
					if(!code) resolve(PopupService.push(Popups.snackbar("No security code provided.")));
					const authenticated = await check(code);
					if(!authenticated.hasOwnProperty('token')) return resolve(PopupService.push(Popups.snackbar("There was an error authenticating with Moonpay.")));
					token = authenticated.token;
					resolve(authenticated.customer);
				}))
			}
		})
	}

	static cardToCustomer(card){
		return {
			firstName:card.secure.personalInformation.firstname,
			lastName:card.secure.personalInformation.lastname,
			address:{
				street:card.secure.personalInformation.address,
				subStreet:null,
				town:card.secure.personalInformation.state,
				postCode:card.secure.personalInformation.zipcode,
				country:card.secure.personalInformation.country,
			},
		}
	}

	static async updateCustomer(card){
		return POST(`customers/me`, this.cardToCustomer(card), "PATCH");
	}

	static async buy(token, card, cvx){
		const customer = await this.login(card);
		if(!customer) return;

		const cardCustomer = this.cardToCustomer(card);
		const customerHasChanged = Object.keys(cardCustomer).some(key => customer[key] !== cardCustomer[key]);
		if(customerHasChanged) {
			const updated = await this.updateCustomer(card);
			console.log('updated', updated);
		}

		const availableCards = await GET(`cards`);
		console.log(availableCards);

		if(!availableCards.find(x => x.lastDigits === card.secure.lastFour)){
			const expiry = card.expiration.split('/');
			const addedCard = await POST(`cards`, {
				number:card.secure.number,
				expiryMonth:parseInt(expiry[0]),
				expiryYear:parseInt(`20${expiry[1]}`),
				cvc:cvx,
			});
			console.log('added card', addedCard);
		}




	}

}