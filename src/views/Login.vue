<template>
	<section class="login">
		<section class="beauty">
			<img src="https://images.unsplash.com/photo-1456428746267-a1756408f782?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" />
		</section>

		<section class="authentication">
			<section>
				<figure class="logo scatter-logologo"></figure>
				<figure class="title">Embark on an adventure</figure>
				<figure class="text">
					and join the millions of people experiencing the modern age revolution that is redefining how we use the internet.
				</figure>

				<section v-if="ready && !working">
					<Button primary="1" text="Login" @click.native="login" />


					<section class="login-with">
						<span class="label">Or try it out with a</span>
						<span class="option" @click="loginTest"><u>demo account</u></span>
					</section>
				</section>

				<section v-else class="loading">
					<i class="animate-spin fas fa-spinner"></i>
				</section>
			</section>
		</section>

	</section>
</template>

<script>
	import {mapState, mapActions} from 'vuex';
	import GoogleAuth from "../oauth/Google";
	import PopupService from "../services/utility/PopupService";
	import Popups from "../util/Popups";
	import BridgeWallet from "../services/BridgeWallet";
	import API, {GET, POST} from "../util/API";
	import KYCService from "../services/kyc/KYCService";
	import Loader from "../util/Loader";

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
			loginSuccess(){
				Loader.set(true);
				this.$router.push({name:this.RouteNames.Dashboard})
			},
			async loginTest(){
				// TODO: Can login with test, and then social and it still works?
				// TODO: It's possible the entropy isn't being recreated
				if(this.working) return;
				this.working = true;
				setTimeout(async () => {
					await BridgeWallet.register('testingtestingtestingtesting', 'testingtestingtestingtesting', 'tester@testing.com');
					// KYCService.setKycHash(true);
					this.loginSuccess();
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

				this.loginSuccess();
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.login {
		height:100vh;
		display:flex;
		overflow: hidden;

		.authentication {
			background:rgba(255,255,255,0.99);
			background: linear-gradient(-65deg, rgba(255,255,255,0.81) 0%, rgba(255,255,255,0.99) 60%);
			max-width:600px;
			width:100%;
			height:100vh;
			padding:80px;

			display:flex;
			align-items: center;

			transition: all 1s ease;
			transition-property: padding;

			.loading {
				height:162px;
				display:flex;
				align-items: center;
				font-size: 48px;
				color:$grey;
			}

			.logo {
				color:$blue;
				font-size: 50px;
				margin-left:-15px;
				position: absolute;
				top:60px;
			}

			.title {
				color:$black;
				margin-top:2px;
				font-size: $font-size-large;
				font-weight: bold;
			}

			.text {
				font-size: $font-size-standard;
				font-weight: bold;
				color:$grey;
			}

			button {
				width:190px;
				height:80px;
				margin-top:50px;
				font-size: $font-size-medium;
			}

			.login-with {
				margin-top:20px;
				font-size: $font-size-tiny;

				.label {
					font-weight: bold;
					color:$grey;
				}

				.option {
					cursor: pointer;
					font-weight: bold;
					margin-left:4px;
					color:$blue;
				}
			}
		}

		.beauty {
			position:fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			z-index:-1;
			height:100vh;
			flex:1;

			img {
				width:100%;
				height:100%;
				object-fit: cover;
			}
		}

	}

	.mobile {
		.login {
			.authentication {
				padding:50px;
				width:calc(100% - 50px);
			}
		}
	}

	.blue-steel {
		.login {
			.authentication {
				background:$dark;
				background: linear-gradient(-65deg, rgba($dark, 0.6) 0%, $dark 60%);

				.title {
					color:#fff;
				}
			}

			.beauty {
				&:after {
					content:'';
					display:block;
					position: absolute;
					top:0;
					bottom:0;
					left:0;
					right:0;
					background:rgba($dark, 0.5);
				}
			}

		}
	}

</style>

