import Vue from 'vue'
import Vuex from 'vuex';

import {mutations} from './mutations';
import {actions} from './actions';
import THEMES from "../util/Themes";

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

	theme:window.localStorage.getItem('theme') || THEMES.LIGHT,
	topActionsColor:null,
};

export const getters = {

};

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
