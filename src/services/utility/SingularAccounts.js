import {store} from "../../store/store";
import Network from '@walletpack/core/models/Network'

export default class SingularAccounts {

	// static keypairs(){
	// 	return store.state.scatter.keychain.keypairs.reduce((acc,keypair) => {
	// 		if(!acc.find(x => x.blockchains[0] === keypair.blockchains[0])){
	// 			acc.push(keypair);
	// 		}
	// 		return acc;
	// 	}, []);
	// }

	static accounts(networks = null){

		if(!networks) networks = store.state.scatter.settings.networks;
		return networks.map(network => {
			if(!network instanceof Network) network = Network.fromJson(network);

			const firstAccount = () => store.state.scatter.keychain.accounts.find(x => x.networkUnique === network.unique());

			const predefined = window.localStorage.getItem(`acc_${network.unique()}`) || null;
			if(predefined){
				const account = store.state.scatter.keychain.accounts.find(x => x.unique() === predefined);
				if(!account) {
					SingularAccounts.setPredefinedAccount(network, null);
					return firstAccount();
				}

				return account;
			}

			return firstAccount();
		}).filter(x => !!x);
	}

	static setPredefinedAccount(network, account){
		if(account) window.localStorage.setItem(`acc_${network.unique()}`, account.unique());
		else window.localStorage.removeItem(`acc_${network.unique()}`);
	}

}
