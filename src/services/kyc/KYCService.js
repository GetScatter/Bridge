import StoreService from "@walletpack/core/services/utility/StoreService";
import IdentityService from "@walletpack/core/services/utility/IdentityService";

export default class KYCService {

	static async setKycHash(hash){
		const clone = StoreService.get().state.scatter.clone();
		const identity = StoreService.get().state.scatter.keychain.identities[0].clone();
		identity.kyc = hash;
		return IdentityService.updateIdentity(identity);
	}

}