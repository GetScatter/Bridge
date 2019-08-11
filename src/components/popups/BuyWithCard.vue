<template>
	<section class="buy-with-card transfer">

		<section class="popup-content" :class="{'buying':buying || success}">

			<!----------- FIXED AMOUNT ------------------>
			<section v-if="fixedAmount">
				<TransferHead :token="token"
				              :title="`You need more <span>${token.symbol}</span>, do you want to buy it?`"
				              :value="fixedAmount" />

			</section>

			<!----------- DYNAMIC AMOUNT ------------------>
			<section v-else>
				<TransferHead :token="token"
				              :title="`How much <span>${token.symbol}</span> do you <br>want to buy?`"
				              v-on:amount="x => amount = x" :max="kycRequired ? kycRequired : null" />
			</section>

			<section class="cvx">
				<figure class="text">Enter the 3 digit code on the back of your card</figure>
				<Input type="number" placeholder="CVV" :text="cvx" v-on:changed="x => cvx = x" />
			</section>

			<figure class="sub-title smaller terms">
				<input type="checkbox" v-model="accepted" />
				<u><a target="_blank" href="https://get-scatter.com">I have read the terms and conditions first.</a></u>
			</figure>

			<section v-if="kycRequired !== false">
				<section class="threshold" :class="{'hide':kycRequired <= fiat}">

					<figure class="premium">
						<section>
						<span>
						You are <u>{{currency}}{{kycRequired || 0}}</u> away from reaching the $150 threshold.
						</span>
							Get Premium to lower credit card fees and remove threshold limitations.
						</section>
						<Button text="Premium" />
					</figure>
				</section>

				<section class="reached-threshold" :class="{'show':kycRequired <= fiat}">
					<p>
						<b>You have reached the $150 threshold.</b> Get premium to remove the threshold limitations.
					</p>

					<Button primary="1" text="Premium" />
				</section>
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
			<Button :disabled="buying" @click.native="() => closer(null)" text="Cancel" />
			<Button :loading="buying" primary="1" @click.native="buy" :text="`Buy ${token.symbol}`" />
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

	export default {
		props:['popin', 'closer'],
		components: {TransferHead},
		data(){return {
			name:'',
			note:'',
			amount:0,
			fixedAmount:false,
			cvx:'',

			buying:false,
			accepted:false,
			success:false,
		}},
		created(){
			this.amount = this.popin.data.props.amount;
			this.fixedAmount = this.popin.data.props.amount;
		},
		computed:{
			...mapState([
				'scatter',
				'kycRequired'
			]),
			token(){
				return this.popin.data.props.token
			},
			currency(){
				return PriceService.fiatSymbol()
			},
			fiat(){
				return parseFloat(this.token.fiatPrice(false)) * parseFloat(this.amount);
			}
		},
		methods:{
			async buy(){
				if(!this.accepted) return PopupService.push(Popups.snackbar("You must read and accept the terms first."));
				if(this.amount <= 0) return PopupService.push(Popups.snackbar("You must specify an amount to buy."));
				if(this.cvx.length !== 3) return PopupService.push(Popups.snackbar("CVV must be 3 numbers"));
				if(this.buying) return;
				this.buying = true;

				const token = this.token.clone();
				token.amount = this.amount;
				const account = this.token.accounts(true)[0];
				const card = this.scatter.keychain.cards[0];
				const bought = await PurchasingService.purchase(token, account, card, this.cvx);
				console.log('success', bought);
				// await new Promise(resolve => setTimeout(() => resolve(true), 3000));
				this.buying = false;
				this.success = bought;
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
				display:flex;
				align-items: center;
				text-align:left;
				margin-top:10px;
				padding-bottom:10px;
				font-size: $font-size-tiny;
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

		.token-amount {
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