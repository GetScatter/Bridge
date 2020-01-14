<template>
	<section class="login">
		<section class="beauty">
			<img src="https://images.unsplash.com/photo-1456428746267-a1756408f782?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" />
		</section>

		<section class="authentication">
			<section>
				<img class="logo" src="/static/assets/scatter.svg" />

				<section class="inputs" v-if="ready && !working">
					<section v-if="isNewScatter">
						<Button class="big" primary="1" text="Create new Scatter" @click.native="login" />
						<section class="login-with">
							<span class="label">You can also load a</span><span class="option" @click="loadBackup">full backup file</span>&nbsp;<span class="label">that you have saved.</span>
						</section>
					</section>

					<section v-else>
						<Input v-on:enter="login" :text="password" v-on:changed="x => password = x" v-if="asWallet" type="password" placeholder="Enter your password" />
						<Button class="big" primary="1" text="Login" @click.native="login" />

						<section class="login-with">
							<span class="label">You can also</span> <span class="option" @click="reset">reset your account</span>&nbsp;<span class="label">to start over</span>
						</section>
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
	import SingletonService from "../services/utility/SingletonService";
	import {RouteNames} from "../vue/Routing";
	import * as Actions from "@walletpack/core/store/constants";
	import * as UIActions from "../store/ui_actions";
	import {getFileLocation} from "../services/wallets/FileService";
	import Scatter from '@walletpack/core/models/Scatter'
	import Keypair from '@walletpack/core/models/Keypair'
	import KeyPairService from '@walletpack/core/services/secure/KeyPairService'
	import AccountService from '@walletpack/core/services/blockchain/AccountService'
	import SingularAccounts from "../services/utility/SingularAccounts";

	let gauth;

	export default {
		data(){return {
			working:false,
			ready:false,
			asWallet:false,
			isNewScatter:false,
			password:'',
			restoringBackup:false,
		}},
		mounted(){
			typeof window.wallet === 'undefined' ? this.initAsBridge() : this.initAsWallet();

		},
		methods:{
			async initAsWallet(){
				this.asWallet = true;
				this.ready = true;
				this.isNewScatter = !(await window.wallet.exists());
			},
			async initAsBridge(){
				gauth = new GoogleAuth();
				if(!gauth) return this.ready = true;
				await gauth.init();
				this.ready = true;
			},
			async loginSuccess(){
				Loader.set(true);
				setTimeout(async () => {
					if(!SingletonService.isInit()) await SingletonService.init();
					this.$router.push({name:this.RouteNames.Dashboard})
				}, 50);
			},
			async login(){
				if(this.working) return;
				this.working = true;

				if(this.asWallet) this.walletLogin();
				else this.oauthLogin();

			},
			async walletLogin(){
				if(!this.isNewScatter){
					if(await window.wallet.unlock(this.password)) {
						await this[Actions.LOAD_SCATTER]();
						this.loginSuccess();
					} else {
						PopupService.push(Popups.snackbar('Bad Password'));
						this.working = false;
					}
				} else {
					PopupService.push(Popups.showTerms(async accepted => {
						if(!accepted) return this.working = false;
						PopupService.push(Popups.getPassword(async password => {
							if(!password) return this.working = false;
							await this[UIActions.CREATE_SCATTER](password);
							this.loginSuccess();
						}, true))
					}))

				}


			},
			async oauthLogin(){
				const authCode = await gauth.getAuthCode().catch(() => null);
				if(!authCode) return this.working = false;

				const apiResult = await POST('oauth/google', {access_token:authCode})
				if(!apiResult) return this.working = false;

				const {isNew, session, requires2fa, email, kycHash} = apiResult;
				API.setSessionToken(session);

				const password = await new Promise(resolve => {
					PopupService.push(Popups.getPassword(password => {
						resolve(password);
					}, isNew))
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
			},

			async loadBackup(){
				const unrestore = () => {
					this.working = false;
					this.restoringBackup = false;
					window.wallet.lock();
				}

				if(this.restoringBackup) return;
				this.restoringBackup = true;

				// TODO: fix for bridge
				const possibleFile = await getFileLocation(['json', 'txt']);
				if(!possibleFile) return unrestore();
				const file = possibleFile[0];
				if(!file) return unrestore();



				const importDesktopBackup = async (data, password) => {
					const [obj, salt] = data.split('|SLT|');
					if(!obj || !salt) {
						unrestore();
						return PopupService.push(Popups.snackbar('Error parsing backup'));
					}

					await window.wallet.lock();
					await window.wallet.unlock(password, true, salt);
					const decrypted = await window.wallet.decrypt(obj);
					if(typeof decrypted === 'object' && decrypted.hasOwnProperty('keychain')){
						decrypted.keychain = await window.wallet.decrypt(decrypted.keychain);
						decrypted.settings.backupLocation = '';
						this.working = false;
						PopupService.push(Popups.showTerms(async accepted => {
							if(!accepted) {
								window.wallet.lock();
								return;
							}
							decrypted.onboarded = true;
							await this[Actions.SET_SCATTER](Scatter.fromJson(decrypted));
							await window.wallet.lock();
							window.wallet.utility.reload();
						}))
					} else {
						unrestore();
						return PopupService.push(Popups.snackbar("Error decrypting backup"));
					}
				};

				const importExtensionBackup = async (data, password) => {
					const [obj, salt] = data.split('|SSLT|');

					if(!obj || !salt) {
						unrestore();
						return PopupService.push(Popups.snackbar("Error parsing backup"));
					}

					await window.wallet.lock();
					await window.wallet.unlock(password, true, salt);
					const decrypted = await window.wallet.decrypt(obj);
					if(typeof decrypted === 'object' && decrypted.hasOwnProperty('keychain')){
						const keypairs = await Promise.all(decrypted.keychain.keypairs
							.map(async x => {
								x.privateKey = await window.wallet.decrypt(x.privateKey)
								return x;
							})
							.map(async x => {
								const keypair = Keypair.fromJson({
									name:x.name,
									blockchains:[x.blockchain],
									privateKey:Crypto.privateKeyToBuffer(x.privateKey, x.blockchain),
								});
								await KeyPairService.makePublicKeys(keypair);
								return keypair;
							}));
						const scatter = await Scatter.create();
						scatter.keychain.keypairs = keypairs;


						this.working = false;
						PopupService.push(Popups.showTerms(async accepted => {
							if(!accepted) {
								window.wallet.lock();
								return;
							}
							scatter.onboarded = true;
							await this[Actions.SET_SCATTER](scatter);
							await Promise.all(keypairs.map(async keypair => {
								const networks = scatter.settings.networks
									.filter(x => x.blockchain === keypair.blockchains[0])
									.filter(x => !SingularAccounts.accounts([x]).length);
								await Promise.all(networks.map(async network => {
									const accounts = await AccountService.getAccountsFor(keypair, network);
									if(accounts.length){
										await AccountService.addAccount(accounts[0]);
										SingularAccounts.setPredefinedAccount(network, accounts[0]);
									}
								}));
								// return AccountService.importAllAccounts(keypair);
							}));
							await window.wallet.lock();
							window.wallet.utility.reload()
						}))
					} else {
						unrestore();
						return PopupService.push(Popups.snackbar("Error decrypting backup"));
					}
				};

				// TODO: Fix for bridge
				window.wallet.storage.openFile(file).then(data => {
					if(!data) {
						unrestore();
						return PopupService.push(Popups.snackbar("Can't read backup"));
					}

					const fileExtension = file.split('.')[file.split('.').length-1];
					PopupService.push(Popups.getPassword(async password => {
						if(!password || !password.length) return unrestore();
						this.working = true;
						try {
							switch(fileExtension){
								case 'json': return await importDesktopBackup(data, password);
								case 'txt': return await importExtensionBackup(data, password);
							}
						} catch(e){
							console.error('e',e);
							unrestore();
							return PopupService.push(Popups.snackbar("Error decrypting backup"));
						}
					}))
				})
			},
			reset(){

				PopupService.push(Popups.resetScatter())
			},
			...mapActions([
				Actions.LOAD_SCATTER,
				Actions.SET_SCATTER,
				UIActions.CREATE_SCATTER
			])
		},
		watch:{
			['window.wallet'](){
				this.initAsWallet();
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.login {
		height:100vh;
		width:100vw;
		display:flex;
		overflow: hidden;
		align-items: center;
		justify-content: center;

		.authentication {
			background:rgba(255,255,255,1);
			padding:80px 120px;
			margin:0 auto;
			text-align:center;
			border-radius:4px;
			display:flex;
			justify-content: center;
			align-items:center;
			transition: all 1s ease-in-out;
			transition-property: opacity;
			width: 100%;
			height: 100%;

			.app-title {
				font-size:$font-size-large;
				font-weight:bold;
				margin:1rem 0 0 0;
			}

			.inputs {
				width:100%;
				margin-top:1rem;
				display:inline-block;
				font-size: $font-size-medium;
				max-width:400px;
			}

			.loading {
				height:162px;
				display:flex;
				align-items: center;
				justify-content: center;
				font-size: 48px;
				color:$grey;
			}

			.logo {
				width:250px;
				margin-bottom:20px;
			}

			.title {
				color:$black;
				margin-top:2px;
				font-size: $font-size-large;
				font-weight: bold;
			}

			.text {
				font-size: $font-size-medium;
				font-weight: bold;
				color:$grey;
			}

			button {
				width:100%;
				margin-bottom:10px;

				&.big {
					height:60px;
					font-size: $font-size-medium;
				}
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
					text-decoration: underline;
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
			background: #00a8ff;

			img {
				width:100%;
				height:100%;
				object-fit: cover;
				opacity: 0;
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

