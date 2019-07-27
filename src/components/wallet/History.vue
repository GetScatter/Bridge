<template>
	<section class="history limiter panel-pad">
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

			<!------- EXCHANGE ------------>
			<section class="history">
				<figure class="icon"></figure>
				<section class="info-group" style="flex:1.5;">
					<figure class="big-text">Exchanged EOS for ETH</figure>
					<figure class="small-text">100 EOS to 0.4 ETH</figure>
				</section>
				<section class="info-group">
					<figure class="big-text">$1000</figure>
					<figure class="small-text">12/12/19 22:31</figure>
				</section>
				<section class="actions">
					<Button icon="fas fa-sync-alt" />
				</section>
			</section>


			<!------- TRANSFER ------------>
			<section class="history">
				<figure class="icon"></figure>
				<section class="info-group" style="flex:1.5;">
					<figure class="big-text">Sent 1 EOS</figure>
					<figure class="small-text">ramijames123</figure>
				</section>
				<section class="info-group">
					<figure class="big-text">$4.2</figure>
					<figure class="small-text">12/12/19 22:31</figure>
				</section>
				<section class="actions">
					<Button icon="fas fa-sync-alt" />
				</section>
			</section>


			<!------- ACTION ------------>
			<!--<section class="history">-->
				<!--<figure class="icon"></figure>-->
				<!--<section class="info-group">-->
					<!--<figure class="big-text">Exchanged EOS for ETH</figure>-->
					<!--<figure class="small-text">100 EOS to 0.4 ETH</figure>-->
				<!--</section>-->
				<!--<section class="info-group">-->
					<!--<figure class="big-text">$1000</figure>-->
					<!--<figure class="small-text">12/12/19 22:31</figure>-->
				<!--</section>-->
			<!--</section>-->







		</section>
	</section>
</template>

<script>
	import PopupService from "scatter-core/services/utility/PopupService";
	import Popups from "../../util/Popups";
	import {mapState} from "vuex";
	import BalanceService from "scatter-core/services/blockchain/BalanceService";
	import PriceService from "scatter-core/services/apis/PriceService";
	import Hasher from "scatter-core/util/Hasher";
	import {blockchainName, BlockchainsArray} from "scatter-core/models/Blockchains";


	export default {
		data(){return {
			terms:'',
			blockchainFilter:null,
		}},
		computed:{
			...mapState([
				'scatter'
			]),
			filters(){
				return [{text:'All Blockchains', value:null}].concat(BlockchainsArray.map(kv => {
					return {text:blockchainName(kv.value), value:kv.value};
				}));
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

						transition:all 1s ease;
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