
const Dashboard  = () => import('../views/Dashboard');
const Wallet  = () => import('../views/Wallet');
const Identity  = () => import('../views/Identity');
const Apps  = () => import('../views/Apps');



export const RouteNames = {
	Dashboard:'Dashboard',
	Wallet:'Wallet',
	Identity:'Identity',
	Apps:'Apps',
};

const RouteViews = {
	[RouteNames.Dashboard]:Dashboard,
	[RouteNames.Wallet]:Wallet,
	[RouteNames.Identity]:Identity,
	[RouteNames.Apps]:Apps,
};

const RoutePaths = {
	[RouteNames.Dashboard]: '/',
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
			// RouteNames.LOGIN,
			// RouteNames.POP_OUT,
		].includes(routeName)
	}

}
