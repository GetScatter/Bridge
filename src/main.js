import './styles/styles.scss'

import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import WebHelpers from "./services/WebHelpers";

import ViewBase from './views/_ViewBase';
import Button from './components/reusable/Button';
import AnimatedNumber from './components/reusable/AnimatedNumber';

class Main {

	constructor(){
		const components = [
			{tag:'view-base', vue:ViewBase},
			{tag:'Button', vue:Button},
			{tag:'AnimatedNumber', vue:AnimatedNumber},
		];
		const middleware = (to, next) => next();
		WebHelpers.initializeCore();

		new VueInitializer(Routing.routes(), components, middleware);
	}

}

new Main();
