import './styles/styles.scss'
require('dotenv').config();

import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import {RouteNames} from './vue/Routing'
import WebHelpers from "./services/WebHelpers";

import ViewBase from './views/_ViewBase';
import Button from './components/reusable/Button';
import AnimatedNumber from './components/reusable/AnimatedNumber';
import StoreService from 'scatter-core/services/utility/StoreService';

class Main {

	constructor(){

		const components = [
			{tag:'view-base', vue:ViewBase},
			{tag:'Button', vue:Button},
			{tag:'AnimatedNumber', vue:AnimatedNumber},
		];

		const hash = location.hash.replace("#/", '');
		const middleware = (to, next) => {
			if(hash === 'popout') return next();
			if(Routing.isRestricted(to.name)) StoreService.get().getters.unlocked ? next() : next({name:RouteNames.Login});
			else next();
		};

		WebHelpers.initializeCore();

		new VueInitializer(Routing.routes(), components, middleware);
	}

}

new Main();
