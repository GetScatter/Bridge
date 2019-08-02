<template>
	<section @mouseup="holding = false">
		<transition name="hide-for-select" mode="out-in">
			<section v-if="!hide">
				<section>
					<figure class="title" v-html="title"></figure>
					<section class="amount">
						<Input :text="asTokens ? token.amount : fiat " v-on:changed="x => asTokens ? token.amount = x : fiat = x" v-on:prefixed="asTokens = !asTokens" :prefix="asTokens ? token.symbol : '$'" placeholder="25" type="number" big="1" />
						<section class="buttons">
							<Button secondary="1" @mousedown.native="subOne" icon="fas fa-chevron-down" />
							<Button secondary="1" @mousedown.native="addOne"  icon="fas fa-chevron-up" />
						</section>
					</section>
					<figure class="token-value" v-if="!asTokens">{{isNaN(token.amount) ? 0 : token.amount || 0}} {{token.symbol}}</figure>
					<figure class="token-value" v-if="asTokens">${{isNaN(fiat) ? 0 : fiat || 0}}</figure>

					<figure class="token-text">Where are you sending it?</figure>
				</section>
			</section>
		</transition>
	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import SymbolBall from "../reusable/SymbolBall";

	let interval, timeout;

	export default {
		props:['title', 'token', 'hide'],
		components: {SymbolBall},
		data(){return {
			fiat:null,

			asTokens:false,
			holding:false,
		}},
		mounted(){

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
				this.asTokens ? this.token.amount = parseFloat(this.token.amount)+delta : this.fiat = parseFloat(this.fiat)+delta
				if(this.fiat < 0) this.fiat = 0;
				if(this.token.amount < 0) this.token.amount = 0;

				this.$emit('amount', {amount:this.token.amount})
			},
			makeNumber(){
				if(!this.token.amount || isNaN(this.token.amount)) this.token.amount = 0;
				if(!this.fiat || isNaN(this.fiat)) this.fiat = 0;
			}
		},
		watch:{
			['fiat'](){
				if(this.asTokens) return;
				this.token.amount = parseFloat(this.token.fiatPrice(false) * parseFloat(this.fiat)).toFixed(this.token.decimals);
			},
			['token.amount'](){
				if(!this.asTokens) return;
				this.fiat = parseFloat(parseFloat(this.token.fiatPrice(false)) * parseFloat(this.token.amount)).toFixed(2);
			},
		}
	}
</script>