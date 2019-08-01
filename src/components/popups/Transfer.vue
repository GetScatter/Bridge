<template>
	<section class="transfer">
		<section class="popup-content">
			<transition name="hide-for-select" mode="out-in">
				<section v-if="!showingMore">
					<figure class="title">How much do you want to <span>send</span>?</figure>
					<section class="amount">
						<Input :text="amount" v-on:changed="x => amount = x || 0" prefix="$" placeholder="25" type="number" big="1" />
						<section class="buttons">
							<Button secondary="1" @click.native="amount-=1" icon="fas fa-chevron-down" />
							<Button secondary="1" @click.native="amount+=1"  icon="fas fa-chevron-up" />
						</section>
					</section>
					<figure class="token-text">Where are you sending it?</figure>
				</section>
			</transition>


			<transition name="hide-search" mode="out-in">
				<SearchBar v-on:terms="x => terms = x" style="margin-top:-10px;" v-if="showingMore" />
			</transition>

			<section class="select">
				<transition-group :name="!showingMore ? 'token-list' : ''" mode="out-in" class="options" :class="{'wrapping':showingMore}">

					<section key="Account" class="option" @click="state = STATES.TEXT">
						<SymbolBall :active="state === STATES.TEXT" symbol="fas fa-pencil-alt" />
						<figure class="text">Address</figure>
					</section>
					<section key="Contact" class="option" @click="state = STATES.CONTACT">
						<SymbolBall :active="state === STATES.CONTACT" symbol="fas fa-address-book" />
						<figure class="text">Contact</figure>
					</section>
					<section key="History" class="option" @click="state = STATES.QR">
						<SymbolBall :active="state === STATES.QR" symbol="fas fa-qrcode" />
						<figure class="text">QR</figure>
					</section>
				</transition-group>
			</section>
			<br>
			<br>
			<figure class="line"></figure>

			<section v-if="state === STATES.TEXT">
				<figure class="token-text smaller" style="margin-top:30px;">Enter the account or address</figure>
				<Input style="margin-top:20px; margin-bottom:0;" placeholder="Account / Address" />
			</section>

			<figure class="token-text smaller" style="margin-top:30px;">Want to add a memo?</figure>
			<Input style="margin-top:20px; margin-bottom:0;" placeholder="Memo / Note" />
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

	export default {
		props:['popin'],
		components: {SymbolBall},
		data(){return {
			STATES,
			state:STATES.TEXT,

			amount:0,
			selected:null,
			showingMore:false,
			terms:'',
		}},
		computed:{
			fromToken(){
				return this.popin.data.props.token;
			},
		},
		methods:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";


</style>