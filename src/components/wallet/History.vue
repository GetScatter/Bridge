<template>
	<section class="history">

		<section class="hero-panel">
			<figure class="corners"></figure>
		</section>

		<slot></slot>

		<section class=" limiter panel-pad">
			<section class="action-bar">
				<section class="tab-info">
					<figure class="title">Your History</figure>
					<figure class="description">A list of your recent actions</figure>
				</section>
			</section>

			<section class="flex">
				<SearchBar v-on:terms="x => terms = x" placeholder="Search your history" />
				<Button icon="fal fa-ban" v-tooltip="`Clear History`" style="flex:0 0 auto; height:34px; margin-top:20px;" primary="1" @click.native="clearHistory" />
			</section>

			<section class="history-list">

				<section class="history" v-for="hist in histories">
					<figure class="icon">
						<SymbolBall v-tooltip="`Exchange`" v-if="hist.type === HISTORY_TYPES.Exchange" :token="hist.fromToken" symbol="fal fa-exchange-alt" />
						<SymbolBall v-if="hist.type === HISTORY_TYPES.Exchange" :token="hist.toToken" symbol="fal fa-exchange-alt" />
						<SymbolBall v-tooltip="`Transfer`" v-if="hist.type === HISTORY_TYPES.Transfer" :token="hist.token" symbol="fal fa-paper-plane" />
						<SymbolBall v-tooltip="`Action`" v-if="hist.type === HISTORY_TYPES.Action" symbol="fal fa-exclamation" />
					</figure>




					<!------- ACTION ------------>
					<section class="info-group" style="flex:1.5;" v-if="hist.type === HISTORY_TYPES.Action">
						<figure class="big-text">{{hist.action}}</figure>
						<figure class="small-text" v-if="getActionAccount(hist)">{{getActionAccount(hist).network().name}}</figure>
					</section>

					<!------- EXCHANGE ------------>
					<section class="info-group" style="flex:1.5;" v-if="hist.type === HISTORY_TYPES.Exchange">
						<figure class="big-text">Converted {{hist.fromToken.symbol}} to {{hist.toToken.symbol}}</figure>
						<figure class="small-text">{{formatNumber(parseFloat(hist.orderDetails.deposit).toFixed(hist.fromToken.decimals))}} {{hist.fromToken.symbol}} to {{formatNumber(parseFloat(hist.orderDetails.expected).toFixed(hist.toToken.decimals)) || ''}} {{hist.toToken.symbol}}</figure>
					</section>

					<!------- TRANSFER ------------>
					<section class="info-group" style="flex:1.5;" v-if="hist.type === HISTORY_TYPES.Transfer">
						<figure class="big-text">Sent {{hist.token.amount}} {{hist.token.symbol}}</figure>
						<figure class="small-text">to <u>{{hist.to}}</u></figure>
					</section>







					<section class="actions">
						<Button v-tooltip="`Redo`" v-if="hist.type === HISTORY_TYPES.Exchange || hist.type === HISTORY_TYPES.Transfer"
						        icon="fas fa-sync-alt"
						        @click.native="redo(hist)" />
						<Button v-tooltip="`View`" icon="fas fa-eye" @click.native="view(hist)" />
					</section>
				</section>








			</section>
			<br>
			<br>
			<br>
			<br>
		</section>


	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import {blockchainName, BlockchainsArray} from "@walletpack/core/models/Blockchains";
	import {HISTORY_TYPES} from "@walletpack/core/models/histories/History";
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import PluginRepository from '@walletpack/core/plugins/PluginRepository'
	import SymbolBall from "../reusable/SymbolBall";
	import * as Actions from '@walletpack/core/store/constants';


	export default {
		data(){return {
			terms:'',
			blockchainFilter:null,
			HISTORY_TYPES
		}},
		components: {SymbolBall},
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
				return this.history.filter(x => !this.terms.length ? true : (() => {
					return JSON.stringify(x).toLowerCase().indexOf(this.terms.toLowerCase()) > -1
				})());
			}
		},
		mounted(){

		},
		methods:{
			async redo(hist){
				if(hist.type === HISTORY_TYPES.Exchange){
					PopupService.push(Popups.exchange(hist.fromToken, () => {}, hist.toToken));
				}

				if(hist.type === HISTORY_TYPES.Transfer){
					const account = SingularAccounts.accounts([hist.token.network()])[0];
					if(!account) return PopupService.push(Popups.snackbar("Account for this token no longer in Scatter."));
					PopupService.push(Popups.transfer(account, hist.token, () => {}, hist.to, hist.amount, hist.memo))
				}
			},
			view(hist){
				const blockchain = (() => {
					if(hist.from) return hist.from.blockchain();
					if(typeof hist.account === 'string') return hist.account.slice(24, -1).split(':')[0];
					return hist.account.blockchain();
				})();
				const explorers = PluginRepository.defaultExplorers();
				const explorer = explorers[blockchain].parsed();
				this.openInBrowser(explorer.transaction(hist.txid));
			},
			clearHistory(){
				PopupService.push(Popups.confirmDeleteHistory(confirmed => {
					if(!confirmed) return;
					this[Actions.DELTA_HISTORY](null);
					this.$router.push({name:this.RouteNames.Wallet, query:{type:'assets'}});
				}))
			},
			getActionAccount(hist){
				return this.scatter.keychain.accounts.find(x => x.unique() === hist.account);
			},
			...mapActions([
				Actions.DELTA_HISTORY,
			])
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
					height:46px;
					border-radius:50%;
					margin-right:20px;
					display:flex;
					align-items: center;
					font-size: 24px;
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
