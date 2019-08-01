<template>
	<section class="transfer" @mouseup="holding = false" @touchend="holding = false">
		<section class="popup-content" v-if="token">
			<transition name="hide-for-select" mode="out-in">
				<section v-if="!showingMore">
					<figure class="title">How much do you want to <span>send</span>?</figure>
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
			</transition>


			<transition name="hide-field" mode="out-in">
				<SearchBar v-on:terms="x => terms = x" style="margin-top:-10px;" v-if="showingMore" />
			</transition>

			<section class="select">
				<transition-group :name="!showingMore ? 'token-list' : ''" mode="out-in" class="options" :class="{'wrapping':showingMore}">

					<section class="options" key="Options" v-if="!showingMore">
						<section key="Account" class="option" :class="{'selected':state === STATES.TEXT}" @click="state = STATES.TEXT">
							<SymbolBall :active="state === STATES.TEXT" symbol="fas fa-pencil-alt" />
							<figure class="text">Address</figure>
						</section>
						<section key="Contact" class="option" :class="{'selected':state === STATES.CONTACT}" @click="() => { state = STATES.CONTACT; showingMore = true;}">
							<section v-if="!contact">
								<SymbolBall :active="state === STATES.CONTACT" symbol="fas fa-address-book" />
								<figure class="text">Contact</figure>
							</section>
							<section v-else>
								<SymbolBall :active="true" img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" />
								<figure class="text">Contact Name</figure>
							</section>
						</section>
						<section key="History" class="option" :class="{'selected':state === STATES.QR}" @click="state = STATES.QR">
							<SymbolBall :active="state === STATES.QR" symbol="fas fa-qrcode" />
							<figure class="text">QR</figure>
						</section>
					</section>

					<section v-if="showingMore" :key="`contact_${i}`" class="option" @click="() => {showingMore = false; contact = true}" v-for="(c,i) in contacts"> <!--  :class="{'selected':selected && token.unique() === selected.unique()}" -->
						<SymbolBall />
						<figure class="text">
							Contact name
							<div class="sub-text">This is the note you left about this contact</div>
						</figure>
					</section>

				</transition-group>
			</section>

			<transition name="hide-for-select" mode="out-in">
				<section v-if="!showingMore">
					<br>
					<br>
					<figure class="line"></figure>

					<transition name="hide-field" mode="out-in">
						<section style="margin-top:20px; display:flex; align-items: flex-end;" v-if="state === STATES.TEXT">
							<Input style="margin-bottom:0; flex:1;" placeholder="Account / Address" />
							<Button style="margin-left:10px;" text="Add Contact" />
						</section>
					</transition>

					<figure class="token-text smaller" style="margin-top:30px;">Want to add a memo?</figure>
					<Input style="margin-top:20px; margin-bottom:0;" :placeholder="`What are you sending ${token.symbol} for?`" />
				</section>
			</transition>


		</section>

		<section class="popup-buttons">
			<Button secondary="1" text="Cancel" />
			<Button text="Send" />
		</section>


	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import Hasher from "@walletpack/core/util/Hasher";
	import SymbolBall from "../reusable/SymbolBall";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";

	const STATES = {
		TEXT:'text',
		CONTACT:'contact',
		QR:'qr'
	}

	let interval, timeout;

	export default {
		props:['popin'],
		components: {SymbolBall},
		data(){return {
			STATES,
			state:STATES.TEXT,

			token:null,

			fiat:null,
			selected:null,
			showingMore:false,
			terms:'',
			asTokens:false,
			holding:false,
			contact:false,
		}},
		mounted(){
			this.token = this.fromToken.clone();
			this.token.amount = null;
		},
		computed:{
			fromToken(){
				return this.popin.data.props.token;
			},
			contacts(){
				return [1,1,11,1,1,1,1,1,1]
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
				this.asTokens ? this.token.amount = parseFloat(this.token.amount)+delta : this.fiat = parseFloat(this.fiat)+delta
				if(this.fiat < 0) this.fiat = 0;
				if(this.token.amount < 0) this.token.amount = 0;
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
			['state'](){
				if(this.state !== STATES.CONTACT){
					this.contact = false;
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.hide-field-enter-active, .hide-field-leave-active {
		overflow:hidden;
		max-height:200px;
		transition:all 0.4s ease;
		transition-property: max-height, opacity;
	}
	.hide-field-enter, .hide-field-leave-to {
		max-height:0;
	}

</style>