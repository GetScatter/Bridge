<template>
	<section @mouseup="holding = false">
		<section v-if="!hide">
			<section>
				<figure class="title" v-html="title"></figure>
				<section class="amount">
					<Input :disabled="value" :text="asTokens ? amount : fiat " v-on:changed="x => asTokens ? amount = x : fiat = x" v-on:prefixed="asTokens = !asTokens" :prefix="asTokens ? token.symbol : '$'" placeholder="25" type="number" big="1" />
					<section class="buttons" v-if="!value">
						<Button secondary="1" @mousedown.native="subOne" icon="fas fa-chevron-down" />
						<Button secondary="1" @mousedown.native="addOne"  icon="fas fa-chevron-up" />
					</section>
				</section>
				<figure class="token-value" v-if="!asTokens">{{isNaN(amount) ? 0 : amount || 0}} {{token.symbol}}</figure>
				<figure class="token-value" v-if="asTokens">${{isNaN(fiat) ? 0 : fiat || 0}}</figure>

				<figure class="sub-title" v-if="subtitle">{{subtitle}}</figure>
			</section>
		</section>
	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import SymbolBall from "../reusable/SymbolBall";

	let interval, timeout;

	export default {
		props:['title', 'subtitle', 'token', 'hide', 'value'],
		components: {SymbolBall},
		data(){return {
			fiat:null,
			amount:null,

			asTokens:false,
			holding:false,
		}},
		mounted(){
			if(this.value) this.amount = this.value;
			else this.amount = this.token.amount;
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