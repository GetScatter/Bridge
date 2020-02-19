<template>
	<section class="onboarding">

		<figure class="back" @click="back" v-if="state !== STATES.GET_STARTED">
			<Button icon="fas fa-chevron-left" text="Back" />
		</figure>


		<!---------------------------------------->
		<!--            GET STARTED             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.GET_STARTED">
			<section>
				<section class="image">
					<img src="static/assets/love.svg" />
				</section>
				<figure class="title">Welcome to Scatter!</figure>
				<figure class="sub-title">It's exciting to embark on a new adventure, but before anything let’s build an online identity that truly belongs to you and only you.</figure>
				<Button text="Get Started" primary="1" @click.native="state = STATES.MANAGE_KEYS" />
			</section>
		</section>


		<!---------------------------------------->
		<!--            MANAGE KEYS             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.MANAGE_KEYS">
			<section>
				<section class="image">
					<img src="static/assets/identity.svg" />
				</section>
				<figure class="title">First things first, security.</figure>
				<figure class="sub-title">
					Scatter makes it so you don't ever have to put passwords or credit card information into websites. We do this with the use of <b>secure keys</b>.
					<br>
					<br>
					If you already have your own keys, you can go to the Settings panel once you have set up Scatter and add them there.
				</figure>

				<Button style="margin-left:5px;" primary="1" text="Generate secure keys" @click.native="generateKeys" />
			</section>
		</section>


		<!---------------------------------------->
		<!--            EXPORT KEYS             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.EXPORT_PHRASE">
			<section>
				<figure class="title">These are your <u>secret</u> words.</figure>
				<figure class="sub-title">
					Your secret words will be able to re-generate your <b>secure keys</b>. If you lose your keys you will not be able to access your accounts.
				</figure>
				<br>
				<ExportMnemonic v-if="mnemonic" :embedded="mnemonic" />
				<Button primary="1" text="I promise I wrote them down!" @click.native="skip" />
			</section>
		</section>



		<!---------------------------------------->
		<!--            NAME YOURSELF             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.NAME_YOURSELF">
			<section>
				<section class="image">
					<img src="static/assets/panda.svg" />
				</section>
				<figure class="title">What do you want to be called?</figure>
				<figure class="sub-title">You can be who-ever you want to be in this digital world we live in. Be yourself, or re-invent yourself.</figure>


				<section class="onboarder-input">
					<figure class="input-holder">
						<input placeholder="Name yourself" v-model="identityName" />
					</figure>
				</section>

				<section v-if="identityName.length && !isValidName">
					<figure class="sub-title"><b>This name is not valid.</b> Your name must be between 3 and 56 characters and contain only letters, numbers, and dash (but not as the first or last character).</figure>
				</section>


				<Button :disabled="!isValidName" text="Yes, that's totally me" primary="1" @click.native="setIdentityName" />
			</section>
		</section>


		<!---------------------------------------->
		<!--            FUND ACCOUNT             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.FUND_ACCOUNT">
			<section>
				<section class="image">
					<img src="static/assets/savings.svg" />
				</section>
				<figure class="title">You will need fuel for your journey.</figure>
				<figure class="sub-title">
					Like most things in life, you'll probably need to spend a few dollars here and there to have the maximum amount of fun.
					You can load some funds into your Scatter wallet now to get a head-start.
				</figure>


				<section class="onboarder-input">
					<figure class="input-holder normal">
						<input placeholder="Enter your email" v-model="email" type="email" />
					</figure>
				</section>



				<Button icon="fal fa-credit-card" text="Load with credit card" primary="1" @click.native="loadWallet" />
				<figure class="alternative-option" @click="finished">No thanks, I'll do this later</figure>
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
	import AccountCreator from "../services/utility/AccountCreator";
	import RidlService from "../services/utility/RidlService";
	import Loader from "../util/Loader";
	import KeyService from "../services/utility/KeyService";
	import ExportMnemonic from '../components/popups/ExportMnemonic'

	const STATES = {
		GET_STARTED:'get_started',
		MANAGE_KEYS:'manage_keys',
		EXPORT_PHRASE:'export_phrase',
		NAME_YOURSELF:'name_yourself',
		FUND_ACCOUNT:'fund_account',
	};

	export default {
		components:{ExportMnemonic},
		data(){return {
			STATES,
			state:STATES.GET_STARTED,

			identity:null,
			identityName:'',
			email:'',

			hasBalance:false,

			keys:[],
			mnemonic:null,
		}},
		computed:{
			...mapState([
				'scatter'
			]),
			isValidName(){
				return RidlService.validName(this.identityName);
			},
		},
		mounted(){
			// console.log('onboarding mounted', this.scatter);
			Loader.set(false);
			this.identity = this.scatter.keychain.identities[0].clone();
		},
		methods:{
			back(){
				if(this.state === STATES.GET_STARTED) return;
				if(this.state === STATES.MANAGE_KEYS) return this.state = STATES.GET_STARTED;
				if(this.state === STATES.EXPORT_PHRASE) return this.state = STATES.MANAGE_KEYS;
				if(this.state === STATES.NAME_YOURSELF) return this.state = STATES.EXPORT_PHRASE;
				if(this.state === STATES.FUND_ACCOUNT) return this.state = STATES.NAME_YOURSELF;
			},
			skip(){
				if(this.state === STATES.EXPORT_PHRASE) return this.state = STATES.NAME_YOURSELF;
				if(this.state === STATES.FUND_ACCOUNT) return this.state = this.finished();
			},
			async generateKeys(){
				if(!this.mnemonic) {
					const clone = this.scatter.clone();
					this.mnemonic = await KeyService.generateKeys(clone);
					await this[Actions.SET_SCATTER](clone);
				}
				this.state = STATES.EXPORT_PHRASE;
			},
			changeIdentityKey(){
				PopupService.push(Popups.changeIdentityKey(async changed => {
					if(changed) {
						this.identity.privateKey = changed.privateKey;
						this.identity.publicKey = changed.publicKey;
						const clone = this.scatter.clone();
						clone.keychain.identities[0] = this.identity.clone();
						await this[Actions.SET_SCATTER](clone);
						this.identity = this.scatter.keychain.identities[0].clone();

						PopupService.push(Popups.snackbar(`Your identity's key was changed successfully.`));
					}
				}));
			},
			async setIdentityName(){
				const clone = this.scatter.clone();
				clone.keychain.identities[0].name = this.identityName;
				await this[Actions.SET_SCATTER](clone);
				this.state = STATES.FUND_ACCOUNT;
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

				if(await AccountCreator.createAccount(keypair, network, null)){
					this.state = STATES.NAME_YOURSELF;
				}
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
				this.loadingRidlData = true;
				let id = this.identityName.trim();
				id = id.replace(/ /g,'');
				this.identityName = id;
			},
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";



	.mobile {
		.onboarding {
			padding:0 20px;
		}
	}

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


		.alternative-option {
			font-size: $font-size-small;
			color:$grey;
			font-weight: bold;
			padding:5px;
			cursor: pointer;
			display:table;
			margin:5px auto 0;

			&:hover {
				color:inherit;
				text-decoration: underline;
			}
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
				z-index:-1;
				position: relative;
				margin: 0 auto 20px;

				img {
					width:200px;
					height:200px;
				}
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

			.name-taken {
				display:block;
				margin-top:10px;
				color:$red;
				font-size: $font-size-small;
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
