import * as UIActions from './ui_actions'
import * as Actions from '@walletpack/core/store/constants'
import StorageService from '../services/utility/StorageService';
import WalletStorageService from '../services/wallets/StorageService';
import Scatter from "@walletpack/core/models/Scatter";
import BackupService from "../services/utility/BackupService";
import SingletonService from "../services/utility/SingletonService";
import Keypair from '@walletpack/core/models/Keypair';
import Account from '@walletpack/core/models/Account';
import KeyPairService from '@walletpack/core/services/secure/KeyPairService';
import PluginRepository from '@walletpack/core/plugins/PluginRepository';
import {Blockchains} from "@walletpack/core/models/Blockchains";
const migrations = require('../migrations/version');
import HistoricTransfer from '@walletpack/core/models/histories/HistoricTransfer';
import HistoricExchange from '@walletpack/core/models/histories/HistoricExchange';
import HistoricAction from '@walletpack/core/models/histories/HistoricAction';
import {HISTORY_TYPES} from '@walletpack/core/models/histories/History';

const isPopOut = location.hash.replace("#/", '').split('?')[0] === 'popout' || !!window.PopOutWebView;
let migrationChecked = false;

const getStorageService = () => {
	return window.wallet ? WalletStorageService : StorageService;
}

export const actions = {
    // UI
	[UIActions.SET_FEATURE_FLAGS]:({commit}, x) => commit(UIActions.SET_FEATURE_FLAGS, x),
	[UIActions.SET_EXCHANGEABLES]:({commit}, x) => commit(UIActions.SET_EXCHANGEABLES, x),
	[UIActions.SET_UNTOUCHABLES]:({commit}, x) => commit(UIActions.SET_UNTOUCHABLES, x),
	[UIActions.SET_CURRENCIES]:({commit}, x) => commit(UIActions.SET_CURRENCIES, x),
	[UIActions.SET_TOKEN_METAS]:({commit}, x) => commit(UIActions.SET_TOKEN_METAS, x),
	[UIActions.SET_RESTRICTED_APPS]:({commit}, x) => {
		window.localStorage.setItem('restrictedApps', x);
		commit(UIActions.SET_RESTRICTED_APPS, x);
	},
	[UIActions.SET_POPOUT]:({commit}, x) => commit(UIActions.SET_POPOUT, x),
	[UIActions.SET_PORTS]:({commit}, x) => commit(UIActions.SET_PORTS, x),
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
	[UIActions.SET_KYC_REQUIRED]:({commit}, x) => commit(UIActions.SET_KYC_REQUIRED, x),
	[UIActions.SET_WORKING_SCREEN]:({commit}, x) => commit(UIActions.SET_WORKING_SCREEN, x),
	[UIActions.SET_WORKING_BAR]:({commit}, x) => commit(UIActions.SET_WORKING_BAR, x),

    // ScatterCore
    [Actions.SET_PRICE_DATA]:({commit}, x) => commit(Actions.SET_PRICE_DATA, x),
    [Actions.ADD_RESOURCES]:({commit}, x) => commit(Actions.ADD_RESOURCES, x),
    [Actions.SET_RESOURCES]:({commit}, x) => commit(Actions.SET_RESOURCES, x),
    [Actions.SET_DAPP_DATA]:({commit}, x) => commit(Actions.SET_DAPP_DATA, x),
    [Actions.SET_DAPP_LOGO]:({commit}, x) => commit(Actions.SET_DAPP_LOGO, x),
    [Actions.HOLD_SCATTER]:({commit}, scatter) => commit(Actions.SET_SCATTER, scatter),

	[UIActions.CREATE_SCATTER]:({state, commit, dispatch}, password) => {
		return new Promise(async (resolve, reject) => {
			const scatter = await Scatter.create();
			scatter.meta.acceptedTerms = true;
			// scatter.onboarded = true;

			PluginRepository.plugin(Blockchains.TRX).init();

			const baseKey = Keypair.placeholder();
			baseKey.blockchains = [Blockchains.EOSIO];
			await KeyPairService.generateKeyPair(baseKey);
			await KeyPairService.makePublicKeys(baseKey);
			baseKey.setName();


			const keys = {
				[Blockchains.EOSIO]:baseKey,
				[Blockchains.TRX]:KeyPairService.convertKey(baseKey, Blockchains.TRX),
				[Blockchains.BTC]:KeyPairService.convertKey(baseKey, Blockchains.BTC),
				[Blockchains.ETH]:KeyPairService.convertKey(baseKey, Blockchains.ETH),

			};

			Object.keys(keys).map(blockchain => {
				scatter.keychain.keypairs.push(keys[blockchain]);
			});

			scatter.settings.networks.map(network => {
				// EOSIO networks require registered accounts.
				if(network.blockchain === Blockchains.EOSIO) return;

				const keypair = keys[network.blockchain];
				scatter.keychain.accounts.push(Account.fromJson({
					networkUnique:network.unique(),
					keypairUnique:keypair.unique(),
					publicKey:keypair.publicKeys.find(x => x.blockchain === network.blockchain).key,
				}))
			});


			const unl = await window.wallet.unlock(password, true);
			dispatch(Actions.SET_SCATTER, scatter).then(async _scatter => {
				// TODO: Mobile unfriendly
				await BackupService.setDefaultBackupLocation();
				resolve(true);
			})
		})
	},

    [Actions.LOAD_SCATTER]:async ({commit, state, dispatch}) => {
	    let scatter = await getStorageService().getScatter();
	    if (!scatter) return null;

	    scatter = Scatter.fromJson(scatter);

	    if(!isPopOut && !migrationChecked){
		    migrationChecked = true;

		    await require('@walletpack/core/migrations/migrator').default(scatter, require('../migrations/version'));

		    // Fixing dangling accounts
		    scatter.keychain.accounts.map(account => {
			    if(
				    !scatter.keychain.keypairs.find(x => x.unique() === account.keypairUnique) ||
				    !scatter.settings.networks.find(x => x.unique() === account.networkUnique)
			    ) scatter.keychain.removeAccount(account);
		    });


		    scatter.meta.regenerateVersion();
	    }

	    await scatter.settings.blacklistAction('eos', 'eosio', 'updateauth');
	    await scatter.settings.blacklistAction('eos', 'eosio.msig', 'approve');

	    return commit(Actions.SET_SCATTER, scatter);


    	// const seed = await Seeder.getSeed();
		//
	    // let scatter = AES.decrypt(await StorageService.getScatter(), seed);
	    // if(!scatter || !scatter.hasOwnProperty('keychain')) return false;
	    // scatter = Scatter.fromJson(scatter);
	    // scatter.decrypt(seed);
		//
	    // const card = await StorageService.getCard();
	    // if(card) scatter.keychain.cards = [card];
		//
	    // commit(UIActions.SET_BOUGHT, await StorageService.getBought());
		//
	    // if(await migrator(scatter, migrations)){
		//     scatter.meta.regenerateVersion();
		//     dispatch(Actions.SET_SCATTER, scatter);
	    // } else {
		//     commit(Actions.SET_SCATTER, scatter)
	    // }
		//
        // return scatter;



	    // if(!isPopOut && !migrationChecked){
		//     migrationChecked = true;
	    //
		//     await require('@walletpack/core/migrations/migrator').default(scatter, require('../migrations/version'));
	    //
		//     // Fixing dangling accounts
		//     scatter.keychain.accounts.map(account => {
		// 	    if(
		// 		    !scatter.keychain.keypairs.find(x => x.unique() === account.keypairUnique) ||
		// 		    !scatter.settings.networks.find(x => x.unique() === account.networkUnique)
		// 	    ) scatter.keychain.removeAccount(account);
		//     });
	    //
	    //
		//     scatter.meta.regenerateVersion();
	    // }

	    // return commit(Actions.SET_SCATTER, scatter);
    },

    [Actions.SET_SCATTER]:async ({commit, state}, scatter) => {
        return new Promise(async resolve => {
            await new Promise(r => setTimeout(() =>  r(getStorageService().setScatter(scatter)), 1))
            commit(Actions.SET_SCATTER, scatter);
            resolve(scatter);
        })
    },

    [Actions.SET_BALANCES]:({commit}, x) => commit(Actions.SET_BALANCES, x),
    [Actions.REMOVE_BALANCES]:({commit}, x) => commit(Actions.REMOVE_BALANCES, x),
    [Actions.SET_PRICES]:({commit}, prices) => commit(Actions.SET_PRICES, prices),
	[Actions.LOAD_HISTORY]:async ({commit}) => {
		let history = await getStorageService().getHistory();
		if(!history) return;
		history = history.filter(x => x.txid && x.txid.length)

		history = history.map(x => {
			if(x.type === HISTORY_TYPES.Transfer) return HistoricTransfer.fromJson(x);
			if(x.type === HISTORY_TYPES.Exchange) return HistoricExchange.fromJson(x);
			if(x.type === HISTORY_TYPES.Action) return HistoricAction.fromJson(x);
			return null;
		}).filter(x => x);

		commit(Actions.LOAD_HISTORY, history);
	},
    [Actions.UPDATE_HISTORY]:async ({dispatch}, x) => {
        await getStorageService().updateHistory(x);
	    dispatch(Actions.LOAD_HISTORY);
    },
    [Actions.DELTA_HISTORY]:async ({dispatch}, x) => {
        await getStorageService().deltaHistory(x);
	    dispatch(Actions.LOAD_HISTORY);
    },

};
