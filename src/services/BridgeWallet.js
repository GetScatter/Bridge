import Hasher from "scatter-core/util/Hasher";
import AES from 'aes-oop';
import IdGenerator from "scatter-core/util/IdGenerator";
import Mnemonic from "scatter-core/util/Mnemonic";
import * as bip32 from 'bip32';
import entropy from 'more-entropy';
import PluginRepository from 'scatter-core/plugins/PluginRepository'


export default class BridgeWallet {

	static async createEntropy(rounds = 16){
		const getEnt = async () => {
			let ent;
			for(let i = 0; i < rounds; i++){
				ent = await Hasher.secureHash(IdGenerator.text(128), ent || 'begin');
			}
			return ent;
		}

		const ents = [];
		while(ents.length < 5) ents.push(await getEnt());

		const gen = new entropy.Generator();
		const e = (await new Promise(resolve => {
			gen.generate(1000, vals => {
				vals = vals.map(x => IdGenerator.text(Math.abs(x) > 128 ? 128 : Math.abs(x)) + vals);
				resolve(vals)
			});
		})).join('');
		const hash = await Hasher.secureHash(e, e.substr(Math.round(Math.random() * 100 + 1), 1000));

		return Hasher.unsaltedQuickHash(Hasher.unsaltedQuickHash(ents.join('')) + Hasher.unsaltedQuickHash(ents.reverse().join('')) + hash);
	}

	// static async getLocalEntropy(psha){
	// 	const encrypted = window.localStorage.get('ent');
	// 	const decrypted = AES.decrypt(encrypted, psha);
	// }

	static async makeSeed(uuid, entropy){
		return await Hasher.secureHash(uuid, entropy) + await Hasher.secureHash(entropy, uuid);
	}

	static async makeKey(seed, blockchain, index = 0){
		const node = bip32.fromSeed(Buffer.from(seed, 'hex'));
		const plugin = PluginRepository.plugin(blockchain);
		const buffer = node.derivePath(`${plugin.bip()}${index}`).privateKey;
		return plugin.bufferToHexPrivate(buffer);

	}

}