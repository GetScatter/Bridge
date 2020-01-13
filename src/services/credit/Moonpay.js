import StoreService from "@walletpack/core/services/utility/StoreService";
import PopupService from "../utility/PopupService";
import Popups from "../../util/Popups";
import Seeder from "@walletpack/core/services/secure/Seeder";
import {PAYMENT_SERVICES} from "./PurchasingService";
import WatcherService from "../utility/WatcherService";
import WindowService from "../utility/WindowService";
import KYCService from "../kyc/KYCService";
import {store} from "../../store/store";
import * as BackendApiService from '@walletpack/core/services/apis/BackendApiService'

const API_PUB_KEY = process.env.VUE_APP_MOONPAY_KEY || 'pk_test_uQlwYQs3jLbrl53VWKv1xW1XZ7eHsr65';
const BASE = 'https://api.moonpay.io/v3';

let token;

const POST = (route,body, method = "POST") => fetch(`${BASE}/${route}`, {
	mode: 'cors',
	method,
	headers: {
		"Authorization":token ? `Bearer ${token}` : null,
		"Content-Type": "application/json",
	},
	body:JSON.stringify(body),
}).then(x => x.json());
const GET = (route, method = "GET") => fetch(`${BASE}/${route}`, {
	method,
	headers:{
		"Authorization":token ? `Bearer ${token}` : null,
		"Content-Type": "application/json",
	}
}).then(x => x.json());


const identity = () => StoreService.get().state.scatter.keychain.identities[0];

let loggingIn = false;
let refusedLogin = false;

export default class Moonpay {

	static async checkStatus(random = ''){
		const id = store.state.scatter.hash + random;
		return BackendApiService.GET(`hook/moonpay/${id}`);
	}

	static async removeHook(id){
		return BackendApiService.GET(`hook/remove/${id}`);
	}

	static async isAvailable(){
		return true;
		return GET(`ip_address?apiKey=${API_PUB_KEY}`).then(x => x.isAllowed).catch(() => {
			console.error(`Can't reach moonpay API`);
			return false;
		})
	}

	static async getTokenPrice(token){
		return GET(`currencies/${token.symbol.toLowerCase()}/price?apiKey=${API_PUB_KEY}`)
	}

	static async login(card){
		let email;
		if(card.isEncrypted()){
			const clone = card.clone();

			// From bridge
			// clone.decrypt(await Seeder.getSeed());
			// email = clone.secure.personalInformation.email;

			const secure = await window.wallet.decrypt(clone.secure);
			email = secure.personalInformation.email;

		} else email = card.secure.personalInformation.email;


		if(token) return GET(`customers/me`);
		return new Promise(async resolve => {
			const check = securityCode => POST(`customers/email_login?apiKey=${API_PUB_KEY}`, {
				email,
				securityCode
			})

			loggingIn = true;

			const prelim = await check(null);
			if(prelim.hasOwnProperty('preAuthenticated')){
				PopupService.push(Popups.moonpayCode(async code => {
					loggingIn = false;
					if(!code) return resolve(PopupService.push(Popups.snackbar("You must authenticate with MoonPay before you can continue.")));
					const authenticated = await check(code);
					if(!authenticated.hasOwnProperty('token')) return resolve(PopupService.push(Popups.snackbar("There was an error authenticating with Moonpay.")));
					token = authenticated.token;
					resolve(authenticated.customer);
				}))
			}
		})
	}

	static async cardToCustomer(card){
		return {
			firstName:card.secure.personalInformation.firstname,
			lastName:card.secure.personalInformation.lastname,
			address:{
				street:card.secure.personalInformation.address,
				subStreet:null,
				town:card.secure.personalInformation.state,
				postCode:card.secure.personalInformation.zipcode,
				country:await this.getCountryCode(card.secure.personalInformation.country),
			},
		}
	}

	static async updateCustomer(card){
		return POST(`customers/me`, await this.cardToCustomer(card), "PATCH").catch(err => {
			console.error('Moonpay.updateCustomer error', err);
			// PopupService.push(Popups.snackbar(err))
			return false;
		});
	}

	static async buy(buyingToken, account, card, cvx){
		card = card.clone();

		if(card.isEncrypted()) {
			// Bridge
			// card.decrypt(await Seeder.getSeed());
			card.secure = await window.wallet.decrypt(card.secure);
		}
		const customer = await this.login(card);
		if(!customer) return;

		// VALIDATING CUSTOMER DATA UP-TO-DATE
		const cardCustomer = await this.cardToCustomer(card);
		const customerHasChanged = Object.keys(cardCustomer).some(key => customer[key] !== cardCustomer[key]);
		if(customerHasChanged) await this.updateCustomer(card);


		// VALIDATING CARD EXISTS
		// ADDING IF NOT AVAILABLE
		const availableCards = await GET(`cards`);
		let moonpayCard = availableCards.find(x => x.lastDigits === card.secure.lastFour);
		if(!moonpayCard){
			const expiry = card.expiration.split('/');
			moonpayCard = await POST(`cards`, {
				number:card.secure.number,
				expiryMonth:parseInt(expiry[0]),
				expiryYear:parseInt(`20${expiry[1]}`),
				cvc:cvx.toString(),
			}).catch(err => {
				console.error(err);
				return null;
			});
		}

		// REMOVING OLD CARDS
		// const oldCards = availableCards.filter(x => x.lastDigits !== card.secure.lastFour);
		// if(oldCards.length){
		// 	setTimeout(async () => {
		// 		for(let i = 0; i < oldCards.length; i++){
		// 			await GET(`card/${oldCards[i].id}`, "DELETE");
		// 		}
		// 	}, 1);
		// }

		if(!moonpayCard) return false;
		const fiatPrice = parseFloat((parseFloat(buyingToken.fiatPrice(false)) * parseFloat(buyingToken.amount)).toFixed(2));

		// BUYING TOKENS
		const bought = await POST('transactions', {
			baseCurrencyAmount:fiatPrice,
			extraFeePercentage:1,
			areFeesIncluded:false,
			walletAddress:'bigbangzhiya',//account.sendable(),
			baseCurrencyCode:StoreService.get().state.scatter.settings.displayCurrency.toLowerCase(),
			currencyCode:buyingToken.symbol.toLowerCase(),
			returnUrl:'',
			cardId:moonpayCard.id,
		}).catch(err => {
			console.error(err);
			PopupService.push(Popups.snackbar(`There was an error purchasing your ${token.symbol}. Please contact support`));
			return null;
		}).then(res => {
			if(res.hasOwnProperty('errors')){
				console.error('Moonpay error: ', res);
				PopupService.push(Popups.snackbar(`There was an error purchasing your ${token.symbol}. Please contact support`));
				return null;
			}

			return res;
		});

		if(bought){
			//Used for 3d-Secure

			// BRIDGE
			// if(bought.redirectUrl) WindowService.openSafeWindow(bought.redirectUrl);
			if(bought.redirectUrl) window.wallet.utility.openLink(bought.redirectUrl);

			WatcherService.addCreditCardPayment(bought.id, PAYMENT_SERVICES.Moonpay);

			KYCService.spent(fiatPrice);
			return true;
		}

		return false;
	}

	static async getCountryCode(country){
		if(typeof country !== 'string') country = country.code;
		return GET('countries').then(countries => {
			const found = countries.find(x => x.alpha2.toLowerCase() === country.toLowerCase());
			return found ? found.alpha3 : country;
		}).catch(() => country);
	}

	static async checkIfComplete(id){
		if(loggingIn) return;
		if(refusedLogin) return WatcherService.removeCreditCardPayment(id);
		return GET(`transactions/${id}`).then(async result => {

			if(result.type === 'UnauthorizedError'){
				const card = StoreService.get().state.scatter.keychain.cards[0];
				if(!card) return WatcherService.removeCreditCardPayment(id);
				else {
					if(!await this.login(card)){
						refusedLogin = true;
						WatcherService.removeCreditCardPayment(id);
					}
				}
			}

			if(result.status === 'completed') WatcherService.removeCreditCardPayment(id);
		}).catch(async err => {
			console.error(err);
			return false;
		})
	}

}
