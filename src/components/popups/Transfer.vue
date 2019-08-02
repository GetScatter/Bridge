<template>
	<section class="transfer">
		<section class="popup-content" v-if="token">
			<TransferHead :hide="showingMore" :token="token" title="How much do you want to <span>send</span>?" v-on:amount="x => token.amount = x" />

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
					<section>
						<br>
						<br>
						<figure class="line"></figure>

						<transition name="hide-field">
							<section v-if="state === STATES.TEXT">
								<section style="padding-top:20px; display:flex; align-items: flex-end;">
									<Input style="margin-bottom:0; flex:1;" placeholder="Account / Address" />
									<Button style="margin-left:10px;" text="Add Contact" />
								</section>
							</section>
						</transition>

						<figure class="token-text smaller" style="margin-top:30px;">Want to add a memo?</figure>
						<Input style="margin-top:20px; margin-bottom:0;" :placeholder="`What are you sending ${token.symbol} for?`" />
					</section>
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
	import TransferHead from "../reusable/TransferHead";

	const STATES = {
		TEXT:'text',
		CONTACT:'contact',
		QR:'qr'
	}

	export default {
		props:['popin'],
		components: {TransferHead, SymbolBall},
		data(){return {
			STATES,
			state:STATES.TEXT,

			token:null,
			fiat:null,

			selected:null,
			showingMore:false,
			terms:'',
			asTokens:false,
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

		},
		watch:{
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

</style>