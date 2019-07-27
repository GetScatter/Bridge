<template>
	<section class="assets limiter panel-pad">
		<section class="action-bar">
			<section class="tab-info">
				<figure class="title">Your Assets</figure>
				<figure class="description">A comprehensive list of all of your assets</figure>
			</section>
			<section class="actions">
				<Button text="Receive" icon="fas fa-share" />
			</section>
		</section>

		<SearchBar :options="filters"
		           v-on:terms="x => terms = x"
		           v-on:selected="x => blockchainFilter = x" />

		<section class="token-list">


			<section class="token" v-if="!hasEosAccount(eosMainnet)">
				<figure class="icon"></figure>
				<section class="basic-info">
					<figure class="name">EOS</figure>
					<figure class="price">You don't have an account for {{eosMainnet.name}} yet.</figure>
				</section>
				<section class="actions static">
					<Button text="Setup" @click.native="createEosAccount" />
				</section>
			</section>


			<section class="token" v-for="token in tokens">
				<figure class="icon" :style="`background-color:${colorHex(token)}`"></figure>
				<section class="basic-info">
					<figure class="name">{{token.symbol}}</figure>
					<figure class="price">{{currency}}{{formatNumber(token.fiatPrice(false))}}</figure>
				</section>
				<section class="balance" v-if="token.fiatBalance(false)">{{currency}}{{formatNumber(token.fiatBalance(false))}}</section>
				<section class="actions">
					<Button icon="fas fa-exchange-alt" />
					<Button icon="fas fa-share" />

				</section>
			</section>
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
			tokens(){
				let balances = BalanceService.totalBalances().totals;
				balances = Object.keys(balances).map(key => balances[key]);

				balances = balances.reduce((acc,token) => {
					const existing = acc.find(x => x.uniqueWithChain(false) === token.uniqueWithChain(false));
					if(!existing){
						acc.push(token.clone());
					} else {
						existing.amount = parseFloat(parseFloat(existing.amount) + parseFloat(token.amount)).toFixed(existing.decimals);
					}
					return acc;
				}, []);

				balances = balances.sort((a,b) => {
					const byBalance = b.fiatBalance(false) - a.fiatBalance(false);
					const bySystem = b.network().systemToken().unique() === b.unique() ? 1 : a.network().systemToken().unique() === a.unique() ? -1 : 0;
					return bySystem || byBalance;
				});
				if(this.terms.length){
					balances = balances.filter(x => x.symbol.toLowerCase().indexOf(this.terms) > -1);
				}
				if(this.blockchainFilter){
					balances = balances.filter(x => x.blockchain === this.blockchainFilter);
				}
				return balances;
			},
			eosMainnet(){
				return this.scatter.settings.networks.find(x => x.blockchain === 'eos');
			}
		},
		methods:{
			createEosAccount(){
				const network = this.scatter.settings.networks.find(x => x.blockchain === 'eos');
				PopupService.push(Popups.createEosAccount(network, callback => {

				}))
			},
			hasEosAccount(network){
				return this.scatter.keychain.accounts.find(x => x.networkUnique === network.unique());
			},
			colorHex(token){
				return '#'+Hasher.unsaltedQuickHash(token.unique()).slice(0,6);
			}
		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.assets {
		.action-bar {
			padding-bottom:20px;
			border-bottom:1px solid $borderlight;
			overflow:hidden;
			display:flex;
			align-items: center;

			.tab-info {
				flex:1;
				display:block;

				.title {
					font-size: 24px;
					font-weight: bold;
				}

				.description {
					margin-top:5px;
					font-size: 13px;
					font-weight: bold;
					color:$grey;
				}
			}

			.actions {
				overflow:hidden;

				button {
					float:right;
					margin-left:10px;
				}
			}
		}

		.token-list {
			.token {
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

				.basic-info {
					flex:1;
					padding-right:20px;

					.name {
						font-size: 22px;
						font-weight: bold;
					}

					.price {
						font-size: 11px;
						font-weight: bold;
						margin-top:3px;
						color:$grey;
					}
				}

				.balance {
					flex:0 0 auto;
					height:44px;
					display:flex;
					align-items: center;
					right:0;
					position: absolute;
					font-size: 18px;
					font-weight: bold;
				}

				.actions {
					flex:0 0 auto;
					display:none;

					&.static {
						display:block;
					}

					button {
						display:inline-block;
						margin-left:5px;
					}
				}

				&:hover {
					.balance {
						display:none;
					}

					.actions {
						display:block;
					}
				}
			}
		}
	}

	.blue-steel {
		.assets {
			.action-bar {
				border-bottom: 1px solid $borderdark;
			}

			.token-list {
				.token {
					&:not(:last-child){
						border-bottom:1px solid $borderdark;
					}

					.icon {
						&:after {
							opacity:1;
							background:$dark;
						}
					}
				}
			}
		}
	}



</style>