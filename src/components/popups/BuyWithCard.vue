<template>
	<section class="buy-with-card transfer">

		<section class="popup-content" :class="{'buying':buying || success}">

			
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

			<section class="threshold" :class="{'hide':!kycRequired || kycRequired <= fiat}">

				<figure class="premium">
					<section>
						<span>
						You are <u>{{currency}}{{kycRequired}}</u> away from reaching the $150 threshold.
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
			<Button :disabled="buying" secondary="1" @click.native="() => closer(null)" text="Cancel" />
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