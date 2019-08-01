import * as UIActions from './ui_actions'
import * as Actions from '@walletpack/core/store/constants'
import StorageService from '../services/StorageService';
import AES from 'aes-oop';
import {RUNNING_TESTS} from "@walletpack/core/util/TestingHelper";
import Seeder from "@walletpack/core/services/secure/Seeder";

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

    // ScatterCore
    [Actions.SET_PRICE_DATA]:({commit}, x) => commit(Actions.SET_PRICE_DATA, x),
    [Actions.ADD_RESOURCES]:({commit}, x) => commit(Actions.ADD_RESOURCES, x),
    [Actions.SET_RESOURCES]:({commit}, x) => commit(Actions.SET_RESOURCES, x),
    [Actions.SET_DAPP_DATA]:({commit}, x) => commit(Actions.SET_DAPP_DATA, x),
    [Actions.SET_DAPP_LOGO]:({commit}, x) => commit(Actions.SET_DAPP_LOGO, x),
    [Actions.HOLD_SCATTER]:({commit}, scatter) => commit(Actions.SET_SCATTER, scatter),

    [Actions.LOAD_SCATTER]:async ({commit, state, dispatch}, forceLocal = false) => {

        if(!state.scatter) {
            let scatter = StorageService.getScatter();
            if (!scatter) return null;
            return commit(Actions.SET_SCATTER, scatter);
        }

	    const scatter = state.scatter.clone();

	    if(!RUNNING_TESTS){
		    await require('@walletpack/core/migrations/migrator').default(scatter, require('../migrations/version'));
	    }

	    scatter.meta.regenerateVersion();
	    await dispatch(Actions.SET_SCATTER, scatter);

        return true;
    },

    // [Actions.CREATE_SCATTER]:({state, commit, dispatch}, password) => {
    //     return new Promise(async (resolve, reject) => {
    //         const scatter = await Scatter.create();
    //         scatter.meta.acceptedTerms = true;
    //
    //         await StorageService.setSalt(Hasher.unsaltedQuickHash(IdGenerator.text(32)));
    //
    //         dispatch(Actions.SET_SEED, password).then(mnemonic => {
    //             dispatch(Actions.SET_SCATTER, scatter).then(async _scatter => {
	//                 // await BackupService.setDefaultBackupLocation();
    //                 resolve();
    //             })
    //         })
    //     })
    // },

    [Actions.SET_SCATTER]:async ({commit, state}, scatter) => {
        return new Promise(async resolve => {
            const seed = await Seeder.getSeed();
            const savable = AES.encrypt(scatter.savable(seed), seed);
            StorageService.setLocalScatter(savable);
            // StorageService.setScatter(savable).then(() => BackupService.createAutoBackup());
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
