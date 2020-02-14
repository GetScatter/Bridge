import Keypair from '@walletpack/core/models/Keypair';
import KeyPairService from '@walletpack/core/services/secure/KeyPairService';
import PopupService from "./PopupService";
import Popups from "../../util/Popups";
import PluginRepository from "@walletpack/core/plugins/PluginRepository";
import {Blockchains, BlockchainsArray} from "@walletpack/core/models/Blockchains";
import Account from "@walletpack/core/models/Account";
import bip39 from "bip39";
import * as bip32 from "bip32";

export default class KeyService {

	static async checkTextKey(privateKey, blockchain){
		if(!privateKey || !privateKey.trim().length) return;
		const key = privateKey.trim().replace(/\W/g, '').replace('0x', '');
		const keypair = Keypair.placeholder();
		keypair.privateKey = key;
		if(!KeyPairService.isValidPrivateKey(keypair)) return;

		// Buffer conversion
		await KeyPairService.convertHexPrivateToBuffer(keypair);

		const blockchains = KeyPairService.getImportedKeyBlockchains(key);
		if(!blockchains.includes(blockchain)){
			return PopupService.push(Popups.snackbar('This key does not match this blockchain.'))
		}

		keypair.blockchains = [blockchain];
		await KeyPairService.makePublicKeys(keypair);
		if(!keypair.publicKeys.find(x => x.blockchain === blockchain)) {
			return PopupService.push(Popups.snackbar('Error generating public keys.'));
		}

		keypair.setName();

		if(!keypair.isUnique()) return PopupService.push(Popups.snackbar('This key already exists in your Scatter.'));

		return keypair;
	}

	static getMnemonic(decryptedPrivateKeyBuffer){
		return bip39.entropyToMnemonic(decryptedPrivateKeyBuffer);
	}

	static phraseToBuffer(mnemonic){
		return Buffer.from(bip39.mnemonicToEntropy(mnemonic), 'hex');
	}

	// DO NOT CALL ON ALREADY CREATED SCATTERS!!
	// This will wipe all existing keys.
	static async restoreFromMnemonicBuffer(scatter, mnemonicBuffer){
		return KeyService.generateKeys(scatter, mnemonicBuffer);
	}

	// DO NOT CALL ON ALREADY CREATED SCATTERS!!
	// This will wipe all existing keys.
	static async generateKeys(scatter, mnemonicBuffer = null){
		scatter.keychain.keypairs = [];
		scatter.keychain.accounts = [];
		scatter.keychain.permissions = [];

		const baseKey = Keypair.placeholder();
		baseKey.blockchains = [Blockchains.EOSIO];
		if(mnemonicBuffer) {
			baseKey.privateKey = mnemonicBuffer;
		} else {
			await KeyPairService.generateKeyPair(baseKey);
		}
		await KeyPairService.makePublicKeys(baseKey);
		baseKey.setName();
		baseKey.base = true;

		const mnemonic = KeyService.getMnemonic(baseKey.privateKey);

		const keys = BlockchainsArray.reduce((acc, blockchain) => {
			if(blockchain.value === Blockchains.EOSIO) acc[blockchain.value] = baseKey;
			// These will all also inherit the `base` modifier signifying they are base keys.
			// They will all have the same private key buffer.
			else acc[blockchain.value] = KeyPairService.convertKey(baseKey, blockchain.value);
			return acc;
		}, {});

		Object.keys(keys).map(blockchain => {
			scatter.keychain.keypairs.push(keys[blockchain]);
		});

		scatter.settings.networks.map(network => {
			if(PluginRepository.plugin(network.blockchain).accountsAreImported()) return;

			const keypair = keys[network.blockchain];
			scatter.keychain.accounts.push(Account.fromJson({
				networkUnique:network.unique(),
				keypairUnique:keypair.unique(),
				publicKey:keypair.publicKeys.find(x => x.blockchain === network.blockchain).key,
			}))
		});

		const node = bip32.fromSeed(KeyService.phraseToBuffer(mnemonic));
		const plugin = PluginRepository.plugin(Blockchains.EOSIO);
		const buffer = node.derivePath(`${plugin.bip()}527734`).privateKey;
		scatter.keychain.identities[0].privateKey = buffer;
		scatter.keychain.identities[0].publicKey = plugin.privateToPublic(plugin.bufferToHexPrivate(buffer));

		return mnemonic;
	}

}
