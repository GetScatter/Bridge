<template>
	<section class="stabilize transfer">

		<section class="popup-content" :class="{'buying':buying || success}">
			<section>
				<TransferHead :token="token"
				              :title="`How much <span>${token.symbol}</span> do you <br>want to <span>stabilize</span>?`"
				              v-on:amount="x => amount = x" subtitle="Stabilizing turns tokens into a pegged currency, meaning a token's monetary value is always tied to a fiat currency's value." />
			</section>

			<!--<section class="threshold" v-if="diffFromMinimum > 0">-->
				<!--<figure class="premium">-->
					<!--Our credit card partners require a minimum of {{currency}}20, you still need {{currency}}{{parseFloat(parseFloat(diffFromMinimum).toFixed(2))}}.-->
				<!--</figure>-->
			<!--</section>-->


		</section>




		<section class="please-wait" :class="{'show':buying}">
			<figure class="title">Please wait</figure>
			<figure class="sub-title">You're stabilizing some {{token.symbol}} tokens into {{stable.symbol}}.</figure>
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
			<Button :loading="buying" primary="1" @click.native="stabilize" icon="fal fa-balance-scale" :text="`Stabilize`" />
		</section>

		<section class="popup-buttons" v-if="success">
			<figure></figure>
			<Button primary="1" @click.native="closer(true)" text="Close" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import PriceService from "@walletpack/core/services/apis/PriceService";

	import TransferHead from "../reusable/TransferHead";
	import {mapState} from "vuex";
	import Stabilizer, {STABLE_COINS} from "../../services/special/Stabilizer";

	export default {
		props:['popin', 'closer'],
		components: {TransferHead},
		data(){return {
			amount:0,

			buying:false,
			success:false,
		}},
		created(){
			this.amount = this.popin.data.props.amount;
		},
		computed:{
			...mapState([
				'scatter',
				'currencies',
			]),
			token(){
				return this.popin.data.props.token
			},
			currency(){
				return PriceService.fiatSymbol()
			},
			stable(){
				return STABLE_COINS[this.token.blockchain];
			}
		},
		methods:{
			async stabilize() {
				this.buying = true;
				this.success = await Stabilizer.stabilize(this.token, this.amount);
				this.buying = false;
			}
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.stabilize {
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

		.tokens-amount {
			font-size: $font-size-standard;
			margin-top:5px;
		}
	}

	.blue-steel {
		.stabilize {
			.cvx {
				border:1px solid $borderdark;
				background:lighten($dark, 4%);
			}
		}
	}

</style>
