import RIDL from 'ridl-js';
import PluginRepository from '@walletpack/core/plugins/PluginRepository';
import {Blockchains} from '@walletpack/core/models/Blockchains'

const api = RIDL(() => {});

const getSigner = publicKey => async hash => window.wallet.sign({blockchain:Blockchains.EOSIO}, publicKey, {data:hash}, true, true)

export default class RidlService {

	static async getAppReputation(app){
		return api.findReputation(`app::${app.applink}`).catch(() => null);
	}

	static validName(username){
		return api.validName(username);
	}

	static async findIdentity(username){
		return await api.findIdentity(username);
	}

	static async identify(identity){
		const registered = await api.identify(identity.name, identity.publicKey, 'local');
		if(!registered || !registered.success) return false;

		let ridlId = null;
		while(!ridlId){
			ridlId = await RidlService.findIdentity(identity.name);
			if(!ridlId) await new Promise(r => setTimeout(() => r(true), 500));
		}

		return ridlId;
	}

	static async changeKey(identity_id, key, chain, old_key){
		const changed = await RIDL(getSigner(old_key)).changekey(identity_id, key, chain);
		return changed && changed.success ? {txid:changed.txid} : false;
	}

	static async repute(identity_id, entity, fragments, tokens, chain, details = '', publicKey){
		const reputed = await RIDL(getSigner(publicKey)).repute(identity_id, entity, fragments, tokens, chain, details);
		return reputed && reputed.success;
	}

}
