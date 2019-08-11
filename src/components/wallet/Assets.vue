<template>
	<section class="assets limiter panel-pad">
		<section class="action-bar">
			<section class="tab-info">
				<figure class="title">Your Assets</figure>
				<figure class="description">A comprehensive list of all of your assets</figure>
			</section>
			<section class="actions">
				<Button primary="1" text="Receive" />
			</section>
		</section>

		<SearchBar :options="filters"
		           v-on:terms="x => terms = x"
		           v-on:selected="x => blockchainFilter = x" />

		<section class="token-list">


			<section class="token" v-if="!hasEosAccount(eosMainnet)">
				<section class="left">
					<SymbolBall :token="eosMainnet.systemToken()" />
					<section class="basic-info">
						<figure class="name">EOS</figure>
						<figure class="price">You don't have an account for {{eosMainnet.name}} yet.</figure>
					</section>
				</section>
				<section class="right">
					<section class="actions">
						<Button text="Setup" @click.native="createEosAccount" />
					</section>
				</section>
			</section>


			<section class="token" v-for="token in tokens.slice(0, page*pageLength)">
				<section class="left">
					<SymbolBall :token="token" />
					<section class="basic-info">
						<figure class="name">{{token.symbol}}</figure>
						<figure class="price">{{currency}}{{formatNumber(token.fiatPrice(false))}}</figure>
					</section>
				</section>
				<section class="right">
					<section class="balance" v-if="token.fiatBalance(false)">{{currency}}{{formatNumber(token.fiatBalance(false))}}</section>
				</section>
				<section class="actions">
					<Button v-if="canBuy(token)" @click.native="buy(token)" :text="'Buy'" />
					<Button v-if="canConvert(token)" @click.native="exchange(token)" :text="'Convert'" />
					<Button primary="1" @click.native="transfer(token)" :text="'Send'" />
				</section>
			</section>
		</section>

		<section v-if="page*pageLength < tokens.length">
			<br>
			<br>
			<br>
			<section class="flex">
				<Button text="Show More" @click.native="page++" />
			</section>
		</section>

		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
	</section>
</template>

<script>
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import {mapState} from "vuex";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import Hasher from "@walletpack/core/util/Hasher";
	import {blockchainName, BlockchainsArray} from "@walletpack/core/models/Blockchains";
	import SymbolBall from "../reusable/SymbolBall";


	export default {
		components: {SymbolBall},
		data(){return {
			ready:false,


			terms:'',
			blockchainFilter:null,
			page:1,
			pageLength:10,

			filters:[{text:'All', value:null}].concat(BlockchainsArray.map(kv => {
				return {text:blockchainName(kv.value), value:kv.value};
			})),
			currency:PriceService.fiatSymbol(),


		}},
		computed:{
			...mapState([
				'scatter',
			]),
			tokens(){
				if(!this.ready) return [];

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

				return balances
					.filter(x => this.terms.length ?  x.symbol.toLowerCase().indexOf(this.terms) > -1 : true)
					.filter(x => this.blockchainFilter ? x.blockchain === this.blockchainFilter : true)
			},
			eosMainnet(){
				return this.scatter.settings.networks.find(x => x.blockchain === 'eos');
			}
		},
		mounted(){
			setTimeout(() => this.ready = true, 10);
		},
		methods:{
			createEosAccount(){
				const network = this.scatter.settings.networks.find(x => x.blockchain === 'eos');
				PopupService.push(Popups.createEosAccount(network))
			},
			hasEosAccount(network){
				return this.scatter.keychain.accounts.find(x => x.networkUnique === network.unique());
			},
			canConvert(token){
				if(!this.scatter.keychain.identities[0].kyc) return;
				if(token.network().systemToken().unique() === token.unique()) return true;
				return Math.round(Math.random() * 20 + 1) % 2 === 0;
			},
			exchange(token){
				PopupService.push(Popups.exchange(token));
			},
			transfer(token){
				const account = this.scatter.keychain.accounts.find(x => x.networkUnique === token.network());
				PopupService.push(Popups.transfer(account, token));
			},
			canBuy(token){
				if(!this.scatter.keychain.cards.length) return false;
				const network = this.scatter.settings.networks.find(x => x.blockchain === token.blockchain && x.chainId === token.chainId);
				return network.systemToken().unique() === token.unique();
			},
			buy(token){
				PopupService.push(Popups.buyTokens(token));
			}
		},

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.assets {

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

				&:hover,
				&:focus {
					.actions {
						opacity:1;
					}

					.balance {
						opacity:0;
					}
				}

				.basic-info {
					flex:1;
					padding-right:20px;
					margin-left:20px;

					.name {
						font-size: $font-size-large;
						font-weight: bold;
					}

					.price {
						font-size: $font-size-small;
						font-weight: bold;
						margin-top:3px;
						color:$grey;
					}
				}

				.left {
					flex:1;
					display:flex;
					align-items: center;
				}

				.actions {
					position:absolute;
					right:0;
					top:20px;
					opacity:0;
				}

				.balance {
					line-height:46px;
					display:flex;
					font-size: $font-size-medium;
					font-weight: bold;
				}

				.actions {
					display:flex;

					button {
						margin-left:5px;
					}
				}
			}
		}
	}

	.blue-steel {
		.assets {

			.token-list {
				.token {
					&:not(:last-child){
						border-bottom:1px solid $borderdark;
					}
				}
			}
		}
	}

	.mobile {
		.assets {

			.token-list {
				.token {
					border:0;
					margin-bottom:30px;
					padding:20px 20px 64px;
					border-radius:4px;
					box-shadow: $shadow-low;

					&:hover,
					&:focus {
						.balance {
							opacity:1;
						}
					}
				}

				.symbol-ball {
					display:inline-block;
				}

				.basic-info {
					display:inline-block;

					.price {
						font-size: $font-size-standard;
						font-weight:normal;
						color:$grey;
					}
				}

				.actions {
					opacity:1;
					top:86px;
					left:0;
					right:0;
					border-top:1px solid $lightblue;
					display:flex;
					flex-direction:row;
					justify-content:stretch;

					button {
						flex-grow:1;
						margin:0;
						border:0;
						border-radius:0;
					}
				}

				.balance {
					font-size: $font-size-large;
				}
			}
		}
	}

	.blue-steel {
		.assets {

			.token-list {

				.basic-info {

					.price {
						color:white;
						opacity:0.7;
					}
				}

				.balance {
					color:white;
				}
			}
		}
	}

	.mobile {
		&.blue-steel {
			.assets {
				.token-list {
					.token {
						box-shadow: 0 4px 10px $darkshadow;
					}
				}
			}
		}
	}

</style>