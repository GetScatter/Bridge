import Vue from 'vue'
import Vuex from 'vuex';

import {mutations} from './mutations';
import {actions} from './actions';
import {PopupDisplayTypes} from "../models/popups/Popup";
import PluginRepository from '@walletpack/core/plugins/PluginRepository';

Vue.use(Vuex);

export const state = {
	// CORE!
	// ---------------------------------
	dappLogos:{},
	dappData:{},
	resources:{},
	scatter:null,
	popups:[],
	balances:{},
	prices:{},
	priceData:{},
	currencies:{},
	// ---------------------------------
	tokenMetas:{},




	history:[],
	featuredApps:[],
	bought:[],

	kycRequired:150,

	theme:null,
	topActionsColor:null,

	isMobile:false,
	isMobileDevice:false,
	scroll:0,
	swiped:null,
	working:false,
	workingBar:null,

	popOut:null,
	ports:null,

	showRestricted:window.localStorage.getItem('restrictedApps') || false,

	untouchables:[],
	exchangeables:[],

	featureFlags:{},
};

export const getters = {
	unlocked:state =>       state.scatter !== null
							&& typeof state.scatter !== 'string'
							&& typeof state.scatter.isEncrypted === 'function'
							&& !state.scatter.isEncrypted(),

	// Popups
	popIns:state =>         state.popups.filter(x => x.displayType === PopupDisplayTypes.POP_IN) || [],
	nextPopIn:state =>      state.popups.filter(x => x.displayType === PopupDisplayTypes.POP_IN)[0] || null,
	snackbars:state =>      state.popups.filter(x => x.displayType === PopupDisplayTypes.SNACKBAR) || [],

	identity:state =>       state.scatter.keychain.identities[0],

	explorers:state =>      state.scatter.settings.explorers || PluginRepository.defaultExplorers(),
	avatars:state =>        state.scatter.keychain.avatars || {},
};

const proxyHandler = {
	get:(obj, prop) => obj[prop],
	set:() => false,
	deleteProperty:() => false,
	apply:() => false,
	construct:() => false,
	defineProperty:() => false,
	setPrototypeOf:() => false,
}

export const store = new Proxy(new Vuex.Store({
	state,
	getters,
	mutations,
	actions
}), proxyHandler);
