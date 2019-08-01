<template>
	<section class="transfer">
		<section class="popup-content">
			<transition name="hide-for-select" mode="out-in">
				<section v-if="!showingMore">
					<figure class="title">How much <b>{{fromToken.symbol}}</b> do you want to <span>exchange</span> for <b>{{selected ? selected.symbol : ''}}</b>?</figure>
					<section class="amount">
						<Input :text="amount" v-on:changed="x => amount = x || 0" prefix="$" placeholder="25" type="number" big="1" />
						<section class="buttons">
							<Button secondary="1" @click.native="amount = parseFloat(amount)-1" icon="fas fa-chevron-down" />
							<Button secondary="1" @click.native="amount = parseFloat(amount)+1"  icon="fas fa-chevron-up" />
						</section>
					</section>
					<figure class="token-text">What would you like to convert to?</figure>
				</section>
			</transition>


			<transition name="hide-search" mode="out-in">
				<SearchBar v-on:terms="x => terms = x" style="margin-top:-10px;" v-if="showingMore" />
			</transition>

			<section class="select">
				<transition-group :name="!showingMore ? 'token-list' : ''" mode="out-in" class="options" :class="{'wrapping':showingMore}">
					<section :key="token.unique()" class="option" @click="selectToken(token)" v-for="token in tokens" :class="{'selected':selected && token.unique() === selected.unique()}">
						<SymbolBall :token="token" />
						<figure class="text">{{token.symbol}}</figure>
					</section>
					<section key="more-tokens" class="option">
						<section v-if="!showingMore" @click="showingMore = true">
							<SymbolBall symbol="fas fa-plus" />
							<figure class="text">{{allTokens.length - 2}} others</figure>
						</section>
					</section>
				</transition-group>
			</section>

			<transition name="hide-for-select" mode="out-in">
				<section v-if="!showingMore">
					<!--<figure class="token-text smaller">You will be getting</figure>-->
					<br>
					<figure class="line"></figure>
					<section class="receiving">
						<b>You will get</b>
						{{receiving}} {{selected ? selected.symbol : tokens[0].symbol}}
						<b>and pay $1.21 in fees</b>
					</section>
				</section>
			</transition>
		</section>

		<section class="popup-buttons">
			<Button secondary="1" text="Cancel" />
			<Button text="Exchange" />
		</section>


	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import Hasher from "@walletpack/core/util/Hasher";
	import SymbolBall from "../reusable/SymbolBall";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import {mapState} from "vuex";

	export default {
		props:['popin'],
		components: {SymbolBall},
		data(){return {
			amount:0,
			selected:null,
			showingMore:false,
			terms:'',
		}},
		computed:{
			...mapState([
				'isMobile'
			]),
			fromToken(){
				return this.popin.data.props.token;
			},
			allTokens(){
				let balances = BalanceService.totalBalances().totals;
				balances = Object.keys(balances).map(key => balances[key]);
				balances = balances.filter(x => x.unique() !== this.fromToken.unique());

				balances = balances.reduce((acc,token) => {
					const existing = acc.find(x => x.uniqueWithChain(false) === token.uniqueWithChain(false));
					if(!existing){
						acc.push(token.clone());
					} else {
						existing.amount = parseFloat(parseFloat(existing.amount) + parseFloat(token.amount)).toFixed(existing.decimals);
					}
					return acc;
				}, []);

				return balances;
			},
			tokens(){
				let balances = this.allTokens;
				balances = balances.filter(x => x.symbol.toLowerCase().indexOf(this.terms) > -1);
				balances = balances.sort((a,b) => {
					const isSystem = b.network().systemToken().unique() === b.unique() ? 1 : a.network().systemToken().unique() === a.unique() ? -1 : 0;
					const isSelected = this.selected && b.unique() === this.selected.unique() ? 1 : this.selected && a.unique() === this.selected.unique() ? -1 : 0;
					return isSelected || isSystem;
				});

				if(!this.showingMore){
					balances = balances.slice(0,2);
				}
				return balances;
			},
			receiving(){
				return this.amount * 14.3;
			}
		},
		mounted(){
			this.selected = this.tokens[0];
		},
		methods:{
			selectToken(token){
				this.selected = token;
				this.showingMore = false;
				this.terms = '';
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";



</style>