import './styles/styles.scss'
require('dotenv').config();

import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import {RouteNames} from './vue/Routing'
import WebHelpers from "./services/WebHelpers";

import ViewBase from './views/_ViewBase';
import Button from './components/reusable/Button';
import Input from './components/reusable/Input';
import AnimatedNumber from './components/reusable/AnimatedNumber';
import SearchBar from './components/reusable/SearchBar';
import StoreService from '@walletpack/core/services/utility/StoreService';

// For now we're importing the whole library. Once we have the final icon set..
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import '@fortawesome/fontawesome-pro/css/all.css'
import '@fortawesome/fontawesome-pro/js/all.js'

// .. We can import only the required icons using this format for each icon
// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
// library.add(faCoffee)

class Main {

	constructor(){

		const components = [
			{tag:'view-base', vue:ViewBase},
			{tag:'Button', vue:Button},
			{tag:'Input', vue:Input},
			{tag:'SearchBar', vue:SearchBar},
			{tag:'AnimatedNumber', vue:AnimatedNumber},
			{tag:'FontAwesomeIcon', vue:FontAwesomeIcon}
		];

		const hash = location.hash.replace("#/", '');
		const middleware = (to, next) => {
			if(hash === 'popout') return next();

			if(Routing.isRestricted(to.name)) {
				StoreService.get().getters.unlocked ? next() : next({name:RouteNames.Login});
			}

			else if(!Routing.isRestricted(to.name) && StoreService.get().getters.unlocked) {
				StoreService.get().getters.unlocked ? next({name:RouteNames.Dashboard}) : next();
			}

			else next();
		};

		WebHelpers.initializeCore();

		new VueInitializer(Routing.routes(), components, middleware);


	}

}

new Main();
