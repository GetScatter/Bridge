<template>
	<section class="transfer-head" @mouseup="holding = false">
		<section v-if="!hide">
			<figure class="title" v-if="title" v-html="title"></figure>
			<section class="amount">
				<Input :disabled="value"
				       :text="asTokens ? amount : fiat "
				       v-on:changed="x => asTokens ? amount = x : fiat = x"
				       v-on:prefixed="tokensOnly ? null : asTokens = !asTokens" :prefix="isStableCoin ? currency : asTokens ? token.symbol : '$'"
				       placeholder="25" type="number" big="1" />

				<section class="buttons" v-if="!value">
					<Button @mousedown.native="subOne" icon="fas fa-minus" />
					<Button @mousedown.native="addOne"  icon="fas fa-plus" />
				</section>
			</section>
			<figure class="tokens-value" v-if="!tokensOnly && !asTokens">{{isNaN(amount) ? 0 : amount || 0}} {{token.symbol}}</figure>
			<figure class="tokens-value" v-if="(isStableCoin || isSystemToken) && (!tokensOnly && asTokens)">${{isNaN(fiat) ? 0 : fiat || 0}}</figure>

			<figure class="line"></figure>

			<figure class="sub-title" v-if="subtitle">{{subtitle}}</figure>
		</section>
	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import SymbolBall from "../reusable/SymbolBall";
	import BalanceHelpers from "../../services/utility/BalanceHelpers";
	import PriceService from "@walletpack/core/services/apis/PriceService";

	let interval, timeout;

	export default {
		props:['title', 'subtitle', 'token', 'hide', 'value', 'info', 'max'],
		components: {SymbolBall},
		data(){return {
			fiat:null,
			amount:null,

			asTokens:true,
			holding:false,

			tokensOnly:false,
		}},
		computed:{
			isStableCoin(){ return BalanceHelpers.isStableCoin(this.token) },
			isSystemToken(){ return BalanceHelpers.isSystemToken(this.token) },
			currency(){ return PriceService.fiatSymbol() },
		},
		mounted(){

			if(this.value) {
				this.amount = this.value;
				this.fiat = parseFloat(parseFloat(this.token.fiatPrice(false)) * parseFloat(this.amount)).toFixed(2);
			}
			else this.amount = this.token.amount;

			if(!this.token.fiatPrice(false)) {
				this.tokensOnly = true;
				this.asTokens = true;
			}
		},
		methods:{
			addOne(){
				this.holdButtons(1);
			},
			subOne(){
				this.holdButtons(-1);
			},
			holdButtons(delta){
				this.holding = true;
				clearInterval(interval);
				clearTimeout(timeout);
				this.deltaBalance(delta);
				timeout = setTimeout(() => {
					interval = setInterval(() => {
						if(!this.holding) return clearInterval(interval);
						this.deltaBalance(delta);
					}, 50);
				}, 300);
			},
			deltaBalance(delta){
				this.makeNumber();
				this.asTokens ? this.amount = parseFloat(this.amount)+delta : this.fiat = parseFloat(this.fiat)+delta
				if(this.fiat < 0) this.fiat = 0;
				if(this.amount < 0) this.amount = 0;
			},
			makeNumber(){
				if(!this.amount || isNaN(this.token.amount)) this.amount = 0;
				if(!this.fiat || isNaN(this.fiat)) this.fiat = 0;
			}
		},
		watch:{
			['fiat'](){
				if(this.asTokens) return;
				if(this.max && this.max < parseFloat(this.fiat)) this.fiat = this.max;
				this.amount = parseFloat(parseFloat(this.fiat) / this.token.fiatPrice(false)).toFixed(this.token.decimals);
				this.$emit('amount', this.amount)
			},
			['amount'](){
				if(!this.asTokens) return;
				this.fiat = parseFloat(parseFloat(this.token.fiatPrice(false)) * parseFloat(this.amount)).toFixed(2);
				this.$emit('amount', this.amount)
			},
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.transfer-head {
		.line {
			height:2px;
			background:$blue;
			margin:0 auto;
			width:100%;
		}
	}
</style>
