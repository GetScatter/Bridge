import './styles/styles.scss'
require('dotenv').config();

if(process.env.VUE_APP_SHOW_MOBILE_CONSOLE) {
	const VConsole = require('vconsole');
	const vConsole = new VConsole({});
}


import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import {RouteNames} from './vue/Routing'

import ViewBase from './views/_ViewBase';
import Button from './components/reusable/Button';
import Input from './components/reusable/Input';
import AnimatedNumber from './components/reusable/AnimatedNumber';
import SearchBar from './components/reusable/SearchBar';
import Switcher from './components/reusable/Switcher';
import Select from './components/reusable/Select';
import StoreService from '@walletpack/core/services/utility/StoreService';
import {store} from './store/store';

import VLazyImage from "v-lazy-image";

import '@fortawesome/fontawesome-pro/css/all.css'
import Loader from "./util/Loader";
import WalletTalk from "./util/WalletTalk";
import WalletHelpers from "./util/WalletHelpers";
import * as Actions from "@walletpack/core/store/constants";
import SingletonService from "./services/utility/SingletonService";

// f12 to open console from anywhere.
document.addEventListener("keydown", e => {
	if(!window.wallet) return;
	if (e.which === 123) window.wallet.utility.openTools(window.wallet.windowId);
});



let cssLoaded = false;
const loadStyles = async HOST => {
	if(cssLoaded) return;
	cssLoaded = true;

	const head = document.getElementsByTagName('head')[0];

	const applyStyles = styles => {
		const linkElement = document.createElement('style');
		linkElement.setAttribute('type', 'text/css');
		linkElement.innerHTML = styles;
		head.appendChild(linkElement);
	}

	const fontawesome = await Promise.race([
		fetch(HOST+"static/fonts/fontawesome.css").then(x => x.text()).catch(() => null),
		new Promise(r => setTimeout(() => r(null), 2000))
	]);

	if(!fontawesome) console.log("There was an error setting up fontawesome.");
	applyStyles(fontawesome.replace(/INSERT_HOST/g, HOST+"static/fonts"));

	[
		"static/fonts/token-icons",
		"static/fonts/scatter-logo",
	].map(async stylesheet => {

		const PATH = HOST+stylesheet;

		let styles = await Promise.race([
			fetch(PATH+"/style.css").then(x => x.text()).catch(() => null),
			new Promise(r => setTimeout(() => r(null), 2000))
		]);
		if(!styles) return console.log("There was a problem fetching the CSS for '"+stylesheet+"'.");

		// Remodeling the paths
		styles = styles.replace(/fonts\//g, PATH+"/fonts/");

		applyStyles(styles);
	});
}

window.loadStyles = loadStyles;





const isPopOut = location.hash.replace("#/", '').split('?')[0] === 'popout' || !!window.PopOutWebView;

class Main {

	constructor(){

		if(process.env.VUE_APP_NO_WALLET){
			loadStyles('http://localhost:8081/');
		}

		this.checkForWallet();
	}

	setupUI(){
		const components = [
			VLazyImage,
			{tag:'view-base', vue:ViewBase},
			{tag:'Button', vue:Button},
			{tag:'Input', vue:Input},
			{tag:'SearchBar', vue:SearchBar},
			{tag:'AnimatedNumber', vue:AnimatedNumber},
			{tag:'Switcher', vue:Switcher},
			{tag:'Select', vue:Select},
		];

		// const pathname = location.pathname.replace("/", '');
		// const middleware = (to, next) => {
		// 	if(pathname === 'popout') next();
		//
		// 	else if(Routing.isRestricted(to.name)) {
		// 		StoreService.get().getters.unlocked ? next() : next({name:RouteNames.Login});
		// 	}
		//
		// 	else if(!Routing.isRestricted(to.name) && StoreService.get().getters.unlocked) {
		// 		StoreService.get().getters.unlocked ? next({name:RouteNames.Dashboard}) : next();
		// 	}
		//
		// 	else next();
		// };
		//
		// // WebHelpers.initializeCore();
		//
		// new VueInitializer(Routing.routes(), components, middleware);



		// Once unlocked, simply returns true instead
		// of hitting the wallet each time.
		let unlocked = null;
		const isUnlocked = async () => {
			if(window.wallet) {
				if (!unlocked) unlocked = await window.wallet.unlocked();
				return unlocked;
			} else return store.getters.unlocked;
		};

		const middleware = async (to, next) => {
			if(isPopOut) {
				if(to.name !== RouteNames.POP_OUT) return next({name:RouteNames.POP_OUT});
				return next();
			}
			else if(Routing.isRestricted(to.name)) await isUnlocked() ? next() : next({name:RouteNames.Login});
			else next();
		};

		new VueInitializer(Routing.routes(), components, middleware);
		this.setupFetchLoadingBars();

		return true;

	}

	setupFetchLoadingBars(){
		let interval;
		const fetch = window.fetch;
		window.fetch = async (...params) => {
			return new Promise((resolve, reject) => {

				const resetBar = () => {
					Loader.setWorkingBar(100);
					setTimeout(() => {
						Loader.setWorkingBar('revert')
						setTimeout(() => {
							Loader.setWorkingBar(null)
							clearInterval(interval);
							interval = null;
						}, 200)
					}, 200);

				}

				if(!interval) {
					let counter = 0;
					interval = setInterval(() => {
						counter += 20;
						if (counter > 99) counter = 99;
						Loader.setWorkingBar(counter);
					}, 100);

					fetch(...params).then(res => {
						resetBar();
						resolve(res);
					}).catch(err => {
						resetBar();
						reject(err);
					})
				} else {
					fetch(...params).then(res => {
						resolve(res);
					}).catch(err => {
						reject(err);
					})
				}


			})
		};
	}

	checkForWallet(){

		const setupWallet = async () => {
			await WalletTalk.setup();
			await WalletHelpers.init(isPopOut);

			if(WalletHelpers.getWalletType() === 'extension' && await window.wallet.unlocked()){
				await store.dispatch(Actions.LOAD_SCATTER);
			}

			return this.setupUI();
		}

		if(process.env.VUE_APP_NO_WALLET){

			WalletTalk.setFakeWallet().then(async () => {
				await store.dispatch(Actions.LOAD_SCATTER);
				await setupWallet();
			})

		} else {
			let foundWallet = false;
			let interval;
			const checkWallet = () => {
				if(window.wallet || window.ReactNativeWebView || window.PopOutWebView){
					if(foundWallet) return;
					foundWallet = true;
					clearInterval(interval);
					setupWallet();
				}
			};

			checkWallet();
			interval = setInterval(() => checkWallet(), 100);


		}


		// return new Promise(r => {
		//
		// 	let timeStarted = +new Date();
		// 	let foundWallet = false;
		// 	let interval;
		// 	const checkWallet = async () => {
		// 		if(window.wallet || window.ReactNativeWebView || window.PopOutWebView){
		// 			if(foundWallet) return;
		// 			foundWallet = true;
		// 			console.log('setting up wallet');
		// 			clearInterval(interval);
		//
		// 			await WalletTalk.setup();
		// 			await WalletHelpers.init(isPopOut);
		//
		// 			if(WalletHelpers.getWalletType() === 'extension' && await window.wallet.unlocked()){
		// 				await store.dispatch(Actions.LOAD_SCATTER);
		// 				SingletonService.init();
		// 			}
		//
		// 			return r(true);
		// 		}
		//
		// 		// Might just be using bridge oauth. Don't need to eat up the thread.
		// 		else if (timeStarted+(1000*2) < +new Date()) {
		// 			clearInterval(interval);
		// 			return r(false);
		// 		}
		// 	};
		//
		// 	checkWallet();
		// 	interval = setInterval(() => checkWallet(), 100);
		//
		// });
	}

}

new Main();
