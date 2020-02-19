<template>
	<section class="transfer">
		<section class="popup-content" v-if="token && !success">

			<TransferHead :hide="showingMore"
			              :token="token"
			              v-on:amount="x => token.amount = x"
			              :title="`How much <span>${fromToken.symbol}</span> do you want to <span>convert</span> to <span>${convertedToken ? convertedToken.symbol : '...'}</span>?`" />


			<SearchBar v-on:terms="x => terms = x" style="margin-top:-10px;" v-if="showingMore" />

			<section class="loading-pairs" v-if="loadingPairs">
				<i class="animate-spin fas fa-spinner"></i>
			</section>

			<section class="convert" v-if="!loadingPairs">
				<section class="selector">
					<transition-group name="hide-for-select" class="options" :class="{'wrapping':showingMore}">
						<section :key="token.unique()" class="option" @click="selectToken(token)" v-for="token in tokens" :class="{'selected':convertedToken && token.unique() === convertedToken.unique()}">
							<SymbolBall :token="token" />
							<figure class="text">{{token.symbol}}</figure>
						</section>
						<section key="more-tokens" class="option">
							<section v-if="!showingMore" @click="showingMore = true">
								<SymbolBall symbol="fas fa-plus" />
								<figure class="text">{{pairs.length - 2}} others</figure>
							</section>
						</section>
					</transition-group>
				</section>
			</section>

			<section class="recipient" v-if="!showingMore && !loadingPairs">
				<figure class="line"></figure>
				<br>
				<figure class="no-self" v-if="convertedToken && !availableSelfAccount">You do not have an account that can hold {{convertedToken.symbol}}</figure>
				<figure class="to-self" v-if="convertedToken && availableSelfAccount && availableSelfAccount.sendable() === recipient">You are sending the converted {{convertedToken.symbol}} to yourself</figure>
				<figure class="no-self" v-if="convertedToken && availableSelfAccount && availableSelfAccount.sendable() !== recipient">You are sending the converted {{convertedToken.symbol}} to someone else</figure>
				<section class="flex">
					<Input style="margin-bottom:0; flex:1;" placeholder="Where to send the converted tokens?" :text="recipient" v-on:changed="x => recipient = x" />
					<Button :primary="availableSelfAccount.sendable() === recipient"
					        :disabled="availableSelfAccount.sendable() === recipient"
					        v-if="availableSelfAccount"
					        style="margin-left:5px; flex:0 0 auto;"
					        :icon="availableSelfAccount.sendable() === recipient ? 'fal fa-user-check' : 'fal fa-user'"
					        v-tooltip="`Send to yourself`"
					        @click.native="sendToSelf" />
				</section>
			</section>

			<section v-if="!showingMore && convertedToken">
				<section class="receiving" v-if="!loadingRate">
					You will get <b>{{formatNumber(receiving)}} {{convertedToken.symbol}}</b>
				</section>
				<section class="receiving" v-if="loadingRate">
					Please wait while we load conversion rates
				</section>
			</section>
		</section>

		<section class="popup-content" v-if="success">
			<figure class="title">Conversion <span>Successful</span>!</figure>
			<figure class="sub-title">
				Everything looks good and your order has been sent off for processing.
				You'll get a notification when your shiny tokens arrive.
			</figure>
		</section>

		<section class="popup-buttons" v-if="!success">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button :loading="sending" primary="1" text="Convert" @click.native="exchange" icon="fas fa-exchange-alt" />
		</section>

		<section class="popup-buttons" v-if="success">
			<Button @click.native="() => closer(true)" text="Close" primary="1" />
		</section>


	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import Hasher from "@walletpack/core/util/Hasher";
	import SymbolBall from "../reusable/SymbolBall";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import {mapActions, mapState} from "vuex";
	import TransferHead from "../reusable/TransferHead";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import ExchangeService from "@walletpack/core/services/apis/ExchangeService";
	import * as Actions from "@walletpack/core/store/constants";
	import HistoricExchange from "@walletpack/core/models/histories/HistoricExchange";
	import TokenService from "@walletpack/core/services/utility/TokenService";
	import TransferService from "@walletpack/core/services/blockchain/TransferService";
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";
	import BalanceHelpers from "../../services/utility/BalanceHelpers";
	import Token from "@walletpack/core/models/Token";
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import PluginRepository from '@walletpack/core/plugins/PluginRepository'

	export default {
		props:['popin', 'closer'],
		components: {TransferHead, SymbolBall},
		data(){return {
			convertedToken:null,
			showingMore:false,
			terms:'',

			token:null,
			rate:null,
			loadingPairs:false,
			loadingRate:false,
			sending:false,

			rawPairs:[],
			pairs:[],

			success:false,

			recipient:'',
		}},
		computed:{
			...mapState([
				'isMobile'
			]),
			fromToken(){
				return this.popin.data.props.token;
			},
			toToken(){
				return this.popin.data.props.toToken;
			},
			tokens(){
				let balances = this.pairs;
				balances = balances.map(x => Token.fromJson(x));
				balances = balances.filter(x => x.symbol.toLowerCase().indexOf(this.terms) > -1);
				balances = balances.sort((a,b) => {
					const bySystem = BalanceHelpers.isSystemToken(b) ? 1 : BalanceHelpers.isSystemToken(a) ? -1 : 0;
					const byStableCoin = BalanceHelpers.isStableCoin(b) ? 1 : BalanceHelpers.isStableCoin(a) ? -1 : 0;
					return byStableCoin || bySystem;
				});
				balances = balances.sort((a,b) => {
					return this.convertedToken && b.unique() === this.convertedToken.unique()
						? 1
						: this.convertedToken && a.unique() === this.convertedToken.unique()
							? -1 : 0;
				});

				if(!this.showingMore) balances = balances.slice(0,2);

				return balances;
			},
			receiving(){
				if(!this.rate) return 0;
				if(!this.convertedToken) return 0;
				return parseFloat(this.rate.rate * this.token.amount).toFixed(this.convertedToken.decimals);
			},
			rawPair(){
				if(!this.convertedToken) return;
				return this.rawPairs.find(x => x.token.id === this.convertedToken.id);
			},
			withinMinMax(){
				return  (this.rate.min === null || this.rate.min <= this.receiving) &&
						(this.rate.max === null || this.rate.max >= this.receiving)
			},
			availableSelfAccount(){
				if(!this.convertedToken) return null;
				const network = this.convertedToken.network();
				if(!network) return null;
				return SingularAccounts.accounts([network])[0];
			}
		},
		created(){
			(async () => {
				PriceService.setPrices();

				this.token = this.fromToken.clone();
				this.token.amount = null;
				await this.getPairs();

				this.selectToken(this.tokens[0]);
			})();
		},
		methods:{
			sendToSelf(){
				this.recipient = this.availableSelfAccount.sendable();
			},
			selectToken(token){
				this.convertedToken = token;

				if(token && this.availableSelfAccount) this.sendToSelf();
				else this.recipient = '';

				this.showingMore = false;
				this.terms = '';
				this.getRate();
			},


			async getPairs(){
				this.convertedToken = null;
				this.pairs = [];
				this.loadingPairs = true;
				let pairs = await ExchangeService.pairs(this.token);
				let {base, stable} = pairs;

				// if(!base && !stable) return null;

				const tokensFor = x => x ? x.map(y => y.token) : [];

				this.pairs = tokensFor(base)
					.concat(tokensFor(stable))

				Object.keys(pairs).map(key => {
					if(key !== 'base' && key !== 'stable'){
						this.pairs = this.pairs.concat(tokensFor(pairs[key]));
					}
				})

				this.rawPairs = Object.keys(pairs).reduce((acc,key) => {
					acc = acc.concat(pairs[key]);
					return acc;
				}, []);


				this.loadingPairs = false;

				if(this.toToken){
					this.selectToken(this.pairs.find(x => x.unique() === this.toToken.unique()));
				}
			},
			async getRate(){
				this.loadingRate = true;
				this.rate = null;
				this.rate = await ExchangeService.rate(this.token, this.rawPair.symbol, this.rawPair.service);
				this.loadingRate = false;
			},


			async exchange(){
				if(this.sending) return;

				const cancel = msg => {
					this.sending = false;
					return PopupService.push(Popups.snackbar(msg));
				}


				if(!this.convertedToken) return cancel("You must select a token to convert to first");
				if(this.token.amount <= 0) return cancel(`The amount to convert must be over 0 ${this.token.symbol}`);

				const account = SingularAccounts.accounts([this.token.network()])[0];
				if(!account) return cancel(`There was an error getting the account that holds this ${this.token.symbol}.`);

				if(!this.recipient) return cancel(`You must specify an account/address that can hold ${this.convertedToken.symbol}.`);
				if(!PluginRepository.plugin(this.convertedToken.blockchain).isValidRecipient(this.recipient))
					return PopupService.push(Popups.snackbar(`The recipient you entered isn't a valid recipient for ${this.convertedToken.symbol}`));

				if(!this.withinMinMax) return cancel(`The minimum for this conversion is ${this.rate.min} ${this.convertedToken.symbol} and the max is ${this.rate.max} ${this.convertedToken.symbol}`);

				this.sending = true;


				const from = { account:account.sendable() };
				const to = { account:this.recipient };
				const amount = this.token.amount;
				const order = await ExchangeService.order(this.rawPair.service, this.token, this.convertedToken.symbol, amount, from, to);


				if(!order) return cancel('There was an issue connecting to the Scatter API');

				ExchangeService.accepted(order.id);
				const sent = await TransferService[account.blockchain()]({
					account:account,
					recipient:order.account,
					amount,
					memo:order.memo,
					token:this.token,
					promptForSignature:false,
					bypassHistory:true,
				}).catch(err => {
					PopupService.push(Popups.snackbar(`There was an error converting: ${err}`))
					return false
				});

				if(sent && !sent.hasOwnProperty('error')){
					this.success = true;

					if(!TokenService.hasToken(this.rawPair.token)){
						if(!!this.rawPair.token.contract && !!this.rawPair.token.contract.length) {
							await TokenService.addToken(this.rawPair.token, false, false);
						}
					}

					const tokenClone = this.token.clone();
					tokenClone.amount = amount;
					const convertedClone = this.convertedToken.clone();
					convertedClone.amount = this.receiving;

					const history = new HistoricExchange(account, this.recipient, tokenClone, convertedClone, order, TransferService.getTransferId(sent, this.token.blockchain));
					this[Actions.DELTA_HISTORY](history);
					setTimeout(() => {
						ExchangeService.watch(history);
						BalanceService.loadBalancesFor(account);
					}, 1000);
				}

				if(sent && sent.hasOwnProperty('error')){
					PopupService.push(Popups.snackbar(sent.error));
				}

				this.sending = false;
			},


			...mapActions([
				Actions.DELTA_HISTORY
			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.no-self {
		display:block;
		margin-bottom:5px;
		color:$red;
		font-size: $font-size-tiny;
	}

	.to-self {
		display:block;
		margin-bottom:5px;
		color:$blue;
		font-size: $font-size-tiny;
	}

	.recipient {
		margin-top:20px;
		text-align:left;

		label {
			margin-bottom:5px;
			display:block;
		}
	}

	.convert {
		margin-top:20px;
		text-align:left;

		label {
			margin-bottom:5px;
			display:block;
		}
	}

	.loading-pairs {
		height:67px;
		font-size: 36px;
		display:flex;
		justify-content: center;
		align-items: center;
		color:$grey;
	}

</style>
