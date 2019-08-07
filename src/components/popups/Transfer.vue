<template>
	<section class="transfer">
		<section class="popup-content" v-if="token">

			<TransferHead :hide="showingContacts" :token="token"
			              title="How much do you <br>want to <span>send</span>?"
			              v-on:amount="x => token.amount = x"
			              :subtitle="forcedRecipient ? null : 'Where are you sending it?'" />

			<SearchBar v-on:terms="x => terms = x" style="margin-top:0px;" v-if="showingContacts" />

			<section class="select" v-if="!forcedRecipient">
				<section class="options" :class="{'wrapping':showingContacts}">

					<section class="options" key="Options" v-if="!showingContacts">
						<section key="Account" class="option" :class="{'selected':state === STATES.TEXT}" @click="state = STATES.TEXT">
							<SymbolBall :active="state === STATES.TEXT" symbol="fas fa-pencil-alt" />
							<figure class="text">Address</figure>
						</section>
						<section key="Contact" class="option" :class="{'selected':state === STATES.CONTACT}" @click="() => { if(contacts.length){ state = STATES.CONTACT; showingContacts = true; }}">
							<section v-if="!contact">
								<SymbolBall :active="state === STATES.CONTACT" symbol="fas fa-address-book" />
								<figure class="text" v-if="contacts.length">Contact</figure>
								<figure class="text" v-if="!contacts.length">No Contacts</figure>
							</section>
							<section v-else>
								<SymbolBall :active="true" :symbol="contact.img ? null : 'fas fa-address-book'" :img="contact.img" />
								<figure class="text">{{contact.name}}</figure>
							</section>
						</section>
						<section key="History" class="option" @click="scanQR">
							<SymbolBall symbol="fas fa-qrcode" />
							<figure class="text">QR</figure>
						</section>
					</section>

					<section v-if="showingContacts" :key="`contact_${i}`" class="option" @click="() => {showingContacts = false; contact = c}" v-for="(c,i) in contacts">
						<SymbolBall symbol="fas fa-address-book" />
						<figure class="text">
							{{c.name}}
							<div class="sub-text">{{c.recipient}}</div>
							<div class="sub-text">{{c.note}}</div>
						</figure>
					</section>

				</section>
			</section>

			<section v-if="!showingContacts">
				<section>
					<br>
					<br>
					<figure class="line"></figure>

					<transition name="hide-field">
						<section v-if="state === STATES.TEXT">
							<section style="padding-top:20px; display:flex; align-items: flex-end;">
								<Input :disabled="forcedRecipient" style="margin-bottom:0; flex:1;" placeholder="Account / Address" :text="recipient" v-on:changed="x => recipient = x" />
								<Button style="margin-left:10px;" text="Add Contact" @click.native="addContact" />
							</section>
						</section>
					</transition>

					<figure class="token-text smaller" style="margin-top:30px;">Want to add a memo?</figure>
					<Input :text="memo" v-on:changed="x => memo = x" style="margin-top:20px; margin-bottom:0;" :placeholder="`What are you sending ${token.symbol} for?`" />
				</section>
			</section>


		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" v-if="!showingContacts" secondary="1" text="Cancel" />
			<Button v-if="showingContacts" secondary="1" text="Back" @click.native="showingContacts = false" />



			<Button :loading="sending" primary="1" v-if="!showingContacts" text="Send" @click.native="send" />
		</section>


	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import Hasher from "@walletpack/core/util/Hasher";
	import SymbolBall from "../reusable/SymbolBall";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import TransferHead from "../reusable/TransferHead";
	import Popups from "../../util/Popups";
	import {mapState} from "vuex";
	import PopupService from "../../services/PopupService";
	import TransferService from "@walletpack/core/services/blockchain/TransferService";

	const STATES = {
		TEXT:'text',
		CONTACT:'contact',
	}

	export default {
		props:['popin', 'closer'],
		components: {TransferHead, SymbolBall},
		data(){return {
			STATES,
			state:STATES.TEXT,

			token:null,
			fiat:null,
			recipient:'',
			memo:'',

			selected:null,
			showingContacts:false,
			terms:'',
			asTokens:false,
			contact:false,

			forcedRecipient:false,

			sending:false,
		}},
		mounted(){
			if(this.popin.data.props.recipient){
				this.recipient = this.popin.data.props.recipient;
				this.forcedRecipient = true;
			}
			this.token = this.fromToken.clone();
			this.token.amount = null;
		},
		computed:{
			...mapState([
				'scatter',
			]),
			fromToken(){
				return this.popin.data.props.token;
			},
			contacts(){
				return this.scatter.contacts
			},
			canSend(){
				return !this.sending && this.recipient && this.recipient.length && this.token && this.token.amount > 0;
			},
			account(){
				return this.token.accounts(true)[0];
			}
		},
		methods:{
			addContact(){
				PopupService.push(Popups.addContact(this.recipient, this.fromToken.blockchain))
			},
			buyWithCard(){
				PopupService.push(Popups.buyTokens(this.token, this.token.amount))
			},
			scanQR(){
				PopupService.push(Popups.scanQR(data => {
					if(data) this.recipient = data;
				}, true))
			},


			async send(){
				const isSystemToken = this.token.network().systemToken().uniqueWithChain(false) === this.token.uniqueWithChain(false);
				if(isSystemToken && parseFloat(this.token.totalBalance().amount) < parseFloat(this.token.amount)){
					return this.buyWithCard();
				}

				const reset = () => this.sending = false;
				if(!this.canSend) return;
				this.sending = true;
				const sent = await TransferService[this.account.blockchain()]({
					account:this.account,
					recipient:this.recipient,
					amount:this.token.amount,
					memo:this.memo,
					token:this.token,
					promptForSignature:false,
				}).catch(() => false);

				this.sending = false;

				if(sent) setTimeout(() => {
					BalanceService.loadBalancesFor(this.account);
				}, 500);
			},
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