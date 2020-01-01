<template>
	<section class="onboarding">

		<figure class="back" @click="back" v-if="state !== STATES.GET_STARTED && state !== STATES.IDENTITY_SUCCESS">
			<i class="fas fa-chevron-left"></i> Back
		</figure>

		<figure class="skip" @click="skip">
			<span v-if="state === STATES.NAME_YOURSELF">Give me a random name</span>
			<span v-if="state === STATES.FUND_ACCOUNT">I'll deal with this later</span>
			<span v-if="state === STATES.VERIFY_IDENTITY">Skip verification for now</span>
			<i v-if="state !== STATES.GET_STARTED && state !== STATES.IDENTITY_SUCCESS" class="fas fa-chevron-right"></i>
		</figure>


		<!---------------------------------------->
		<!--            GET STARTED             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.GET_STARTED">
			<section>
				<section class="image">
					<img src="assets/onboarding_get_started.jpg" />
				</section>
				<figure class="title">Start owning your <b>footprints</b></figure>
				<figure class="sub-title">We all leave breadcrumbs behind, but you can have better control over them.</figure>
				<Button text="Get Started" primary="1" @click.native="state = STATES.NAME_YOURSELF" />
			</section>
		</section>


		<!---------------------------------------->
		<!--            NAME YOURSELF             -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.NAME_YOURSELF">
			<section>
				<section class="image">
					<img src="assets/onboarding_name_yourself.jpg" />
				</section>
				<figure class="title">Be who you <b>want to be</b></figure>
				<figure class="sub-title">We are many things online, but first of all we are a name</figure>

				<section class="onboarder-input">
					<figure @click="selectIdName" class="input-holder">
						<!--<span v-if="identityName.length">{{identityName}}</span>-->
						<!--<span v-else class="grey">give yourself a name</span>-->
						<input placeholder="Give yourself a name" ref="idname" v-model="identityName" />
					</figure>
					<!--<figure class="suffix">:scatter</figure>-->
				</section>


				<Button :text="identityName.length ? `I am ${identityName}!` : `Who are you?`" :disabled="!identityName.length" primary="1" @click.native="claimName" />
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
					<section class="pay-box" :class="{'active':buyAmount === 25}" @click="buyAmount = 25">
						<section class="box">
							<figure class="amount">$25</figure>
							<figure class="info">
								Just enough to create your accounts and use some apps.
							</figure>
						</section>

						<figure class="bubble">
							<figure class="dot" v-if="buyAmount === 25"></figure>
						</figure>
					</section>

					<section class="pay-box" :class="{'active':buyAmount === 75}" @click="buyAmount = 75">
						<section class="box">
							<figure class="amount">$75</figure>
							<figure class="info">
								A more reasonable amount for using decentralized apps.
							</figure>
						</section>

						<figure class="bubble">
							<figure class="dot" v-if="buyAmount === 75"></figure>
						</figure>
					</section>
				</section>

				<section class="onboarder-input">
					<figure class="input-holder normal">
						<input placeholder="Enter your email" v-model="email" />
					</figure>
				</section>



				<Button text="Use Credit Card" primary="1" @click.native="loadWallet" />
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
		<!--            VERIFY IDENTITY         -->
		<!---------------------------------------->
		<section class="page" v-show="state === STATES.IDENTITY_SUCCESS">
			<section>
				<section class="image">
					<img src="assets/onboarding_identity_success.jpg" />
				</section>
				<figure class="title"><b>{{identityName || 'pandaluvr'}}</b><span class="blue">:scatter</span></figure>
				<figure class="sub-title">Congratulations, you've claimed this digital identity</figure>


				<Button text="NEXT" primary="1" @click.native="state = STATES.FUND_ACCOUNT" />
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

	const STATES = {
		GET_STARTED:'get_started',
		NAME_YOURSELF:'name_yourself',
		CLAIM_IDENTITY:'claim_identity',
		FUND_ACCOUNT:'fund_account',
		VERIFY_IDENTITY:'verify_identity',
		IDENTITY_SUCCESS:'identity_success',
	};

	export default {
		data(){return {
			STATES,
			state:STATES.GET_STARTED,

			identityName:'',
			email:'',
			buyAmount:25,
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
				if(this.state === STATES.NAME_YOURSELF) return this.state = STATES.GET_STARTED;
				if(this.state === STATES.FUND_ACCOUNT) return this.state = STATES.NAME_YOURSELF;
				if(this.state === STATES.CLAIM_IDENTITY) return this.state = STATES.NAME_YOURSELF;
				if(this.state === STATES.VERIFY_IDENTITY) return this.state = STATES.FUND_ACCOUNT;
			},
			skip(){
				if(this.state === STATES.NAME_YOURSELF) return this.state = STATES.FUND_ACCOUNT;
				if(this.state === STATES.FUND_ACCOUNT) return this.finished();
				// if(this.state === STATES.FUND_ACCOUNT) return this.state = STATES.VERIFY_IDENTITY;
				if(this.state === STATES.VERIFY_IDENTITY) return this.finished();
			},
			selectIdName(){
				this.$refs.idname.focus();
				this.$refs.idname.select();
				this.identityName = '';
			},
			claimName(){
				// TODO: integrate RIDL and FIO
				// this.state = STATES.IDENTITY_SUCCESS;

				const clone = this.scatter.clone();
				clone.keychain.identities[0].name = this.identityName;
				this[Actions.SET_SCATTER](clone);

				this.state = STATES.FUND_ACCOUNT;
			},

			async loadWallet(){

				// Basic regex, don't need more than this.
				if(!/\S+@\S+\.\S+/.test(this.email)) return PopupService.push(Popups.snackbar("Email is invalid"));


				const clone = this.scatter.clone();
				clone.keychain.identities[0].personal.email = this.email;
				this[Actions.SET_SCATTER](clone);


				const token = PluginRepository.plugin('eos').defaultToken();
				if(!token) return PopupService.push(Popups.snackbar('There was an error loading your wallet (no token)'));

				const keypair = this.scatter.keychain.keypairs.find(x => x.blockchains[0] === 'eos');
				if(!keypair) return PopupService.push(Popups.snackbar('There was an error loading your wallet (no keypair)'));

				const randomName = await EosioHelpers.getRandomName();
				console.log('randomName', randomName);

				const bought = await PopupService.push(Popups.moonpay(token, this.buyAmount, 'makeaccounts', `${keypair.publicKeys.find(x => x.blockchain === 'eos').key},${randomName}`, this.email));
				console.log('bought', bought);
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
			top:10px;
			color:$blue;
			font-size: $font-size-medium;
			font-weight: bold;
			display:flex;
			align-items: center;
			padding:10px;
			cursor: pointer;

			i {
				margin-top:-1px;
			}
		}

		.back {
			left:10px;

			i {
				margin-right:10px;
			}
		}

		.skip {
			right:10px;

			i {
				margin-left:10px;
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
				animation: onboard-bounce 4s ease infinite;
				z-index:-1;
				position: relative;
			}

			@keyframes onboard-bounce {
				0% { transform:rotateZ(0deg); }
				25% { transform:rotateZ(7deg); }
				50% { transform:rotateZ(-7deg); }
				100% { transform:rotateZ(0deg); }
			}

			.title {
				font-size: 28px;

				.blue {
					color:$blue;
					font-weight: bold;
				}
			}

			.sub-title {
				font-size: $font-size-standard;
				color:$blue;
				margin-top:4px;
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
					font-size: 24px;
					font-weight: bold;
					text-align:right;
					cursor: text;
					position: relative;

					input {
						flex:0 auto;
						font-size: 24px;
						font-weight: bold;
						text-align:center;
						cursor: text;
						position: relative;
						border:0;
						outline:0;
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
							font-size: 24px;
							text-align:center;
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
					border:2px solid rgba(0, 168, 255, 0.4);
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
