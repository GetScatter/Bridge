import PluginRepository from '@walletpack/core/plugins/PluginRepository';
import IdGenerator from '@walletpack/core/util/IdGenerator';

export default class EosioHelpers {

	static async getRandomName(network = null){
		if(!network) network = PluginRepository.plugin('eos').getEndorsedNetwork();

		let randomName = '';
		while(!PluginRepository.plugin('eos').isValidRecipient(randomName)){
			randomName = IdGenerator.text(256).replace(/[0,6-9]/g, '').slice(0,12).toLowerCase();
		}

		const exists = await fetch(`${network.fullhost()}/v1/chain/get_account`, {
			method:"POST",
			body:JSON.stringify({account_name:randomName})
		}).then(x => x.json()).then(res => !res.hasOwnProperty('code')).catch(() => false);
		if(exists) return EosioHelpers.getRandomName(network);

		return randomName;
	}

}
