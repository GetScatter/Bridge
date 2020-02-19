import * as Actions from '@walletpack/core/store/constants';
import {BACKUP_STRATEGIES} from '@walletpack/core/models/Settings';
import StorageService from '../../services/wallets/StorageService';
import StoreService from "@walletpack/core/services/utility/StoreService";
import * as FileService from "../wallets/FileService";

const saveBackup = async (filepath) => {
	const scatter = await window.wallet.storage.getRawData();
	const date = new Date();
	const month = date.getUTCMonth();
	const year = date.getUTCFullYear();
	const salt = await window.wallet.getSalt();
	const file = scatter + '|SLT|' + salt;
	const name = `scatter__${StoreService.get().state.scatter.hash.substr(0,4)}-${StoreService.get().state.scatter.hash.slice(-4)}__${StoreService.get().state.scatter.meta.version}__${month}-${year}.json`;

	return StorageService.saveFile(filepath, name, file);
};

export default class BackupService {

	static async setBackupStrategy(strategy){
		const scatter = StoreService.get().state.scatter.clone();
		scatter.settings.autoBackup = strategy;
		return StoreService.get().dispatch(Actions.SET_SCATTER, scatter);
	}

	static async createBackup(){

		const location = await FileService.getFolderLocation();
		if(! location) return false;

		return await saveBackup(location[0]);
	}

	static async setBackupLocation(location = null){
		if(!location) location = await (async () => {
			const f = await FileService.getFolderLocation();
			if(f) return f[0];
			return null;
		})();
		if(!location) return false;
		const scatter = StoreService.get().state.scatter.clone();
		scatter.settings.backupLocation = location;
		return StoreService.get().dispatch(Actions.SET_SCATTER, scatter);
	}

	static async setDefaultBackupLocation(){
		const defaultPath = await StorageService.getDefaultPath();
		const backupPath = `${defaultPath}/scatter_backups`;
		await window.wallet.storage.mkdir(backupPath);
		return this.setBackupLocation(backupPath);
	}

	static async createAutoBackup(){
		if(!StoreService.get().state.scatter || !StoreService.get().state.scatter.settings) return;
		const strategy = StoreService.get().state.scatter.settings.autoBackup;
		if(!strategy || !strategy.length || strategy === BACKUP_STRATEGIES.MANUAL) return;

		const backupLocation = StoreService.get().state.scatter.settings.backupLocation;
		if(!backupLocation || !backupLocation.length) return false;


		return await saveBackup(backupLocation);
	}

}
