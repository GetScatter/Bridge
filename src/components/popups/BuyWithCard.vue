<template>
	<section class="buy-with-card transfer">

		<section class="popup-content" v-if="canBuy === null">

			<figure class="title">Please <span>Wait</span></figure>
			<figure class="sub-title">We're checking if your country is supported for credit card purchases.</figure>
			<section class="loading">
				<i class="fa fa-spinner animate-spin"></i>
			</section>
		</section>

		<section class="popup-content" v-if="canBuy === false">
			<figure class="title">Country not supported!</figure>
			<figure class="sub-title">We're sorry, but token purchases from your country using credit cards is not supported at the moment.</figure>
		</section>

		<section class="popup-content" v-if="canBuy === true" :class="{'buying':buying || success}">

			<!----------- FIXED AMOUNT ------------------>
			<section v-if="fixedAmount">
				<TransferHead :token="token"
				              :title="`You need more <span>${token.symbol}</span>, do you want to buy it?`"
				              :value="fixedAmount" />

			</section>

			<!----------- DYNAMIC AMOUNT ------------------>
			<section v-else>
				<TransferHead :token="token"
				              :title="`How much <span>${token.symbol}</span> do you <br>want to <span>buy</span>?`"
				              v-on:amount="x => amount = x" :max="kycRequired ? kycRequired : null" />
			</section>

			<section class="threshold" v-if="diffFromMinimum > 0">
				<figure class="premium">
					Our credit card partners require a minimum of {{currency}}20.
				</figure>
			</section>


		</section>




		<section class="please-wait" :class="{'show':buying}">
			<figure class="title">Get Ready</figure>
			<figure class="sub-title">You're buying some sweet {{token.symbol}} tokens.</figure>
		</section>

		<section class="success" :class="{'show':success}">
			<figure class="title">Woohoo!</figure>
			<figure class="sub-title">
				Everything looks good and your order has been sent off for processing.
				You'll get a notification when your shiny tokens arrive.
			</figure>
		</section>

		<section class="popup-buttons" v-if="!success">
			<Button :primary="canBuy !== true" :disabled="buying" @click.native="() => closer(null)" text="Cancel" />
			<Button v-if="canBuy === true" :disabled="diffFromMinimum > 0" :loading="buying" primary="1" @click.native="buy" icon="far fa-shopping-cart" :text="`Buy ${token.symbol}`" />
		</section>

		<section class="popup-buttons" v-if="success">
			<figure></figure>
			<Button primary="1" @click.native="closer(true)" text="Close" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import ContactService from "@walletpack/core/services/utility/ContactService";
	import Contact from "@walletpack/core/models/Contact";
	import PriceService from "@walletpack/core/services/apis/PriceService";

	import TransferHead from "../reusable/TransferHead";
	import PurchasingService from "../../services/credit/PurchasingService";
	import {mapState} from "vuex";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import BalanceHelpers from "../../services/utility/BalanceHelpers";
	import Moonpay from "../../services/credit/Moonpay";
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";

	export default {
		props:['popin', 'closer'],
		components: {TransferHead},
		data(){return {
			amount:0,
			fixedAmount:false,
			cvx:'',

			buying:false,
			success:false,

			loadedPrice:0,

			canBuy:null,
		}},
		created(){
			this.amount = this.popin.data.props.amount;
			this.fixedAmount = this.popin.data.props.amount;

			Moonpay.isAvailable().then(available => {
				this.canBuy = available;

				if(available){
					Moonpay.getTokenPrice(this.token).then(prices => {
						if(prices.hasOwnProperty(this.scatter.settings.displayCurrency)) this.loadedPrice = prices[this.scatter.settings.displayCurrency];
						else this.loadedPrice = prices['USD'];
					})
				}
			})
		},
		computed:{
			...mapState([
				'scatter',
				'kycRequired',
				'currencies',
			]),
			token(){
				return this.popin.data.props.token
			},
			currency(){
				return PriceService.fiatSymbol()
			},
			fiatPrice(){
				if(this.isStableCoin){
					return parseFloat(this.currencies[this.scatter.settings.displayCurrency]);
				}
				return this.loadedPrice ? parseFloat(this.loadedPrice) : 0;
			},
			fiat(){
				if(!this.amount) return 0;
				return parseFloat(parseFloat(this.fiatPrice * parseFloat(this.amount)).toFixed(6));
			},
			isStableCoin(){
				return BalanceHelpers.isStableCoin(this.token);
			},
			diffFromMinimum(){
				return 20 - this.fiat;
			},
		},
		methods:{
			async buy(){
				if(this.amount <= 0) return PopupService.push(Popups.snackbar("You must specify an amount to buy."));
				if(this.buying) return;
				this.buying = true;

				const token = this.token.clone();
				token.amount = this.amount;
				const account = SingularAccounts.accounts([token.network()])[0];
				if(!account) return PopupService.push(Popups.snackbar(`No account found for ${token.network().name}`));

				const random = Math.round(Math.random() * 9999999);

				const bought = await PopupService.push(Popups.moonpay(token, this.fiat, account.sendable(), null, this.scatter.keychain.identities[0].personal.email, random));

				const check = async () => {
					let completed = await Moonpay.checkStatus(random);
					console.log(completed);
					if(!completed || !completed.length){
						this.success = false;
						this.buying = false;
						PopupService.push(Popups.snackbar("We couldn't verify the purchase automatically, please check your email."));
					} else {
						completed = completed[0];

						if(completed.status === 'completed'){
							await Moonpay.removeHook(completed.unique);
							this.success = true;
							this.buying = false;

							setTimeout(() => {
								BalanceService.loadBalancesFor(account);
							}, 10000);
						}

						else if(completed.status === 'failed'){
							this.success = false;
							this.buying = false;
							PopupService.push(Popups.snackbar('There was an issue loading your funds.'));
						}

						// Recurse if still pending
						else setTimeout(() => check(), 500);
					}
				};

				check();
			}
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.buy-with-card {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;
		position: relative;

		.popup-content {
			opacity:1;

			transition:all 0.2s ease;
			transition-property: opacity;
			&.buying {
				opacity:0;
			}

			.sub-title {
				margin-top:-20px;
			}

			.loading {
				margin-top:40px;

				i {
					font-size: 48px;
					color:$grey;
				}
			}
		}

		.please-wait, .success {
			position:absolute;
			top:0;
			bottom:0;
			left:0;
			right:0;
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			opacity: 0;
			visibility: hidden;
			padding:0 40px 40px;

			transition:all 0.2s ease;
			transition-property: opacity, visibility;

			&.show {
				opacity:1;
				visibility: visible;
			}

			.title {
				margin:0;
			}

			.sub-title {
				margin-top:10px;
			}
		}

		.sub-title {
			font-size: $font-size-standard;
			color:$grey;
		}

		.cvx {
			display:flex;
			text-align:left;
			align-items: center;
			border:1px solid $borderlight;
			border-top:0;
			padding:5px 5px 5px 10px;
			border-bottom-left-radius:4px;
			border-bottom-right-radius:4px;
			background:$softblue;

			.text {
				padding-right:10px;
				font-size: $font-size-standard;
				font-weight: bold;
			}

			.input {
				width:120px;
				margin:0;
			}
		}

		.reached-threshold {
			max-height:0;
			padding:0 20px;
			margin:0 -40px 0;
			font-size: $font-size-small;
			background:$softblue;
			overflow: hidden;
			display:flex;
			text-align:left;
			align-items: center;

			button {
				display:inline-block;
				margin-left:20px;
				flex:0 0 auto;
			}

			&.show {
				max-height:200px;
				padding:20px 20px;
				margin:40px -40px -40px;
			}
		}

		.threshold {
			padding:10px 20px;
			border-top:1px solid $borderlight;
			margin:40px -40px -40px -40px;
			overflow: hidden;

			&.hide {
				border-top:1px solid transparent;
				padding:0 20px;
				margin:0 -40px 0;
				max-height:0;
			}

			.premium {
				text-align:center;
				margin-top:10px;
				padding-bottom:10px;
				font-size: $font-size-small;
				font-weight: bold;

				span {
					color:$blue;

				}

				button {
					margin-left:30px;
					flex:0 0 auto;
				}
			}

		}

		.terms {
			display:flex;
			margin-top:30px;
			align-items: center;

			input {
				width:24px;
				height:24px;
				margin-right:10px;
			}
		}

		.fiat {
			margin-top:30px;
			font-size: $font-size-large;
		}

		.tokens-amount {
			font-size: $font-size-standard;
			margin-top:5px;
		}
	}

	.blue-steel {
		.buy-with-card {
			.cvx {
				border:1px solid $borderdark;
				background:lighten($dark, 4%);
			}
		}
	}

</style>
