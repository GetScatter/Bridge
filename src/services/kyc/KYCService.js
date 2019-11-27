import StoreService from "@walletpack/core/services/utility/StoreService";
import IdentityService from "@walletpack/core/services/utility/IdentityService";
import {GET, POST} from "../../util/API";
import * as UIActions from "../../store/ui_actions";

export default class KYCService {

	static async setKycHash(hash){
		// const clone = StoreService.get().state.scatter.clone();
		// const identity = StoreService.get().state.scatter.keychain.identities[0].clone();
		// identity.kyc = hash;
		// return IdentityService.updateIdentity(identity);
	}

	static async spent(fiat){
		// const currency = StoreService.get().state.scatter.settings.displayCurrency || 'USD';
		// return POST('kyc/spent', {
		// 	amount:fiat,
		// 	currency,
		// });
	}

	static async required(){
		return GET('kyc/required').then(required => {
			StoreService.get().dispatch(UIActions.SET_KYC_REQUIRED, required);
			return true;
		}).catch(() => {
			return null;
		});
	}

}
