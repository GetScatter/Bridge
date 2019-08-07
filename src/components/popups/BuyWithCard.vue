<template>
	<section class="buy-with-card transfer">

		<section class="popup-content">

			
			<svg width="66px" height="44px" viewBox="0 0 66 44" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			    <defs>
			        <linearGradient x1="0%" y1="108.291016%" x2="0%" y2="0%" id="linearGradient-1">
			            <stop stop-color="#1EB2FF" offset="0%"></stop>
			            <stop stop-color="#8AD7FF" offset="100%"></stop>
			        </linearGradient>
			    </defs>
			    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			        <g id="market_signedin_user" transform="translate(-183.000000, -635.000000)" fill="url(#linearGradient-1)" fill-rule="nonzero">
			            <path d="M191.748538,671.373206 L191.748538,662.467836 C191.748538,661.974448 192.040888,661.549342 192.46181,661.356296 C189.482588,659.952849 187.082095,658.272255 185.444444,656.386278 L185.444444,663.561404 C185.444444,666.43364 187.790998,669.16364 191.748538,671.373206 Z M192.206829,674.357629 C186.512254,671.614037 183,667.842499 183,663.561404 L183,651.532164 C183,651.425208 183.013738,651.32146 183.039547,651.22259 C183.013285,650.963267 183,650.701895 183,650.438596 C183,641.644144 197.821553,635 215.935673,635 C234.049792,635 248.871345,641.644144 248.871345,650.438596 C248.871345,650.701895 248.85806,650.963267 248.831798,651.22259 C248.857607,651.32146 248.871345,651.425208 248.871345,651.532164 L248.871345,663.561404 C248.871345,672.355856 234.049792,679 215.935673,679 C206.902555,679 198.688233,677.347734 192.722431,674.600489 C192.530204,674.560812 192.354483,674.476003 192.206829,674.357629 Z M194.192982,672.582149 C196.062812,673.403091 198.181223,674.123797 200.497076,674.717974 L200.497076,664.654971 C200.497076,664.474957 200.535993,664.304032 200.605873,664.150151 C198.269489,663.585169 196.097584,662.892807 194.133441,662.089936 C194.172092,662.208938 194.192982,662.335948 194.192982,662.467836 L194.192982,672.582149 Z M202.94152,675.282385 C206.877664,676.094595 211.280175,676.555556 215.935673,676.555556 C232.851263,676.555556 246.426901,670.469925 246.426901,663.561404 L246.426901,656.386278 C241.498784,662.061675 229.662636,665.877193 215.935673,665.877193 C211.327997,665.877193 206.933362,665.447292 202.94152,664.661452 L202.94152,675.282385 Z M215.935673,663.432749 C232.851263,663.432749 246.426901,657.347118 246.426901,650.438596 C246.426901,643.530075 232.851263,637.444444 215.935673,637.444444 C199.020082,637.444444 185.444444,643.530075 185.444444,650.438596 C185.444444,657.347118 199.020082,663.432749 215.935673,663.432749 Z" id="Combined-Shape"></path>
			        </g>
			    </g>
			</svg>
			
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