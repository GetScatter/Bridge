<template>
	<section class="wallet">

		<section class="switcher">
			<figure class="type" @click="state = STATES.ASSETS" :class="{'active':state === STATES.ASSETS}">Assets</figure>
			<figure class="type" @click="state = STATES.ITEMS" :class="{'active':state === STATES.ITEMS}">Items</figure>
			<figure class="type" @click="state = STATES.CARDS" :class="{'active':state === STATES.CARDS}">Credit Card</figure>
			<figure class="type" @click="state = STATES.HISTORY" :class="{'active':state === STATES.HISTORY}">History</figure>
		</section>

		<br>


		<transition-group name="slide-route" mode="out-in">

			<section :key="STATES.ASSETS" class="panel-pad" v-if="state === STATES.ASSETS">
				<section class="action-bar">
					<section class="tab-info">
						<figure class="title">Your Assets</figure>
						<figure class="description">A comprehensive list of all of your assets</figure>
					</section>
					<section class="actions">
						<Button text="Receive" icon="fas fa-share" />
					</section>
				</section>

				<SearchBar :options="assetFilters"
				           v-on:terms="x => terms = x"
				           v-on:selected="x => blockchainFilter = x" />

				<section class="token-list">


					<section class="token" v-if="!hasEosAccount(eosMainnet)">
						<figure class="icon"></figure>
						<section class="basic-info">
							<figure class="name">EOS</figure>
							<figure class="price">You don't have an EOS account yet.</figure>
						</section>
						<section class="actions static">
							<Button text="Setup Account" @click.native="createEosAccount" />
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

		</transition-group>


	</section>
</template>

<script>
	import Token from "scatter-core/models/Token";
	import PopupService from "scatter-core/services/utility/PopupService";
	import Popups from "../util/Popups";
	import {mapState} from "vuex";
	import BalanceService from "scatter-core/services/blockchain/BalanceService";
	import PriceService from "scatter-core/services/apis/PriceService";
	import Hasher from "scatter-core/util/Hasher";
	import {blockchainName, BlockchainsArray} from "scatter-core/models/Blockchains";

	const STATES = {
		ASSETS:0,
		ITEMS:1,
		CARDS:2,
		HISTORY:3,
	};

	export default {
		data(){return {
			STATES,
			state:STATES.ASSETS,
			terms:'',
			blockchainFilter:null,
		}},
		computed:{
			...mapState([
				'scatter'
			]),
			assetFilters(){
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
	@import "../styles/variables";

	.switcher {
		margin-top:10px;
	}

	.wallet {
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
					box-shadow:inset 0 -10px 20px rgba(0,0,0,0.2), inset 0 10px 20px rgba(255,255,255,0.2);

					&:after {
						content:'';
						display:block;
						width:42px;
						height:42px;
						margin:2px 0 0 2px;
						border-radius:50%;
						background:$light;

						transition:all 1s ease;
						transition-property: background;
					}
				}

				.basic-info {
					flex:1;
					padding-right:10px;

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

				// $hovertransition:0s;
				.balance {
					flex:0 0 auto;
					height:44px;
					display:flex;
					align-items: center;
					right:0;
					position: absolute;
					font-size: 18px;
					font-weight: bold;
					opacity: 1;

					/*
					transition: all $hovertransition ease;
					transition-property: right, opacity;
					 */

				}

				.actions {
					flex:0 0 auto;
					right:-100px;
					position: absolute;
					opacity: 0;

					/*
					transition: all $hovertransition ease;
					transition-property: right, opacity;
					 */

					&.static {
						right:0;
						opacity:1;
					}

					button {
						display:inline-block;
						margin-left:5px;
					}
				}

				&:hover {
					.balance {
						right:-100px;
						opacity:0;
					}

					.actions {
						right:0;
						opacity:1;
					}
				}
			}
		}
	}

	.blue-steel {
		.wallet {
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
							background:$dark;
						}
					}
				}
			}
		}
	}



</style>

