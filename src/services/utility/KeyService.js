import Keypair from '@walletpack/core/models/Keypair';
import KeyPairService from '@walletpack/core/services/secure/KeyPairService';
import PopupService from "./PopupService";
import Popups from "../../util/Popups";

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

}
