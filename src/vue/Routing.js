
// const PopOut  = () => import('../views/PopOut');
// const Dashboard  = () => import('../views/Dashboard');
// const Wallet  = () => import('../views/Wallet');
// const Identity  = () => import('../views/Identity');
// const Apps  = () => import('../views/Apps');
// const Login  = () => import('../views/Login');
// const Settings  = () => import('../views/Settings');

import PopOut from '../views/PopOut';
import Dashboard from '../views/Dashboard';
import Wallet from '../views/Wallet';
import Identity from '../views/Identity';
import Apps from '../views/Apps';
import Login from '../views/Login';
import Settings from '../views/Settings';
import Socialize from '../views/Socialize';



export const RouteNames = {
	POP_OUT:'popout',

	Dashboard:'Dashboard',
	Wallet:'Wallet',
	Identity:'Identity',
	Apps:'Apps',
	Login:'Login',
	Settings:'Settings',
	Socialize:'Socialize',
};

const RouteViews = {
	[RouteNames.Dashboard]:Dashboard,
	[RouteNames.Wallet]:Wallet,
	[RouteNames.Identity]:Identity,
	[RouteNames.Apps]:Apps,
	[RouteNames.Login]:Login,
	[RouteNames.Socialize]:Socialize,
	[RouteNames.Settings]:Settings,
	[RouteNames.POP_OUT]:PopOut,
};

const RoutePaths = {
	[RouteNames.Login]: '/',
};

export class Routing {

	static builder(){
		const routeNames = Object.keys(RouteNames).map(key => RouteNames[key]);

		let routesBuilder = {};
		routeNames.map(routeName => {
			routesBuilder[routeName] = {
				path:RoutePaths.hasOwnProperty(routeName) ? RoutePaths[routeName] : `/${routeName}`,
				name:routeName,
				component: RouteViews[routeName]
			}
		});

		return routesBuilder;
	}

	static routes(){
		return Object.keys(Routing.builder())
			.map(routeName => Routing.builder()[routeName]);
	}

	static isRestricted(routeName) {
		return ![
			RouteNames.Login,
			RouteNames.POP_OUT,
		].includes(routeName)
	}

}
