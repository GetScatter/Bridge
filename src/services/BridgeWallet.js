import Hasher from "scatter-core/util/Hasher";
import AES from 'aes-oop';
import IdGenerator from "scatter-core/util/IdGenerator";


export default class BridgeWallet {

	static async createEntropy(){
		let ent;
		for(let i = 0; i < 100; i++){
			ent = Hasher.secureHash(IdGenerator.text(128), ent);
		}
		return ent;
	}

	static async getLocalEntropy(psha){
		const encrypted = window.localStorage.get('ent');
		const decrypted = AES.decrypt(encrypted, psha);
	}

	static async generateHdSeed(uuid, entropy){
		const shauuid = await Hasher.secureHash(uuid, entropy);
		const shaent = await Hasher.secureHash(entropy, uuid);


	}

}