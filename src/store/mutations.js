import * as Mutations from '@walletpack/core/store/constants'
import * as UIActions from './ui_actions'
import Vue from 'vue';

export const mutations = {
	[UIActions.SET_PREMIUM]:(state, x) => state.hasPremium = x,
	[UIActions.SET_FEATURE_FLAGS]:(state, x) => state.featureFlags = x,
	[UIActions.SET_EXCHANGEABLES]:(state, x) => state.exchangeables = x,
	[UIActions.SET_UNTOUCHABLES]:(state, x) => state.untouchables = x,
	[UIActions.SET_CURRENCIES]:(state, x) => state.currencies = x,
	[UIActions.SET_TOKEN_METAS]:(state, x) => state.tokenMetas = x,
	[UIActions.SET_RESTRICTED_APPS]:(state, x) => state.showRestricted = x,
	[UIActions.SET_POPOUT]:(state, x) => state.popOut = x,
	[UIActions.SET_PORTS]:(state, x) => state.ports = x,
    [UIActions.SET_THEME]:(state, x) => state.theme = x,
    [UIActions.SET_TOP_ACTIONS_COLOR]:(state, x) => state.topActionsColor = x,
    [UIActions.SET_IS_MOBILE]:(state, x) => state.isMobile = x,
    [UIActions.SET_IS_MOBILE_DEVICE]:(state, x) => state.isMobileDevice = x,
    [UIActions.SET_SWIPED]:(state, x) => state.swiped = x,
    [UIActions.SET_SCROLL]:(state, x) => state.scroll = x,
	[UIActions.PUSH_POPUP]:(state, popup) => state.popups.push(popup),
	[UIActions.RELEASE_POPUP]:(state, popup) => state.popups = state.popups.filter(p => p.id !== popup.id),
	[UIActions.SET_FEATURED_APPS]:(state, x) => state.featuredApps = x,
	[UIActions.SET_BOUGHT]:(state, x) => state.bought = x,
	[UIActions.SET_KYC_REQUIRED]:(state, x) => state.kycRequired = x,
	[UIActions.SET_WORKING_SCREEN]:(state, x) => state.working = x,
	[UIActions.SET_WORKING_BAR]:(state, x) => state.workingBar = x,


    [Mutations.SET_PRICE_DATA]:(state, x) => state.priceData = x,
    [Mutations.SET_SCATTER]:(state, scatter) => state.scatter = scatter,
    [Mutations.SET_PRICES]:(state, prices) => state.prices = prices,
    [Mutations.SET_DAPP_LOGO]:(state, {origin, logo}) => Vue.set(state.dappLogos, origin, logo),
    [Mutations.SET_DAPP_DATA]:(state, data) => state.dappData = data,
	[Mutations.SET_RESOURCES]:(state, x) => state.resources = x,
	[Mutations.ADD_RESOURCES]:(state, x) => Vue.set(state.resources, x.acc, x.res),
	[Mutations.SET_BALANCES]:(state, x) => Vue.set(state.balances, x.account, x.balances),
	[Mutations.REMOVE_BALANCES]:(state, accountKeys) => accountKeys.map(key => Vue.delete(state.balances, key)),
	[Mutations.LOAD_HISTORY]:(state, x) => state.history = x,
	[Mutations.DELTA_HISTORY]:(state, x) => {
    	if(x === null) state.history = [];
    	else {
    		if(state.history.find(h => h.id === x.id)) state.history = state.history.filter(h => h.id !== x.id);
    		else state.history.unshift(x);
		}
	},
};
