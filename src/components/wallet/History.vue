<template>
	<section class="history limiter panel-pad">

		<slot></slot>

		<section class="action-bar">
			<section class="tab-info">
				<figure class="title">Your History</figure>
				<figure class="description">A list of your recent actions</figure>
			</section>
		</section>

		<SearchBar :options="filters"
		           v-on:terms="x => terms = x"
		           v-on:selected="x => blockchainFilter = x" />

		<section class="history-list">

			<section class="history" v-for="hist in histories">
				<figure class="icon"></figure>




				<!------- EXCHANGE ------------>
				<!------- EXCHANGE ------------>
				<!------- EXCHANGE ------------>
				<section class="info-group" style="flex:1.5;" v-if="hist.type === HISTORY_TYPES.Exchange">
					<figure class="big-text">Exchanged {{hist.fromToken.symbol}} for {{hist.toToken.symbol}}</figure>
					<figure class="small-text">{{formatNumber(hist.fromToken.amount)}} {{hist.fromToken.symbol}} to {{formatNumber(hist.toToken.amount)}} {{hist.toToken.symbol}}</figure>
				</section>
				<section class="info-group" v-if="hist.type === HISTORY_TYPES.Exchange">
					<figure class="big-text">{{currency}}{{formatNumber(hist.toToken.fiatBalance(false))}}</figure>
					<figure class="small-text">{{new Date(hist.timestamp).toLocaleDateString()}}</figure>
				</section>



				<!------- TRANSFER ------------>
				<!------- TRANSFER ------------>
				<!------- TRANSFER ------------>
				<section class="info-group" style="flex:1.5;" v-if="hist.type === HISTORY_TYPES.Transfer">
					<figure class="big-text">Sent {{hist.token.amount}} {{hist.token.symbol}}</figure>
					<figure class="small-text">{{hist.to}}</figure>
				</section>
				<section class="info-group" v-if="hist.type === HISTORY_TYPES.Transfer">
					<figure class="big-text">{{currency}}{{formatNumber(hist.token.fiatBalance(false))}}</figure>
					<figure class="small-text">{{new Date(hist.timestamp).toLocaleDateString()}}</figure>
				</section>







				<section class="actions">
					<Button icon="fas fa-sync-alt" />
				</section>
			</section>








		</section>
	</section>
</template>

<script>
	import {mapState} from "vuex";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import {blockchainName, BlockchainsArray} from "@walletpack/core/models/Blockchains";
	import {HISTORY_TYPES} from "@walletpack/core/models/histories/History";


	export default {
		data(){return {
			terms:'',
			blockchainFilter:null,
			HISTORY_TYPES
		}},
		computed:{
			...mapState([
				'scatter',
				'history'
			]),
			filters(){
				return [{text:'All', value:null}].concat(BlockchainsArray.map(kv => {
					return {text:blockchainName(kv.value), value:kv.value};
				}));
			},
			currency(){
				return PriceService.fiatSymbol()
			},
			histories(){
				return this.history;
			}
		},
		methods:{

		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.history {

		.history-list {
			.history {
				padding:20px 0;
				display:flex;
				align-items: center;
				overflow: hidden;
				position: relative;

				&:not(:last-child){
					border-bottom:1px solid $borderlight;
				}

				.icon {
					width:46px;
					height:46px;
					border-radius:50%;
					margin-right:20px;
					background:$grey;

					// Lots of tokens makes this slow on mobile :(
					//box-shadow:inset 0 -10px 20px rgba(0,0,0,0.2), inset 0 10px 20px rgba(255,255,255,0.2);

					&:after {
						content:'';
						display:block;
						width:42px;
						height:42px;
						margin:2px 0 0 2px;
						border-radius:50%;
						opacity:0;

						transition:$themetransition;
						transition-property: background, opacity;
					}
				}

				.info-group {
					flex:1;
					padding-right:20px;

					.big-text {
						font-size: 16px;
						font-weight: bold;
					}

					.small-text {
						font-size: 11px;
						font-weight: bold;
						margin-top:3px;
						color:$grey;
					}
				}

				.actions {
					flex:0 0 auto;

					button {
						display:inline-block;
						margin-left:5px;
					}
				}
			}
		}
	}

	.blue-steel {
		.history {

			.history-list {
				.history {
					&:not(:last-child){
						border-bottom:1px solid $borderdark;
					}
				}
			}
		}
	}



</style>
