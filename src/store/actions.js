import * as UIActions from './ui_actions'
import * as Actions from '@walletpack/core/store/constants'
import StorageService from '../services/utility/StorageService';
import AES from 'aes-oop';
import {RUNNING_TESTS} from "@walletpack/core/util/TestingHelper";
import Seeder from "@walletpack/core/services/secure/Seeder";
import {POST} from "../util/API";
import Hasher from "@walletpack/core/util/Hasher";
import Scatter from "@walletpack/core/models/Scatter";
import migrator from '@walletpack/core/migrations/migrator';
const migrations = require('../migrations/version');

export const actions = {
    // UI
    [UIActions.SET_THEME]:({commit}, x) => {
        window.localStorage.setItem('theme', x);
	    commit(UIActions.SET_THEME, x);
    },
	[UIActions.SET_TOP_ACTIONS_COLOR]:({commit}, x) => commit(UIActions.SET_TOP_ACTIONS_COLOR, x),
	[UIActions.SET_IS_MOBILE]:({commit}, x) => commit(UIActions.SET_IS_MOBILE, x),
	[UIActions.SET_IS_MOBILE_DEVICE]:({commit}, x) => commit(UIActions.SET_IS_MOBILE_DEVICE, x),
	[UIActions.SET_SWIPED]:({commit}, x) => commit(UIActions.SET_SWIPED, x),
	[UIActions.SET_SCROLL]:({commit}, x) => commit(UIActions.SET_SCROLL, x),
	[UIActions.PUSH_POPUP]:({commit}, popup) => commit(UIActions.PUSH_POPUP, popup),
	[UIActions.RELEASE_POPUP]:({commit}, popup) => commit(UIActions.RELEASE_POPUP, popup),
	[UIActions.SET_FEATURED_APPS]:({commit}, x) => commit(UIActions.SET_FEATURED_APPS, x),
	[UIActions.SET_BOUGHT]:({commit}, x) => commit(UIActions.SET_BOUGHT, x),

    // ScatterCore
    [Actions.SET_PRICE_DATA]:({commit}, x) => commit(Actions.SET_PRICE_DATA, x),
    [Actions.ADD_RESOURCES]:({commit}, x) => commit(Actions.ADD_RESOURCES, x),
    [Actions.SET_RESOURCES]:({commit}, x) => commit(Actions.SET_RESOURCES, x),
    [Actions.SET_DAPP_DATA]:({commit}, x) => commit(Actions.SET_DAPP_DATA, x),
    [Actions.SET_DAPP_LOGO]:({commit}, x) => commit(Actions.SET_DAPP_LOGO, x),
    [Actions.HOLD_SCATTER]:({commit}, scatter) => commit(Actions.SET_SCATTER, scatter),

    [Actions.LOAD_SCATTER]:async ({commit, state, dispatch}) => {
    	const seed = await Seeder.getSeed();

	    let scatter = AES.decrypt(await StorageService.getScatter(), seed);
	    if(!scatter || !scatter.hasOwnProperty('keychain')) return false;
	    scatter = Scatter.fromJson(scatter);
	    scatter.decrypt(seed);

	    const card = await StorageService.getCard();
	    if(card) scatter.keychain.cards = [card];

	    console.log('loadbought', await StorageService.getBought());
	    commit(UIActions.SET_BOUGHT, await StorageService.getBought());

	    if(await migrator(scatter, migrations)){
		    scatter.meta.regenerateVersion();
		    dispatch(Actions.SET_SCATTER, scatter);
	    } else {
		    commit(Actions.SET_SCATTER, scatter)
	    }

        return scatter;
    },

    [Actions.SET_SCATTER]:async ({commit, state}, scatter) => {
        return new Promise(async resolve => {
            setTimeout(() =>  StorageService.setScatter(scatter), 1);
            commit(Actions.SET_SCATTER, scatter);
            resolve(scatter);
        })
    },

    [Actions.SET_BALANCES]:({commit}, x) => commit(Actions.SET_BALANCES, x),
    [Actions.REMOVE_BALANCES]:({commit}, x) => commit(Actions.REMOVE_BALANCES, x),
    [Actions.SET_PRICES]:({commit}, prices) => commit(Actions.SET_PRICES, prices),
    [Actions.LOAD_HISTORY]:async ({commit}) => commit(Actions.LOAD_HISTORY, await StorageService.getHistory()),
    [Actions.UPDATE_HISTORY]:async ({commit}, x) => {
        await StorageService.updateHistory(x);
	    commit(Actions.LOAD_HISTORY, await StorageService.getHistory())
    },
    [Actions.DELTA_HISTORY]:({commit}, x) => {
        commit(Actions.DELTA_HISTORY, x);
        return StorageService.deltaHistory(x);
    },

};
