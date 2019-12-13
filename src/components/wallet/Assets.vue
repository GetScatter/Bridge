<template>
	<section class="assets">

		<section class="hero-panel">
			<figure class="corners"></figure>

			<section class="pie-chart">
				<canvas ref="pie" class="pie"></canvas>
				<section class="overlay">
					<figure class="balance">{{currency}}{{totalBalance}}</figure>
					<figure class="text">in {{tokens.length}} tokens</figure>
				</section>
			</section>
		</section>

		<slot></slot>

		<section class="limiter panel-pad">
			<section class="action-bar">
				<section class="tab-info">
					<figure class="title">Your Assets</figure>
					<figure class="description">A comprehensive list of all of your assets</figure>
				</section>
				<section class="actions">
					<Button icon="far fa-inbox-in" text="receive" />
				</section>
			</section>

			<SearchBar :options="filters"
			           v-on:terms="x => terms = x"
			           v-on:selected="x => blockchainFilter = x" />

			<section class="tokens-list">


				<section class="token" v-for="network in accountImportableNetworks" v-if="!hasImportedAccount(network)">
					<section class="left">
						<SymbolBall :token="network.systemToken()" />
						<section class="basic-info">
							<figure class="name">{{network.systemToken().symbol}}</figure>
							<figure class="price">You don't have an account for {{network.name}} yet.</figure>
						</section>
					</section>
					<section class="right">
						<section class="actions">
							<Button text="Setup" @click.native="createImportableAccount(network)" />
						</section>
					</section>
				</section>


				<section class="token" v-for="token in tokens.slice(0, page*pageLength)">
					<section class="left">
						<SymbolBall :token="token" />
						<section class="basic-info">
							<figure class="tokens-network" v-if="hasMoreThanOneNetwork(token)">{{token.network().name}}</figure>
							<figure class="contract" v-if="hasMoreThanOneContract(token)">{{token.contract}}</figure>
							<figure class="name">{{token.symbol}}</figure>
							<span class="can-buy" v-if="canBuy(token)"><i class="fal fa-shopping-cart"></i></span>
							<span class="can-buy" v-if="canConvert(token)"><i class="fal fa-exchange-alt"></i></span>
							<figure class="app-link" v-if="appLink(token)" @click="openApp(token)">
								<i class="fas fa-external-link-square"></i>
								Open {{appLink(token).name}}
							</figure>
						</section>
					</section>


					<section class="right" v-if="isSystemToken(token)">
						<section class="balance" v-if="token.fiatBalance(false)">{{currency}}{{formatNumber(token.fiatBalance(false))}}</section>
						<section class="balance" :class="{'alternate':token.fiatBalance(false)}">{{formatNumber(token.amount)}}</section>
					</section>
					<section class="right" v-else-if="isStableCoin(token)">
						<section class="balance stable">{{currency}}{{formatNumber(parseFloat(token.amount).toFixed(4))}}</section>
					</section>
					<section class="right" v-else>
						<section class="balance smaller">{{formatNumber(token.amount)}}</section>
					</section>


					<section class="actions">
						<Button v-if="canBuy(token)" @click.native="buy(token)" icon="far fa-shopping-cart" />
						<Button v-if="canConvert(token)" @click.native="exchange(token)" icon="fas fa-exchange-alt" />
						<!--<Button @click.native="receive(token)" :text="'Receive'" />-->
						<Button primary="1" @click.native="transfer(token)" icon="fas fa-paper-plane" text="Send" />
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


	</section>
</template>

<script>
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import {mapState} from "vuex";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import Hasher from "@walletpack/core/util/Hasher";
	import {blockchainName, BlockchainsArray, Blockchains} from "@walletpack/core/models/Blockchains";
	import SymbolBall from "../reusable/SymbolBall";
	import BalanceHelpers from "../../services/utility/BalanceHelpers";
	import Chart from 'chart.js';
	import PluginRepository from '@walletpack/core/plugins/PluginRepository';
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import AppsService from "@walletpack/core/services/apps/AppsService";


	let chartTimeout;

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

			chart:null,

		}},
		computed:{
			...mapState([
				'scatter',
				'balances',
				'dappData',
			]),
			systemTokens(){
				return this.tokens.filter(x => x.network().systemToken().unique() === x.unique()).filter(x => x.fiatBalance(false) > 0);
			},
			otherTokens(){
				return this.tokens.filter(x => x.network().systemToken().unique() !== x.unique());
			},
			totalBalance(){
				return this.fiatTotalFor(this.tokens)
			},
			tokens(){
				if(!this.ready) return [];

				let balances = BalanceService.totalBalances(true).totals;
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

				const trueBalance = x => this.isStableCoin(x) ? parseFloat(x.amount) : x.fiatBalance(false);
				balances = balances.sort((a,b) => {
					return trueBalance(b) - trueBalance(a);
				}).sort((a,b) => {
					const bySystem = this.isSystemToken(b) ? 1 : this.isSystemToken(a) ? -1 : 0;
					const byStableCoin = BalanceHelpers.isStableCoin(b) ? 1 : BalanceHelpers.isStableCoin(a) ? -1 : 0;
					return byStableCoin || bySystem;
				});

				return balances
					.filter(x => this.terms.length ?  x.symbol.toLowerCase().indexOf(this.terms) > -1 : true)
					.filter(x => this.blockchainFilter ? x.blockchain === this.blockchainFilter : true)
			},
			accountImportableNetworks(){
				return this.scatter.settings.networks.filter(x => PluginRepository.plugin(x.blockchain).accountsAreImported())
			},
			eosMainnet(){
				return this.scatter.settings.networks.find(x => PluginRepository.plugin('eos').isEndorsedNetwork(x));
			},
			reverseDappData(){
				return Object.keys(this.dappData).reduce((acc, applink) => {
					if(this.dappData[applink].token) acc[this.dappData[applink].token] = {
						url:this.dappData[applink].url,
						name:this.dappData[applink].name
					};
					return acc;
				}, {});
			}
		},
		beforeMount(){
			setTimeout(async () => {
				if(!Object.keys(this.dappData).length) {
					await AppsService.getApps()
				}
			}, 1);
		},
		mounted(){
			setTimeout(() => this.ready = true, 10);
			BalanceHelpers.loadBalances();

			this.loadChart();
		},
		methods:{
			isStableCoin:BalanceHelpers.isStableCoin,
			isSystemToken:BalanceHelpers.isSystemToken,
			appLink(token){
				return this.reverseDappData[token.uniqueWithChain()];
			},
			openApp(token){
				let app = Object.keys(this.dappData).find(applink => {
					if(!this.dappData[applink].token) return false;
					return this.dappData[applink].token === token.uniqueWithChain();
				});
				if(!app) return console.error('No app found for', token);
				PopupService.push(Popups.viewAppRatings(this.dappData[app]));
			},
			loadChart(){
				clearTimeout(chartTimeout);
				chartTimeout = setTimeout(() => {
					if(!this.$refs.pie) return;
					if(!this.chart){
						this.chart = new Chart(this.$refs.pie.getContext('2d'), {
							type: 'pie',
							options:{
								responsive:true,
								maintainAspectRatio: false,
								hover: {
									mode: null,
									animationDuration: 0
								},
								responsiveAnimationDuration: 0,
								legend:{
									display:false,
								},
								tooltips:{
									enabled:false,
								},
							},
							data: {
								datasets: [{
									backgroundColor: this.systemTokens.map(token => '#'+Hasher.unsaltedQuickHash(token.unique()).slice(0,6)).concat(['#efefef']),
									data: this.systemTokens.map(token => token.fiatBalance(false)).concat([this.fiatTotalFor(this.otherTokens)])
								}]
							}
						});
					} else {
						this.chart.data.datasets[0].backgroundColor = this.systemTokens.map(token => '#'+Hasher.unsaltedQuickHash(token.unique()).slice(0,6)).concat(['#efefef'])
						this.chart.data.datasets[0].data = this.systemTokens.map(token => token.fiatBalance(false)).concat([this.fiatTotalFor(this.otherTokens)]);
						this.chart.update();
					}
				}, 500);
			},
			fiatTotalFor(tokens){
				return tokens.reduce((acc,x) => {
					if(x.fiatBalance(false)) acc += parseFloat(x.fiatBalance(false));
					return acc;
				}, 0).toFixed(2)
			},
			hasMoreThanOneNetwork(token){
				return this.tokens.filter(x => x.symbol === token.symbol).length > 1;
			},
			hasMoreThanOneContract(token){
				return this.tokens.filter(x => x.symbol === token.symbol && token.network().unique() === x.network().unique()).length > 1;
			},
			createImportableAccount(network){
				// TODO: There is a problem here which if using a a network like TLOS that doesn't have a price
				// from our API, then buying with a CC doesn't show the price at all.
				PopupService.push(Popups.createEosAccount(network))
			},
			hasImportedAccount(network){
				if(!network) return console.error('bad token.network()', network);
				return this.scatter.keychain.accounts.find(x => x.networkUnique === network.unique());
			},
			canConvert(token){
				if(!token.network()) return console.error('bad token.network()', token);
				// return true;
				// if(!this.scatter.keychain.identities[0].kyc) return;
				// TODO: Need to check if the exchange supports each token.
				if(token.network().systemToken().unique() === token.unique()) return true;
				// return Math.round(Math.random() * 20 + 1) % 2 === 0;
				return false;
			},
			canBuy(token){
				// if(!this.scatter.keychain.cards.length) return false;
				const network = this.scatter.settings.networks.find(x => x.blockchain === token.blockchain && x.chainId === token.chainId);
				return this.isStableCoin(token) || (this.isSystemToken(token) && [
					PluginRepository.plugin(Blockchains.EOSIO).getEndorsedNetwork().chainId,
					PluginRepository.plugin(Blockchains.BTC).getEndorsedNetwork().chainId,
					PluginRepository.plugin(Blockchains.ETH).getEndorsedNetwork().chainId,
					PluginRepository.plugin(Blockchains.TRX).getEndorsedNetwork().chainId,
				].includes(token.chainId));
			},
			exchange(token){
				PopupService.push(Popups.exchange(token));
			},
			transfer(token){
				const account = SingularAccounts.accounts([token.network()])[0];
				PopupService.push(Popups.transfer(account, token));
			},
			receive(token){
				const account = SingularAccounts.accounts([token.network()])[0];
				PopupService.push(Popups.transfer(account, token));
			},
			buy(token){
				PopupService.push(Popups.buyTokens(token));
			}
		},
		watch:{
			['systemTokens'](){
				this.loadChart();
			}
		}

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.assets {

		.pie-chart {
			width:250px;
			height:250px;
			background:white;
			border-radius:50%;
			padding:12px;
			position: relative;
			margin-bottom:40px;
			box-shadow:0 0 20px rgba(0,0,0,0.15);

			.pie {
				width:100%;
				height:100%;
				box-shadow:0 0 10px rgba(0,0,0,0.15);
				border-radius:50%;
			}

			.overlay {
				background:#fff;
				position:absolute;
				top:0;
				bottom:0;
				left:0;
				right:0;
				border-radius:50%;
				margin:30px;
				display:flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;

				.balance {
					font-size: 22px;
					font-weight: bold;
					color:$dark;
				}

				.text {
					font-size: 11px;
					color:$grey;
				}
			}
		}

		.tokens-list {
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

					.app-link {
						display:inline-block;
						font-size: $font-size-small;
						font-weight: bold;
						padding:3px 5px;
						border-radius:4px;
						color:$grey;
						border:1px solid $grey;
						cursor: pointer;

						&:hover {
							color:$blue;
							border:1px solid $blue;
						}

						i {
							margin:0;
							padding:0;
						}
					}

					.can-buy {
						font-size: $font-size-small;
						font-weight: bold;
						margin-top:3px;
						color:$blue;
						margin-right:5px;
					}
				}

				.tokens-network {
					display:inline-block;
					font-size: $font-size-tiny;
					color:$grey;
					margin-right:5px;
				}

				.contract {
					display:inline-block;
					font-size: $font-size-tiny;
					color:$blue;

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
					font-size: $font-size-medium;
					font-weight: bold;
					text-align:right;

					&.alternate {
						font-size: $font-size-tiny;
						color:$grey;
					}

					&.stable {
						font-size: $font-size-large;
					}

					&.smaller {
						font-size: $font-size-standard;
					}
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

			.tokens-list {
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

			.tokens-list {
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

			.tokens-list {

				.basic-info {

					.price {
						color:white;
						opacity:0.7;
					}

					.can-buy {
						text-shadow:0 0 20px $blue;
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
				.tokens-list {
					.token {
						box-shadow: 0 4px 10px $darkshadow;
					}
				}
			}
		}
	}

</style>
