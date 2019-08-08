<template>
	<section class="buy-with-card transfer">


		<section class="popup-content">
			<!----------- FIXED AMOUNT ------------------>
			<!----------- FIXED AMOUNT ------------------>
			<!----------- FIXED AMOUNT ------------------>
			<section v-if="fixedAmount">
				<TransferHead :token="token"
				              :title="`You need more <span>${token.symbol}</span>, do you want to buy it?`"
				              :value="fixedAmount" />

			</section>

			<!----------- DYNAMIC AMOUNT ------------------>
			<!----------- DYNAMIC AMOUNT ------------------>
			<!----------- DYNAMIC AMOUNT ------------------>
			<section v-else>
				<TransferHead :token="token"
				              :title="`How much <span>${token.symbol}</span> do you want to buy?`"
				              v-on:amount="x => amount = x" />
			</section>

			<section class="cvx">
				<figure class="text">Enter the 3 digit code on the back of your card</figure>
				<Input placeholder="CVV" :text="cvx" v-on:changed="x => cvx = x" />
			</section>

			<figure class="premium">
				<figure>
					Get Premium to lower credit card fees and remove threshold limitations.
				</figure>
				<Button text="Premium" />
			</figure>

			<figure class="sub-title smaller terms">
				<input type="checkbox" />
				<u><a target="_blank" href="https://get-scatter.com">I have read the terms and conditions first.</a></u>
			</figure>


		</section>

		<section class="popup-buttons">
			<Button :disabled="buying" secondary="1" @click.native="() => closer(null)" text="Cancel" />
			<Button :loading="buying" primary="1" @click.native="buy" :text="`Buy ${token.symbol}`" />
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
		}},
		created(){
			this.amount = this.popin.data.props.amount;
			this.fixedAmount = this.popin.data.props.amount;
		},
		computed:{
			...mapState([
				'scatter'
			]),
			token(){
				return this.popin.data.props.token
			},
			currency(){
				return PriceService.fiatSymbol()
			},
		},
		methods:{
			async buy(){
				if(this.cvx.length !== 3) return PopupService.push(Popups.snackbar("CVV must be 3 numbers"));
				if(this.buying) return;
				this.buying = true;

				const token = this.token.clone();
				token.amount = this.amount;
				const account = this.token.accounts(true)[0];
				const card = this.scatter.keychain.cards[0];
				const bought = await PurchasingService.purchase(token, account, card, this.cvx);
				console.log('did it buy?', bought);
				this.buying = false;
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.buy-with-card {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;

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

		.premium {
			display:flex;
			align-items: center;
			text-align:left;
			margin-top:50px;
			padding-bottom:10px;

			font-size:  $font-size-standard;

			button {
				margin-left:30px;
				flex:0 0 auto;
			}
		}

		.terms {
			display:flex;
			margin-top:10px;
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


</style>