<template>
	<section class="buy-with-card transfer">

		<section class="popup-content">


			<svg width="42px" height="39px" viewBox="0 0 42 39" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			        <g id="scatter_simple_wallet_assets" transform="translate(-900.000000, -458.000000)" fill="#FFFFFF" stroke="#0799FF" stroke-width="4">
			            <ellipse id="Oval-Copy-8" cx="921" cy="485.5" rx="19" ry="9.5"></ellipse>
			            <ellipse id="Oval-Copy-6" cx="921" cy="477.5" rx="19" ry="9.5"></ellipse>
			            <ellipse id="Oval" cx="921" cy="469.5" rx="19" ry="9.5"></ellipse>
			        </g>
			    </g>
			</svg>
			
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
				              :title="`How much <span>${token.symbol}</span> do you <br>want to buy?`"
				              v-on:amount="x => amount = x" />
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
			<Button secondary="1" @click.native="() => closer(null)" text="Cancel" />
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