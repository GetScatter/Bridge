<template>
	<section class="buy-with-card transfer">


		<section class="popup-content">
			<!----------- FIXED AMOUNT ------------------>
			<!----------- FIXED AMOUNT ------------------>
			<!----------- FIXED AMOUNT ------------------>
			<section v-if="fixedAmount">
				<TransferHead :token="token"
				              :title="`You need more <b>${token.symbol}</b>, do you want to <span>buy</span> it?`"
				              :value="fixedAmount" />

			</section>

			<!----------- DYNAMIC AMOUNT ------------------>
			<!----------- DYNAMIC AMOUNT ------------------>
			<!----------- DYNAMIC AMOUNT ------------------>
			<section v-else>
				<TransferHead :token="token"
				              :title="`How much <b>${token.symbol}</b> do you want to <span>buy</span>?`"
				              v-on:amount="x => amount = x" />
			</section>

			<br>
			<figure class="line"></figure>

			<figure class="premium" style="margin-top:30px;">
				<figure>
					Get Premium to lower credit card fees and remove threshold limitations.
				</figure>
				<Button text="Premium" />
			</figure>

			<figure class="line"></figure>
			<figure class="sub-title smaller terms">
				<input type="checkbox" />
				<u><a target="_blank" href="https://get-scatter.com">I have read the terms and conditions first.</a></u>
			</figure>

		</section>

		<section class="popup-buttons">
			<Button secondary="1" @click.native="closer" text="Cancel" />
			<Button primary="1" :text="`Buy ${token.symbol}`" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import ContactService from "@walletpack/core/services/utility/ContactService";
	import Contact from "@walletpack/core/models/Contact";
	import PriceService from "@walletpack/core/services/apis/PriceService";

	import TransferHead from "../reusable/TransferHead";

	export default {
		props:['popin', 'closer'],
		components: {TransferHead},
		data(){return {
			name:'',
			note:'',
			amount:0,
			fixedAmount:false,
		}},
		created(){
			this.amount = this.popin.data.props.amount;
			this.fixedAmount = this.popin.data.props.amount;
			console.log('this.fixedAmount', this.popin.data.props, this.fixedAmount);
		},
		computed:{
			token(){
				return this.popin.data.props.token
			},
			currency(){
				return PriceService.fiatSymbol()
			},
		},
		methods:{

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

		.premium {
			display:flex;
			align-items: center;

			font-size:  $font-size-standard;

			padding-bottom:30px;

			button {
				margin-left:30px;
				flex:0 0 auto;
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


</style>