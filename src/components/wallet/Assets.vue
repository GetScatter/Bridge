<template>
	<section class="assets">

		<section class="hero-panel">
			<figure class="corners"></figure>

			<section class="pie-chart">
				<canvas ref="pie" class="pie"></canvas>
				<section class="overlay">
					<figure class="balance">{{currency}}{{totalBalance}}</figure>
					<figure class="text">in {{systemTokens.length + stableCoins.length}} tokens</figure>
				</section>
			</section>
		</section>

		<slot></slot>

		<section class="limiter panel-pad">
			<section class="action-bar">
				<section class="tab-info">
					<figure class="title">Welcome to your wallet</figure>
					<figure class="description">This list shows your funds and application-based tokens.</figure>
				</section>
				<section class="actions">
					<!--<Button icon="far fa-hand-holding-usd" @click.native="receive()" text="request" />-->
					<Button icon="far fa-inbox-in" @click.native="receive()" text="Receive" />
				</section>
			</section>

			<section class="flex">
				<SearchBar :options="filters"
				           v-on:terms="x => terms = x"
				           v-on:selected="x => blockchainFilter = x" />
				<!--<Button icon="fas fa-lock" style="flex:0 0 auto; height:34px; margin-top:20px;" :primary="showingUntouchables" @click.native="showingUntouchables = !showingUntouchables" />-->
			</section>

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
							<figure class="stable-tag" v-if="isStableCoin(token)">STABLE</figure>
							<figure class="tokens-network" v-if="hasMoreThanOneNetwork(token) && !isSystemToken(token)">{{token.network().name}}</figure>
							<figure class="contract" v-if="hasMoreThanOneContract(token)">{{token.contract}}</figure>
							<figure class="name">{{token.symbol}}</figure>
							<figure class="app-link" v-if="appLink(token)" @click="openApp(token)"><i class="fal fa-rocket"></i>{{appLink(token).name}}</figure>
							<span class="token-option" v-if="!isMobile && token.unusable"><i class="fas fa-lock"></i> Locked tokens</span>
							<span class="token-option" v-if="!isMobile && canStabilize(token)"><i class="fal fa-balance-scale"></i></span>
							<span class="token-option" v-if="!isMobile && canBuy(token)"><i class="fal fa-shopping-cart"></i></span>
							<span class="token-option" v-if="!isMobile && canExchange(token)"><i class="fal fa-exchange-alt"></i></span>
						</section>
					</section>


					<section class="right" v-if="isSystemToken(token)">
						<section class="balance" v-if="token.fiatBalance(false)">{{currency}}{{formatNumber(token.fiatBalance(false))}}</section>
						<section class="balance" :class="{'alternate':token.fiatBalance(false)}">{{formatNumber(token.amount)}} {{token.symbol}}</section>
					</section>
					<section class="right" v-else-if="isStableCoin(token)">
						<section class="balance stable">{{currency}}{{formatNumber(parseFloat(token.amount).toFixed(4))}}</section>
					</section>
					<section class="right" v-else>
						<section class="balance smaller">{{formatNumber(token.amount)}}</section>
					</section>


					<section class="actions" v-if="!token.unusable">
						<Button v-if="canBuy(token)" @click.native="buy(token)" icon="fal fa-shopping-cart" />
						<Button v-if="canExchange(token)" @click.native="exchange(token)" icon="fal fa-exchange-alt" />
						<Button v-if="canStabilize(token)" @click.native="stabilize(token)" icon="fal fa-balance-scale" />
						<!--<Button v-if="isSystemToken(token) && lockableChains[token.network().unique()]" @click.native="lockToken(token)" icon="fal fa-lock" />-->
						<Button @click.native="receive(token)" icon="fal fa-inbox-in" />
						<Button primary="1" @click.native="transfer(token)" icon="fal fa-paper-plane" text="Send" />
					</section>

					<section class="actions" v-if="token.unusable">
						<Button primary="1" @click.native="unlockToken(token)" icon="far fa-lock-open" text="Unlock" />
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
	import {mapActions, mapState} from "vuex";
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
	import * as UIActions from '../../store/ui_actions';
	import Stabilizer from "../../services/special/Stabilizer";
	import * as BackendApiService from '@walletpack/core/services/apis/BackendApiService';
	import Token from '@walletpack/core/models/Token';


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
			showingUntouchables:false,
			lockableChains:{},
		}},
		computed:{
			...mapState([
				'scatter',
				'balances',
				'dappData',
				'currencies',
				'untouchables',
				'exchangeables',
			]),
			stableCoins(){
				return this.tokens.filter(x => x.amount > 0 && this.isStableCoin(x));
			},
			systemTokens(){
				return this.tokens.filter(x => x.network().systemToken().unique() === x.unique()).filter(x => x.fiatBalance(false) > 0);
			},
			otherTokens(){
				return this.tokens.filter(x => x.network().systemToken().unique() !== x.unique());
			},
			totalBalance(){
				const stableValue = this.stableCoins.reduce((acc, x) => {
					return acc + (x.amount * this.currencies[this.scatter.settings.displayCurrency]);
				}, 0);
				return parseFloat(parseFloat(BalanceHelpers.fiatTotalFor(this.systemTokens)) + parseFloat(stableValue)).toFixed(2);
			},
			tokens(){
				if(!this.ready) return [];

				if(this.showingUntouchables) return this.untouchables;

				return BalanceHelpers.tokens()
					.filter(x => this.terms.length ?  x.symbol.toLowerCase().indexOf(this.terms) > -1 : true)
					.filter(x => this.blockchainFilter ? x.blockchain === this.blockchainFilter : true)
			},
			accountImportableNetworks(){
				// Hardcoding to EOS Mainnet for now.
				return this.scatter.settings.networks.filter(x => PluginRepository.plugin(x.blockchain).accountsAreImported() && x.chainId.indexOf('aca') === 0)
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
				// this.scatter.settings.networks.map(network => {
				// 	if(network.blockchain === 'eos'){
				// 		this.lockableChains[network.unique()] = true;
				// 	}
				// 	// this.lockableChains[network.unique()] = PluginRepository.plugin(network.blockchain).hasAccountActions();
				// })
				//
				// if(!this.untouchables.length){
				// 	let untouchables = [];
				// 	await Promise.all(SingularAccounts.accounts().map(async account => {
				// 		(await BalanceService.loadUntouchables(account)).map(x => untouchables.push(x));
				// 		return true;
				// 	}));
				// 	this[UIActions.SET_UNTOUCHABLES](untouchables)
				// }

				if(!Object.keys(this.dappData).length) {
					await AppsService.getApps()
				}

				if(!this.exchangeables.length) {
					BackendApiService.GET(`exchange/available`).then(uniques => {
						this[UIActions.SET_EXCHANGEABLES](uniques.map(unique => Token.fromUnique(unique)));
					})
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
			canBuy:BalanceHelpers.canBuy,
			canStabilize:Stabilizer.canStabilize,
			canExchange(token){
				return this.exchangeables.find(x => x.uniqueWithChain() === token.uniqueWithChain())
			},
			stabilize(token){
				const clone = token.clone();
				clone.amount = 0;
				PopupService.push(Popups.stabilize(clone, done => {

				}));
			},
			unlockToken(token){

			},
			lockToken(token){

			},
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
									data: this.systemTokens.map(token => token.fiatBalance(false)).concat([BalanceHelpers.fiatTotalFor(this.otherTokens)])
								}]
							}
						});
					} else {
						this.chart.data.datasets[0].backgroundColor = this.systemTokens.map(token => '#'+Hasher.unsaltedQuickHash(token.unique()).slice(0,6)).concat(['#efefef'])
						this.chart.data.datasets[0].data = this.systemTokens.map(token => token.fiatBalance(false)).concat([BalanceHelpers.fiatTotalFor(this.otherTokens)]);
						this.chart.update();
					}
				}, 500);
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
			exchange(token){
				PopupService.push(Popups.exchange(token));
			},
			transfer(token){
				const account = SingularAccounts.accounts([token.network()])[0];
				PopupService.push(Popups.transfer(account, token));
			},
			receive(token = null){
				// const account = SingularAccounts.accounts([token.network()])[0];
				// PopupService.push(Popups.transfer(account, token));

				PopupService.push(Popups.receive(token));
			},
			buy(token){
				const clone = token.clone();
				clone.amount = 0;
				PopupService.push(Popups.buyTokens(clone));
			},
			...mapActions([
				UIActions.SET_UNTOUCHABLES,
				UIActions.SET_EXCHANGEABLES,
			])
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
				position: relative;

				&:not(:last-child){
					border-bottom:1px solid $borderlight;
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
						font-size: $font-size-tiny;
						font-weight: bold;
						padding:3px 5px;
						border-radius:4px;
						color:$grey;
						border:1px solid $grey;
						cursor: pointer;
						margin-right:10px;

						&:hover {
							color:$blue;
							border:1px solid $blue;
						}

						i {
							margin:0 5px 0 0;
							padding:0;
						}
					}

					.token-option {
						font-size: $font-size-tiny;
						font-weight: bold;
						margin-top:3px;
						color:$blue;
						margin-right:5px;

						&.grey {
							color:$grey;
						}
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
					margin-right:5px;
				}

				.stable-tag {
					display:inline-block;
					font-size: 9px;
					color:white;
					background:$blue;
					padding:2px 4px;
					border-radius:4px;
					margin-right:5px;
				}

				.left {
					flex:1;
					display:flex;
					align-items: center;
				}

				.actions {
					position:absolute;
					opacity:0;
					display:flex;
					align-items: center;
					height:100%;
					top:0;
					bottom:0;
					right:0;
					transform:translateX(50px);

					button {
						margin-left:5px;
					}
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

				.actions, .balance {
					transition:all 0.8s ease;
					transition-property: opacity, transform;
				}

				&:hover,
				&:focus {
					.actions {
						opacity:1;
						transform:translateX(0px);
						transition:all 0.2s ease;
					}

					.balance {
						opacity:0;
						transform:translateX(-100px);
						transition:all 0.1s ease;
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
					align-items: flex-end;
					left:0;
					right:0;
					border-top:1px solid $lightblue;
					display:flex;
					flex-direction:row;
					justify-content:stretch;
					transform:translateX(0px);

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

					.token-option {
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
