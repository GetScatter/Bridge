<template>
	<section class="onboarding">

		<figure class="back" @click="back" v-if="state !== STATES.GET_STARTED && state !== STATES.IDENTITY_SUCCESS">
			<Button icon="fas fa-chevron-left" text="Back" />
		</figure>

		<figure class="skip" @click="skip">
			<!--<Button primary="1" v-if="state === STATES.MANAGE_KEYS" text="I don't have my own keys" />-->
			<Button primary="1" v-if="state === STATES.NAME_YOURSELF" text="I'll do this later" />
			<Button primary="1" v-if="state === STATES.FUND_ACCOUNT" text="I'll add funds later" />
			<Button primary="1" v-if="state === STATES.VERIFY_IDENTITY" text="Skip verification for now" />
		</figure>


		<!---------------------------------------->
		<!--            GET STARTED             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.GET_STARTED">
			<section>
				<section class="image">
					<img src="@/assets/identity.svg" />
				</section>
				<figure class="title">Let’s build an online identity that belongs to you.</figure>
				<Button text="Get Started" primary="1" @click.native="state = STATES.MANAGE_KEYS" />
			</section>
		</section>


		<!---------------------------------------->
		<!--            MANAGE KEYS             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.MANAGE_KEYS">
			<section>
				<section class="image">
					<img src="@/assets/love.svg" />
				</section>
				<figure class="title">Do you already have keys?</figure>
				<figure class="sub-title">Keys are like passwords that give you access to your accounts. If you already have some, you can import them now. If not you can allow Scatter to generate some for you.</figure>

				<Button text="Import your own" primary="1" @click.native="importKeys" />
				<Button style="margin-left:5px;" text="Generate keys" @click.native="skip" />
				<!--<figure class="alternative-option" @click="state = STATES.CLAIM_IDENTITY">Do you already have a <b>digital identity</b>?</figure>-->
			</section>
		</section>


		<!---------------------------------------->
		<!--            FUND ACCOUNT             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.FUND_ACCOUNT">
			<section>

				<figure class="title">Fuel your <b>journey</b></figure>
				<figure class="sub-title">You will need some funds in your wallet to use Scatter</figure>

				<section class="pay-boxes">
					<section class="pay-box" :class="{'active':buyAmount === BUY_AMOUNTS.LOW}" @click="buyAmount = BUY_AMOUNTS.LOW">
						<section class="box">
							<figure class="amount">${{BUY_AMOUNTS.LOW}}</figure>
							<figure class="info">
								Just enough to create your accounts and use some apps.
							</figure>
						</section>

						<figure class="bubble">
							<figure class="dot" v-if="buyAmount === BUY_AMOUNTS.LOW"></figure>
						</figure>
					</section>

					<section class="pay-box" :class="{'active':buyAmount === BUY_AMOUNTS.HIGH}" @click="buyAmount = BUY_AMOUNTS.HIGH">
						<section class="box">
							<figure class="amount">${{BUY_AMOUNTS.HIGH}}</figure>
							<figure class="info">
								Choose yourself how much you want to load into your wallet.
							</figure>
						</section>

						<figure class="bubble">
							<figure class="dot" v-if="buyAmount === BUY_AMOUNTS.HIGH"></figure>
						</figure>
					</section>
				</section>

				<section class="onboarder-input">
					<figure class="input-holder normal">
						<input placeholder="Enter your email" v-model="email" type="email" />
					</figure>
				</section>



				<Button text="Use Credit Card" primary="1" @click.native="loadWallet" />
			</section>
		</section>

		<!---------------------------------------->
		<!--            NAME YOURSELF             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.NAME_YOURSELF">
			<section>
				<section class="image">
					<img src="@/assets/panda.svg" />
				</section>
				<figure class="title">What do you want to be called?</figure>
				<!--<figure class="sub-title" v-if="hasBalance">Registering a name will cost you a small fee, as these are registered on a global network, owned by you and you alone.</figure>-->
				<!--<figure class="sub-title" v-if="!hasBalance">Since you don't currently have funds in your wallet, this identity will not be registered globally.</figure>-->

				<section class="onboarder-input">
					<figure @click="selectIdName" class="input-holder">
						<input placeholder="Name yourself" ref="idname" v-model="identityName" />
					</figure>
				</section>


				<Button :text="identityName.length ? `I am ${identityName}!` : `Who are you?`" :disabled="!identityName.length" primary="1" @click.native="claimName" />
				<!--<figure class="alternative-option" @click="state = STATES.CLAIM_IDENTITY">Do you already have a <b>digital identity</b>?</figure>-->
			</section>
		</section>


		<!---------------------------------------->
		<!--            CLAIM IDENTITY         -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.CLAIM_IDENTITY">
			<section>
				<figure class="title">Reclaim your <b>digital identity</b></figure>
				<figure class="sub-title">Enter your identity's private key to search for linked identities</figure>

				<section class="onboarder-input">
					<figure class="input-holder normal">
						<input placeholder="Enter Private Key" v-model="identityName" />
					</figure>
				</section>


				<!--<Button text="Yes, that would be lovely" primary="1" @click.native="verify" />-->
			</section>
		</section>


		<!---------------------------------------->
		<!--            IDENTITY SUCCESS        -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.IDENTITY_SUCCESS">
			<section>
				<section class="image">
					<img src="@/assets/love.svg" />
				</section>
				<figure class="title"><b>{{identityName || 'pandaluvr'}}</b><span class="blue">:scatter</span></figure>
				<figure class="sub-title">
					Congratulations, you've registered a globally unique name for yourself.
					People can now send you various types of funds directly to this name, and you can also log into
					applications using this unique name.
				</figure>


				<Button text="Awesome!" primary="1" @click.native="finished" />
			</section>
		</section>

		<!---------------------------------------->
		<!--            VERIFY IDENTITY         -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.VERIFY_IDENTITY">
			<section>
				<section class="image">
					<img src="assets/onboarding_verify_identity.jpg" />
				</section>
				<figure class="title">Want to <b>prove</b> yourself?</figure>
				<figure class="sub-title">Verifying who you really are opens up the good stuff</figure>


				<Button text="Yes, that would be lovely" primary="1" @click.native="verify" />
			</section>
		</section>



	</section>
</template>

<script>

	import PopupService from "../services/utility/PopupService";
	import Popups from "../util/Popups";
	import * as Actions from '@walletpack/core/store/constants'
	import {mapActions, mapState} from "vuex";

	import PluginRepository from '@walletpack/core/plugins/PluginRepository'
	import SingularAccounts from "../services/utility/SingularAccounts";
	import IdGenerator from '@walletpack/core/util/IdGenerator';
	import EosioHelpers from "../services/special/EosioHelpers";
	import Moonpay from "../services/credit/Moonpay";
	import AccountService from '@walletpack/core/services/blockchain/AccountService';
	import Account from '@walletpack/core/models/Account';
	import AccountCreator from "../services/utility/AccountCreator";

	const STATES = {
		GET_STARTED:'get_started',
		MANAGE_KEYS:'manage_keys',
		NAME_YOURSELF:'name_yourself',
		CLAIM_IDENTITY:'claim_identity',
		FUND_ACCOUNT:'fund_account',
		VERIFY_IDENTITY:'verify_identity',
		IDENTITY_SUCCESS:'identity_success',
	};

	const BUY_AMOUNTS = {
		LOW:20,
		HIGH:'?',
	}

	export default {
		data(){return {
			BUY_AMOUNTS,
			STATES,
			state:STATES.GET_STARTED,

			identityName:'',
			email:'',
			buyAmount:BUY_AMOUNTS.LOW,

			hasBalance:false,
		}},
		computed:{
			...mapState([
				'scatter'
			])
		},
		mounted(){

		},
		methods:{
			back(){
				if(this.state === STATES.GET_STARTED) return;
				if(this.state === STATES.MANAGE_KEYS) return this.state = STATES.GET_STARTED;
				if(this.state === STATES.FUND_ACCOUNT) return this.state = STATES.MANAGE_KEYS;
				if(this.state === STATES.NAME_YOURSELF) return this.state = STATES.FUND_ACCOUNT;
				if(this.state === STATES.CLAIM_IDENTITY) return this.state = STATES.NAME_YOURSELF;
				if(this.state === STATES.VERIFY_IDENTITY) return this.state = STATES.NAME_YOURSELF;
			},
			skip(){
				if(this.state === STATES.MANAGE_KEYS) return this.state = STATES.FUND_ACCOUNT;
				if(this.state === STATES.FUND_ACCOUNT) return this.state = STATES.NAME_YOURSELF;
				if(this.state === STATES.NAME_YOURSELF) return this.randomizeIdentity();
				// if(this.state === STATES.FUND_ACCOUNT) return this.state = STATES.VERIFY_IDENTITY;
				if(this.state === STATES.VERIFY_IDENTITY) return this.finished();
			},
			importKeys(){
				PopupService.push(Popups.importKeys(importedKeys => {
					// We're not going to do the credit card onboarding for imported keys
					// as we're assuming they already have funds
					if(importedKeys) {
						this.state = STATES.NAME_YOURSELF;
					}
				}));
			},
			selectIdName(){
				this.$refs.idname.focus();
				this.$refs.idname.select();
				this.identityName = '';
			},
			getNameFromEmail(){
				const email = this.scatter.keychain.identities[0].personal.email;
				if(email.length) return email.split('@')[0];
				return null;
			},
			async randomizeIdentity(){
				this.identityName = this.getNameFromEmail() || 'RandomPerson';
				const clone = this.scatter.clone();
				clone.keychain.identities[0].name = this.identityName;
				await this[Actions.SET_SCATTER](clone);
				this.finished();
			},
			async claimName(){
				// TODO: integrate RIDL and FIO
				// this.state = STATES.IDENTITY_SUCCESS;
				//const funds = this.hasBalance;

				const clone = this.scatter.clone();
				clone.keychain.identities[0].name = this.identityName;
				await this[Actions.SET_SCATTER](clone);

				// this.state = STATES.IDENTITY_SUCCESS;
				this.finished();
			},

			checkFunds(){
				const token = PluginRepository.plugin('eos').defaultToken();
				const account = SingularAccounts.accounts([token.network()])[0];
				if(!account) return this.hasBalance = false;
				const balance = account.balanceFor(token);
				if(balance && balance.amount > 0) this.hasBalance = balance.amount;
			},

			async loadWallet(){

				// Basic regex, don't need more than this.
				if(!/\S+@\S+\.\S+/.test(this.email)) return PopupService.push(Popups.snackbar("Email is invalid"));


				const clone = this.scatter.clone();
				clone.keychain.identities[0].personal.email = this.email;
				this[Actions.SET_SCATTER](clone);

				const keypair = this.scatter.keychain.keypairs.find(x => x.blockchains[0] === 'eos');
				if(!keypair) return PopupService.push(Popups.snackbar('There was an error loading your wallet (no keypair)'));

				const network = PluginRepository.plugin('eos').getEndorsedNetwork();

				if(await AccountCreator.createAccount(keypair, network, this.buyAmount)){
					this.state = STATES.NAME_YOURSELF;
				}


				// const token = PluginRepository.plugin('eos').defaultToken();
				// if(!token) return PopupService.push(Popups.snackbar('There was an error loading your wallet (no token)'));
				//
				// const keypair = this.scatter.keychain.keypairs.find(x => x.blockchains[0] === 'eos');
				// if(!keypair) return PopupService.push(Popups.snackbar('There was an error loading your wallet (no keypair)'));
				//
				// const publicKey = keypair.publicKeys.find(x => x.blockchain === 'eos').key;
				// if(!publicKey) return PopupService.push(Popups.snackbar('There was an error loading your wallet (no public key)'));
				//
				// const randomName = await EosioHelpers.getRandomName();
				//
				// const bought = await PopupService.push(Popups.moonpay(
				// 	token,
				// 	this.buyAmount === '?' ? null : this.buyAmount,
				// 	'makeaccounts',
				// 	`${publicKey},${randomName}`,
				// 	this.email,
				// 	randomName
				// ));
				//
				// const check = async () => {
				// 	let completed = await Moonpay.checkStatus(randomName);
				// 	if(!completed || !completed.length){
				// 		PopupService.push(Popups.snackbar("We couldn't verify the purchase automatically, please check your email."));
				// 	} else {
				// 		completed = completed[0];
				//
				// 		if(completed.status === 'completed'){
				// 			await Moonpay.removeHook(completed.unique);
				// 			PopupService.push(Popups.snackbar('Funds loaded!'));
				//
				// 			const network = token.network();
				// 			if(network){
				// 				let account = SingularAccounts.accounts([network])[0];
				// 				if(!account) {
				// 					// Linking account manually, as we are assuming that the account was created error-free
				// 					account = Account.fromJson({
				// 						keypairUnique:keypair.unique(),
				// 						networkUnique:network.unique(),
				// 						publicKey,
				// 						name:randomName,
				// 						authority:'active',
				// 					});
				// 					AccountService.addAccount(account);
				// 					BalanceService.loadBalancesFor(account);
				// 				}
				// 			}
				//
				//
				// 			this.state = STATES.NAME_YOURSELF;
				// 		}
				//
				// 		else if(completed.status === 'failed'){
				// 			await Moonpay.removeHook(completed.unique);
				// 			PopupService.push(Popups.snackbar('There was an issue loading your funds.'));
				// 		}
				//
				// 		// Recurse if still pending
				// 		else setTimeout(() => check(), 500);
				// 	}
				// };
				//
				// check();
			},
			verify(){
				this.finished();
			},
			finished(){
				const clone = this.scatter.clone();
				clone.onboarded = true;
				this[Actions.SET_SCATTER](clone);
			},
			...mapActions([
				Actions.SET_SCATTER
			])
		},
		watch:{
			['identityName'](){
				let id = this.identityName.trim();
				id = id.replace(/ /g,'');
				this.identityName = id;
			},
			['state'](){
				if(this.state === STATES.NAME_YOURSELF){
					this.checkFunds();
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.onboarding {
		height:100vh;
		width:100%;

		.back, .skip {
			position:fixed;
			top:5px;
			color:$blue;
			font-size: $font-size-big;
			font-weight: bold;
			display:flex;
			align-items: center;
			padding:10px;
			cursor: pointer;
		}

		.back {
			left:5px;
		}

		.skip {
			right:5px;
		}

		.page {
			height:100%;
			width:100%;
			display:flex;
			align-items: center;
			justify-content: center;

			> section {
				text-align:center;
				max-width:450px;
				margin:0 auto;
			}

			.image {
				/*animation: onboard-bounce 4s ease infinite;*/
				z-index:-1;
				position: relative;
				margin: 0 auto 3rem;

				img {
					max-width:80%;
					max-height:50vh;
				}
			}

			@keyframes onboard-bounce {
				0% { transform:rotateZ(0deg); }
				25% { transform:rotateZ(7deg); }
				50% { transform:rotateZ(-7deg); }
				100% { transform:rotateZ(0deg); }
			}

			.title {
				font-size: $font-size-large;
				font-weight: bold;

				.blue {
					color:$blue;
					font-weight: bold;
				}
			}

			.sub-title {
				font-size: $font-size-standard;
				color: $grey;
				text-align: center;
				max-width:350px;
				margin:0.5rem auto 0;
			}

			button {
				display:inline-block;
				margin-top:40px;
				font-size: $font-size-medium;
				padding:20px 40px;
				height:auto;
				min-width:200px;
			}

			.onboarder-input {
				margin-top:30px;
				padding-bottom:5px;
				border-bottom:3px solid $blue;
				display:flex;
				justify-content: center;

				.input-holder {
					flex:0 auto;
					font-size: $font-size-medium;
					font-weight: bold;
					text-align:right;
					cursor: text;
					position: relative;

					input {
						flex:0 auto;
						font-size: $font-size-medium;
						font-weight: bold;
						text-align:center;
						cursor: text;
						position: relative;
						border:0;
						outline:0;
						padding:15px 0;
					}

					&.normal {
						flex:1;

						input {
							position:relative;
							color:inherit;
							top:0;
							left:0;
							width:100%;
							height:100%;
							z-index:1;
							text-align:center;
							padding:15px 0;
						}
					}

					span {
						&.grey {
							color:rgba(0,0,0,0.2);
						}
					}
				}

				.suffix {
					font-size: 24px;
					color:$blue;
					font-weight: bold;
					text-align: left;
				}
			}
		}

		.alternative-option {
			text-decoration: underline;
			font-size: $font-size-small;
			padding:5px;
			cursor: pointer;
			display:table;
			margin:5px auto 0;

			&:hover {
				color:$blue;
			}
		}

		.pay-boxes {
			display:flex;
			justify-content: space-between;
			margin-top:40px;

			.pay-box {
				opacity:0.5;
				width:calc(50% - 10px);

				&.active {
					opacity:1;
				}

				.box {
					cursor: pointer;
					border:2px solid $blue;
					border-radius:10px;

					.amount {
						height:90px;
						display:flex;
						align-items: center;
						justify-content: center;
						padding:10px;
						font-size: $font-size-huge;
						font-weight: bold;
						color:$blue;
					}

					.info {
						height:80px;
						display:flex;
						align-items: center;
						justify-content: center;
						padding:10px;
						background:rgba(0, 168, 255, 0.08);
						font-size: $font-size-small;
						border-radius:10px;

					}
				}

				.bubble {
					width:40px;
					height:40px;
					margin:10px auto 0;
					display:flex;
					justify-content: center;
					align-items: center;

					border:2px solid $blue;
					border-radius:50%;
					cursor: pointer;

					.dot {
						width:20px;
						height:20px;
						background:$blue;
						border-radius:50%;
					}

				}
			}

		}
	}

</style>
