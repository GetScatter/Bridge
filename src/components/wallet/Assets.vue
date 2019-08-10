<template>
	<section class="assets limiter panel-pad">
		<section class="action-bar">
			<section class="tab-info">
				<figure class="title">Your Assets</figure>
				<figure class="description">A comprehensive list of all of your assets</figure>
			</section>
			<section class="actions">
				<Button primary="1" text="Receive" icon="fas fa-share" />
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
					<section class="actions">
						<Button secondary="1" v-if="canBuy(token)" @click.native="buy(token)" :text="'Buy'" />
						<Button secondary="1" v-if="canConvert(token)" @click.native="exchange(token)" :text="'Convert'" />
						<Button @click.native="transfer(token)" :text="'Send'" />
					</section>
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



				.basic-info {
					flex:1;
					padding-right:20px;
					margin-left:20px;

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

				.left {
					flex:1;
					display:flex;
					align-items: center;
				}

				.right {
					flex:0 0 auto;
					display:flex;
					flex-direction: column;
					justify-content: flex-end;
					align-items: flex-end;

				}

				.balance {
					height:44px;
					display:flex;
					font-size: 18px;
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
					padding:50px 0;
					display:block;
				}

				.symbol-ball {
					display:inline-block;

					width:80px;
					height:80px;
				}

				.basic-info {
					display:inline-block;

					.name {
						font-size: 48px;
						margin-bottom:-10px;
					}

					.price {
						font-size: 16px;
					}
				}

				.left {
					margin-bottom:50px;
				}

				.right {
					margin-top:-30px;
				}

				.balance {
					margin-top:20px;
					font-size: 36px;
					margin-bottom:10px;
				}
			}
		}
	}



</style>