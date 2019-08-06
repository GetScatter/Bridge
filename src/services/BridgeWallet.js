import Hasher from "@walletpack/core/util/Hasher";
import AES from 'aes-oop';
import IdGenerator from "@walletpack/core/util/IdGenerator";
import Mnemonic from "@walletpack/core/util/Mnemonic";
import * as bip32 from 'bip32';
import entropy from 'more-entropy';
import PluginRepository from '@walletpack/core/plugins/PluginRepository'
import StorageService from "./StorageService";
import Scatter from "@walletpack/core/models/Scatter";
import Compressor from "../util/Compressor";
import WalletPack from "@walletpack/core";
import * as Actions from "@walletpack/core/store/constants";
import {BlockchainsArray} from "@walletpack/core/models/Blockchains";
import Keypair from "@walletpack/core/models/Keypair";
import Account from "@walletpack/core/models/Account";


export default class BridgeWallet {

	static async getScatter(psha){
		let scatter = AES.decrypt(StorageService.getScatter(), psha);
		if(!scatter.hasOwnProperty('keychain')) return false;
		scatter = Scatter.fromJson(scatter);
		scatter.decrypt(psha);
		return scatter;
	}

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

	static async shaPass(pass){
		return await Hasher.secureHash(pass);
	}

	static async getLocalEntropy(psha){
		return AES.decrypt(Compressor.decompress(window.localStorage.getItem('boxent')), psha);
	}

	static async setLocalEntropy(ent, psha){
		return window.localStorage.setItem('boxent', Compressor.compress(AES.encrypt(ent, psha)));
	}

	static async makeSeed(uuid, entropy){
		return await Hasher.secureHash(uuid, entropy) + await Hasher.secureHash(entropy, uuid);
	}

	static async makeKey(seed, blockchain, index = 0){
		const node = bip32.fromSeed(Buffer.from(seed, 'hex'));
		const plugin = PluginRepository.plugin(blockchain);
		const buffer = node.derivePath(`${plugin.bip()}${index}`).privateKey;
		return plugin.bufferToHexPrivate(buffer);

	}







	static async register(apiEntropy, password, email = null){

		let acc;
		password = await BridgeWallet.shaPass(password);
		const entropy = await BridgeWallet.createEntropy(1);
		await BridgeWallet.setLocalEntropy(entropy, password);
		const seed = await BridgeWallet.makeSeed(apiEntropy, entropy);

		const scatter = await Scatter.create();
		await Promise.all(BlockchainsArray.map(async kv => {
			const plugin = PluginRepository.plugin(kv.value);
			const p = await BridgeWallet.makeKey(seed, kv.value);
			const keypair = Keypair.fromJson({
				name:kv.value,
				privateKey:p,
				publicKeys:[{blockchain:kv.value, key:plugin.privateToPublic(p)}],
				blockchains:[kv.value],
			});
			scatter.keychain.keypairs.push(keypair);

			if(!plugin.accountsAreImported()){
				const networks = scatter.settings.networks.filter(n => n.blockchain === kv.value);
				networks.map(network => {
					scatter.keychain.accounts.push(Account.fromJson({
						keypairUnique:keypair.unique(),
						networkUnique:network.unique(),
						publicKey:keypair.publicKeys[0].key,
						name:kv.value
					}));
				});
			}

			// TODO: TESTING ONLY!
			else {
				const networks = scatter.settings.networks.filter(n => n.blockchain === kv.value);
				networks.map(async network => {
					acc = Account.fromJson({
						keypairUnique:keypair.unique(),
						networkUnique:network.unique(),
						publicKey:keypair.publicKeys[0].key,
						name:'ramdeathtest',
						authority:'active'
					});
					scatter.keychain.accounts.push(acc);
				})
			}

			return true;
		}));

		scatter.keychain.identities[0].email = email;

		await WalletPack.services.secure.Seeder.setSeed(password);
		await WalletPack.services.utility.StoreService.get().dispatch(Actions.SET_SCATTER, scatter);

		return true;
	}
	
	static async login(password){
		try {
			password = await BridgeWallet.shaPass(password);
			const scatter = await BridgeWallet.getScatter(password);
			await WalletPack.services.secure.Seeder.setSeed(password);
			await WalletPack.services.utility.StoreService.get().dispatch(Actions.HOLD_SCATTER, scatter);
			return true;
		} catch(e){
			console.error(e);
			return false;
		}
	}

}