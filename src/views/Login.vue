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
	import PopupService from "../services/PopupService";
	import Popups from "../util/Popups";
	import BridgeWallet from "../services/BridgeWallet";
	import SingletonService from "../services/SingletonService";
	import API, {POST} from "../util/API";

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
				if(this.working) return;
				this.working = true;
				setTimeout(async () => {
					await BridgeWallet.register('testingtestingtestingtesting', 'testingtestingtestingtesting');
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

				const {serverSideEntropy, encryptionKey, isNew, session} = apiResult;
				API.setSessionToken(session);

				const password = await new Promise(resolve => {
					PopupService.push(Popups.getPassword(password => {
						resolve(password);
					}, /* TODO: CONFIRM PASSWORD */ isNew))
				});

				if(!password) return this.working = false;

				const loggedIn = async() => {
					if(isNew) return await BridgeWallet.register(serverSideEntropy, password+encryptionKey)
					else return await BridgeWallet.login(password+encryptionKey);
				};

				if(!await loggedIn()) return this.working = false;

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

