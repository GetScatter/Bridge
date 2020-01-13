<template>
	<section class="transfer">
		<section class="popup-content" v-if="token">

			<TransferHead :hide="showingContacts" :token="token"
			              :title="`How much <span>${fromToken.symbol}</span> do you <br>want to <span>send</span>?`"
			              v-on:amount="x => token.amount = x" />

			<SearchBar v-on:terms="x => terms = x" style="margin-top:0px;" v-if="showingContacts" />

			<section class="select" v-if="(!forcedRecipient || contact) && contacts.length">
				<section class="options" :class="{'wrapping':showingContacts}">

					<section class="options" key="Options" v-if="!showingContacts">
						<section v-if="!forcedRecipient" key="Account" class="option" :class="{'selected':state === STATES.TEXT}" @click="state = STATES.TEXT">
							<SymbolBall :active="state === STATES.TEXT" symbol="fal fa-pencil-alt" />
							<figure class="text">Input Text</figure>
						</section>
						<section key="Contact" class="option" :class="{'selected':state === STATES.CONTACT}" @click="openContacts">
							<section v-if="!contact">
								<SymbolBall :active="state === STATES.CONTACT" symbol="fal fa-address-book" />
								<figure class="text" v-if="contacts.length">Select Contact</figure>
								<figure class="text" v-if="!contacts.length">No Contacts</figure>
							</section>
							<section v-else>
								<SymbolBall class="animate-spin-3d" :active="true" :symbol="contact ? 'fal fa-user' : 'fal fa-address-book'" :img="contact.img" />
								<figure class="text">{{contact.name.substr(0,12)}}<span v-if="contact.name.length > 12">...</span></figure>
							</section>
						</section>
					</section>

					<section v-if="showingContacts" :key="`contact_${i}`" class="option" @click="selectContact(c)" v-for="(c,i) in contacts">
						<SymbolBall symbol="fal fa-address-book" />
						<figure class="text">
							{{c.name}}
							<div class="sub-text">{{c.recipient}}</div>
							<div class="sub-text">{{c.note}}</div>
						</figure>
					</section>

				</section>
			</section>

			<section v-if="!showingContacts && (hasMemo || state === STATES.TEXT)">
				<section>
					<br>
					<br>
					<figure class="line"></figure>

					<transition name="hide-field">
						<section v-if="state === STATES.TEXT">
							<section style="padding-top:20px; display:flex; align-items: flex-end;">
								<Input :disabled="forcedRecipient" style="margin-bottom:0; flex:1;" placeholder="Account / Address" :text="recipient" v-on:changed="x => recipient = x" />
								<Button primary="1" style="margin-left:10px;" text="Add Contact" @click.native="addContact" />
							</section>
						</section>
					</transition>

					<figure v-if="hasMemo" class="tokens-text smaller" style="margin-top:30px;">Want to add a memo?</figure>
					<Input v-if="hasMemo" :text="memo" v-on:changed="x => memo = x" style="margin-top:20px; margin-bottom:0;" />
				</section>
			</section>


		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" v-if="!showingContacts" text="Cancel" />
			<Button v-if="showingContacts" text="Back" @click.native="selectContact(null)" />



			<Button :loading="sending" primary="1" v-if="!showingContacts" text="Send" icon="fal fa-paper-plane" @click.native="send" />
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
	import PopupService from "../../services/utility/PopupService";
	import TransferService from "@walletpack/core/services/blockchain/TransferService";
	import PluginRepository from "@walletpack/core/plugins/PluginRepository";
	import {Blockchains} from "@walletpack/core/models/Blockchains";
	import PasswordHelpers from "../../services/utility/PasswordHelpers";

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
					.filter(x => x.name.toLowerCase().indexOf(this.terms) > -1 || x.recipient.toLowerCase().indexOf(this.terms) > -1 || x.note.toLowerCase().indexOf(this.terms) > -1)
					.filter(x => x.blockchain === this.token.blockchain && x.chainId === this.token.chainId);
			},
			account(){
				return this.popin.data.props.account;
			},
			hasMemo(){
				return this.token.blockchain === Blockchains.EOSIO;
			}
		},
		methods:{
			selectContact(contact){
				this.showingContacts = false;
				if(contact) this.contact = contact;
				if(!this.contact) this.state = STATES.TEXT;
			},
			openContacts(){
				if(this.forcedRecipient) return;
				if(this.contacts.length){
					this.state = STATES.CONTACT;
					this.showingContacts = true;
				}
			},
			addContact(){
				if(!this.recipient.length) return PopupService.push(Popups.snackbar("You must enter an account name or address"))
				PopupService.push(Popups.addContact(this.recipient, this.fromToken.blockchain, this.fromToken.chainId))
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

				if(this.sending) return;

				const recipient = this.contact ? this.contact.recipient : this.recipient;

				if(!PluginRepository.plugin(this.fromToken.blockchain).isValidRecipient(recipient))
					return PopupService.push(Popups.snackbar(`The recipient you entered isn't a valid recipient for ${this.fromToken.symbol}`));

				if(this.token.amount <= 0)
					return PopupService.push(Popups.snackbar(`You must specify an amount to send`));

				if(!await PasswordHelpers.verifyPIN()) return reset();

				this.sending = true;
				const sent = await TransferService[this.account.blockchain()]({
					account:this.account,
					recipient,
					amount:this.token.amount,
					memo:this.memo,
					token:this.token,
					promptForSignature:false,
				}).catch(err => {
					PopupService.push(Popups.snackbar(`There was an issue sending: ${err}`));
					return false
				});

				reset();

				if(sent) {
					if(sent.hasOwnProperty('error')){
						PopupService.push(Popups.snackbar(sent.error, "attention-circled"));
					} else if (sent) {
						PopupService.push(Popups.transactionSuccess(this.account.blockchain(), TransferService.getTransferId(sent, this.account.blockchain())));
						this.closer(sent);
						setTimeout(() => {
							BalanceService.loadBalancesFor(this.account);
						}, 500);
					} else {
						PopupService.push(Popups.snackbar("An error occurred while trying to transfer these tokens.", "attention-circled"));
					}

				}
			},
		},
		watch:{
			['state'](){
				if(this.state !== STATES.CONTACT){
					this.contact = false;
				}
			},
			['recipient'](){
				this.recipient = this.recipient.trim();
				const contact = this.contacts.find(x => x.blockchain === this.token.blockchain && x.chainId === this.token.chainId && x.recipient === this.recipient)
				if(contact) {
					this.contact = contact;
					this.state = STATES.CONTACT;
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.transfer {
		.select {
			.options {
				justify-content: space-around;
			}
		}
	}

</style>
