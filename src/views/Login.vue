<template>
	<section class="login">
		<section v-if="ready && !working">
			<h1>Login with Social</h1>
			<Button @click.native="login" text="Google Login" />
			<br>
			<Button @click.native="loginTest" text="Testing Login" />
		</section>

		<figure v-else class="animate-spin"><i class="fas fa-spinner"></i></figure>
	</section>
</template>

<script>
	import {mapState, mapActions} from 'vuex';
	import GoogleAuth from "../oauth/Google";
	import PopupService from "../services/utility/PopupService";
	import Popups from "../util/Popups";
	import BridgeWallet from "../services/BridgeWallet";
	import SingletonService from "../services/utility/SingletonService";
	import API, {GET, POST} from "../util/API";
	import KYCService from "../services/kyc/KYCService";

	let gauth;

	export default {
		data(){return {
			working:false,
			ready:false,
		}},
		mounted(){
			this.init()
		},
		methods:{
			async init(){
				gauth = new GoogleAuth();
				if(!gauth) return this.ready = true;
				await gauth.init();
				this.ready = true;
			},
			async loginTest(){
				// TODO: Can login with test, and then social and it still works?
				// TODO: It's possible the entropy isn't being recreated
				if(this.working) return;
				this.working = true;
				setTimeout(async () => {
					await BridgeWallet.register('testingtestingtestingtesting', 'testingtestingtestingtesting', 'tester@testing.com');
					KYCService.setKycHash(true);
					SingletonService.init();
					this.$router.push({name:this.RouteNames.Dashboard})
				}, 50);
			},
			async login(){
				if(this.working) return;
				this.working = true;


				const authCode = await gauth.getAuthCode().catch(() => null);
				if(!authCode) return this.working = false;

				const apiResult = await POST('oauth/google', {access_token:authCode})
				if(!apiResult) return this.working = false;

				const {isNew, session, requires2fa, email, kycHash} = apiResult;
				API.setSessionToken(session);

				const password = await new Promise(resolve => {
					PopupService.push(Popups.getPassword(password => {
						resolve(password);
					}, /* TODO: CONFIRM PASSWORD */ isNew))
				});

				if(!password) return this.working = false;

				const twoFactor = requires2fa ? await new Promise(resolve => {
					PopupService.push(Popups.twoFactorAuth(done => {
						if(!done && isNew) GET('2fa/cancel');
						resolve(done);
					}, isNew))
				}) : true;

				if(!twoFactor) return this.working = false;

				const encryptionKey = await GET('encryption_key').catch(() => null);
				if(!encryptionKey) return this.working = false;


				let loggedIn = false;
				if(isNew){
					const serverSideEntropy = await GET('entropy').catch(() => null);
					if(!serverSideEntropy) return this.working = false;
					loggedIn = await BridgeWallet.register(serverSideEntropy, password+encryptionKey, email)
				}
				else loggedIn = await BridgeWallet.login(password+encryptionKey);
				if(!loggedIn) return this.working = false;

				// If the user has gone through KYC, then we're setting their hash here
				// This should be done each time, just in case we have to revoke premium access.
				KYCService.setKycHash(kycHash);

				SingletonService.init();
				this.$router.push({name:this.RouteNames.Dashboard})
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.login {
		height:100vh;
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align:center;
	}

</style>

