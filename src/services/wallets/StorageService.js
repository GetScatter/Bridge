export default class StorageService {

	constructor(){}

	static async getDefaultPath(){
		return window.wallet.storage.getDefaultPath()
	};

	static async saveFile(...params){
		return window.wallet.storage.saveFile(...params);
	};

	static async setScatter(scatter){
		return window.wallet.storage.setWalletData(scatter);
	};

	static async getScatter() {
		return window.wallet.storage.getWalletData();
	}

	static async removeScatter(){
		return window.wallet.storage.clearWalletData();
	}

	static async cacheABI(contractName, chainId, abi){
		return window.wallet.storage.cacheABI(contractName, chainId, abi);
	}

	static async getCachedABI(contractName, chainId){
		return window.wallet.storage.getCachedABI(contractName, chainId);
	}

	static async getSalt(){
		return window.wallet.getSalt();
	}

	static async setSalt(salt){
		return window.wallet.setSalt(salt);
	}

	static async getTranslation(){
		return window.wallet.storage.getTranslation();
	}

	static async setTranslation(translation){
		return window.wallet.storage.setTranslation(translation);
	}

	static async getHistory(){
		return window.wallet.storage.getHistory();
	}

	static async updateHistory(x){
		return window.wallet.storage.updateHistory(x);
	}

	static async deltaHistory(x){
		return window.wallet.storage.deltaHistory(x);
	}

	static async swapHistory(history){
		return window.wallet.storage.swapHistory(history);
	}
}
