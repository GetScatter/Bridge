import Vue from 'vue'
import Vuex from 'vuex';

import {mutations} from './mutations';
import {actions} from './actions';
import THEMES from "../util/Themes";
import IdGenerator from "scatter-core/util/IdGenerator";
import SingletonService from "../services/SingletonService";
import {PopupDisplayTypes} from "scatter-core/models/popups/Popup";

Vue.use(Vuex);

export const state = {
	dappLogos:{},
	dappData:{},
	processes:[],
	resources:{},
	scatter:null,
	popups:[],
	hardware:{},
	balances:{},
	prices:{},
	history:[],
	language:{},
	priceData:{},

	theme:window.localStorage.getItem('theme') || THEMES.FLUORESCENT,
	topActionsColor:null,

	isMobile:false,
	isMobileDevice:false,
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
