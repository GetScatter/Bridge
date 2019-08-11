import './styles/styles.scss'
require('dotenv').config();

import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import {RouteNames} from './vue/Routing'
import WebHelpers from "./services/utility/WebHelpers";

import ViewBase from './views/_ViewBase';
import Button from './components/reusable/Button';
import Input from './components/reusable/Input';
import AnimatedNumber from './components/reusable/AnimatedNumber';
import SearchBar from './components/reusable/SearchBar';
import Switcher from './components/reusable/Switcher';
import StoreService from '@walletpack/core/services/utility/StoreService';

import VLazyImage from "v-lazy-image";

import '@fortawesome/fontawesome-pro/css/all.css'
import Loader from "./util/Loader";
// import '@fortawesome/fontawesome-pro/js/all.js'

class Main {

	constructor(){

		const components = [
			VLazyImage,
			{tag:'view-base', vue:ViewBase},
			{tag:'Button', vue:Button},
			{tag:'Input', vue:Input},
			{tag:'SearchBar', vue:SearchBar},
			{tag:'AnimatedNumber', vue:AnimatedNumber},
			{tag:'Switcher', vue:Switcher},
		];

		const pathname = location.pathname.replace("/", '');
		const middleware = (to, next) => {
			if(pathname === 'popout') next();

			else if(Routing.isRestricted(to.name)) {
				StoreService.get().getters.unlocked ? next() : next({name:RouteNames.Login});
			}

			else if(!Routing.isRestricted(to.name) && StoreService.get().getters.unlocked) {
				StoreService.get().getters.unlocked ? next({name:RouteNames.Dashboard}) : next();
			}

			else next();
		};

		WebHelpers.initializeCore();

		new VueInitializer(Routing.routes(), components, middleware);

		let interval;
		const fetch = window.fetch;
		window.fetch = async (...params) => {
			return new Promise((resolve, reject) => {
				console.log('fetching', interval, params);

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

}

new Main();
