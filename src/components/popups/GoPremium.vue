<template>
	<section class="go-premium" :class="{'embedded':embedded}">

		<section class="popup-head blue-back" v-if="!embedded">
			Get more out of Scatter by getting <b>Premium</b>
		</section>

		<section v-if="state === STATES.BENEFITS" class="popup-content">

			<section class="benefits">

				<!-- FREE TRANSACTIONS -->
				<section class="benefit">
					<figure class="image">
						<img src="static/assets/identity.svg" />
					</figure>
					<figure class="description">
						<b>Free Transactions</b>
						<span>Up to 100 free transactions per month.</span>
					</figure>
				</section>

				<!-- UNIQUE IDENTITY -->
				<section class="benefit">
					<figure class="image">
						<img src="static/assets/love.svg" />
					</figure>
					<figure class="description">
						<b>Named Identity</b>
						<span>Make it easier to send you tokens and money.</span>
					</figure>
				</section>

				<!-- FRIENDS/CONTACTS LIST -->
				<section class="benefit">
					<figure class="image">
						<img src="static/assets/panda.svg" />
					</figure>
					<figure class="description">
						<b>Friends List</b>
						<span>Curate your own friends list.</span>
					</figure>
				</section>

				<!-- MONEY REQUESTS -->
				<section class="benefit">
					<figure class="image">
						<img src="static/assets/savings.svg" />
					</figure>
					<figure class="description">
						<b>Send and request money easily</b>
						<span>Request money from your friends list.</span>
					</figure>
				</section>


			</section>
		</section>

		<section v-if="state === STATES.ENTER_DETAILS" class="popup-content">
			<Input label="Email" placeholder="Enter your email" :text="email" v-on:changed="x => email = x" />
			<Input label="Full Name" style="margin-bottom:0;" placeholder="Enter your full name" :text="fullname" v-on:changed="x => fullname = x" />
		</section>


		<section class="popup-buttons" v-if="state === STATES.BENEFITS">
			<Button style="margin:0 0 5px 0;" primary="1" @click.native="state = STATES.ENTER_DETAILS" icon="far fa-gift" :text="`Get premium`" />
			<Button v-if="!embedded" style="margin:0;" :disabled="buying" @click.native="embedded ? null : closer(null)" text="Not now" />
		</section>

		<section class="popup-buttons" v-if="state === STATES.ENTER_DETAILS">
			<Button style="margin:0 0 5px 0;" @click.native="getPremium(10)" icon="fal fa-infinity" :text="`Pay $10 every month`" />
			<Button style="margin:0 0 5px 0;" primary="1" @click.native="getPremium(100)" icon="far fa-gift" :text="`Pay $100 for the whole year`" />
			<Button style="margin:0;" @click.native="state = STATES.BENEFITS" text="Back" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import {mapActions, mapState} from "vuex";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import IdentityService from "@walletpack/core/services/utility/IdentityService";
	import PremiumService from "../../services/premium/PremiumService";

	const STATES = {
		BENEFITS:0,
		ENTER_DETAILS:1,
	};

	export default {
		props:['popin', 'closer', 'embedded'],
		data(){return {
			buying:false,
			STATES,
			state:STATES.BENEFITS,

			fullname:'',
			email:'',
		}},
		created(){
			this.email = this.identity.personal.email;
			this.fullname = [this.identity.personal.firstname, this.identity.personal.lastname].filter(x => x && x.length).join(' ');
		},
		computed:{
			...mapState([
				'scatter',
			]),
			identity(){
				return this.scatter.keychain.identities[0]
			},
			validEmail(){
				return this.email && this.email.length && /\S+@\S+\.\S+/.test(this.email);
			},
			validName(){
				return this.fullname && this.fullname.length > 5;
			},
		},
		methods:{
			async getPremium(payment /* 10 is monthly, 100 is yearly */){
				if(payment !== 10 && payment !== 100) return console.error('This should never happen [GoPremium.vue]');
				console.log(this.email);
				if(!this.validEmail) return PopupService.push(Popups.snackbar("The email you entered is invalid."));
				if(!this.validName) return PopupService.push(Popups.snackbar("Please enter your full name."));

				const identityClone = this.identity.clone();
				identityClone.personal.email = this.email;
				const names = this.fullname.trim().split(' ');
				identityClone.personal.firstname = names.slice(0, names.length > 1 ? names.length-1 : 1).join(' ').trim();
				identityClone.personal.lastname = names.length > 1 ? names[names.length-1].trim() : '';
				await IdentityService.updateIdentity(identityClone);

				const result = await PremiumService.goPremium(payment);

				console.log('result', result);

			},

		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.go-premium {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;
		position: relative;

		.popup-content {
			opacity:1;

			transition:all 0.2s ease;
			transition-property: opacity;

			.sub-title {
				margin-top:-20px;
			}
		}

		.sub-title {
			font-size: $font-size-standard;
			color:$grey;
		}

		.popup-buttons {
			flex-direction: column;
		}

		.benefits {
			.benefit {
				display:flex;
				align-items: center;

				&:not(:last-child){
					margin-bottom:20px;
				}

				$image:70px;
				.image {
					width:$image;
					height:$image;

					img {
						width:$image;
						height:$image;
					}
				}

				.description {
					margin-left:20px;
					text-align:left;

					b {
						color:$blue;
						display:block;
						font-size: $font-size-small;
					}

					span {
						font-size: $font-size-tiny;
					}
				}
			}
		}

		&.embedded {
			box-shadow:0 0 40px $opaqueblue;
			padding:20px;
			border-radius:4px;

			.popup-buttons {
				margin-top:30px;
				width:100%;
				display:flex;
				flex-direction: row-reverse;
			}

			.benefits {
				$image:80px;
				.image {
					width:$image;
					height:$image;

					img {
						width:$image;
						height:$image;
					}
				}
			}
		}
	}

	.blue-steel {

	}

	.mobile {
		.go-premium {
			.benefits {
				$image:60px;
				.image {
					width:$image;
					height:$image;

					img {
						width:$image;
						height:$image;
					}
				}
			}
		}
	}

</style>
