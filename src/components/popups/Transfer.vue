<template>
	<section class="transfer">
		<section class="popup-content" v-if="token">

			<TransferHead :token="token"
			              :title="`How much <span>${fromToken.symbol}</span> do you <br>want to <span>send</span>?`"
			              v-on:amount="x => token.amount = x" />

			<section v-if="(hasMemo || state === STATES.TEXT)">
				<section>

					<transition name="hide-field">
						<section v-if="state === STATES.TEXT">
							<RecipientField :recipient="recipient" :forced="forcedRecipient" :token="token" v-on:recipient="x => recipient = x" />
						</section>
					</transition>

					<figure v-if="hasMemo" class="tokens-text smaller" style="margin-top:30px;">Want to add a memo?</figure>
					<Input v-if="hasMemo" :text="memo" v-on:changed="x => memo = x" style="margin-top:20px; margin-bottom:0;" />
				</section>
			</section>


		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />



			<Button :loading="sending" primary="1" text="Send" icon="fal fa-paper-plane" @click.native="send" />
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
	import RecipientField from '../reusable/RecipientField';

	const STATES = {
		TEXT:'text',
		CONTACT:'contact',
	}

	export default {
		props:['popin', 'closer'],
		components: {TransferHead, SymbolBall, RecipientField},
		data(){return {
			STATES,
			state:STATES.TEXT,

			token:null,
			fiat:null,
			recipient:'',
			memo:'',

			selected:null,
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
				'hasPremium',
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
					if(this.featureFlags.buy) return this.buyWithCard();
					// else return PopupService.push(Popups.snackbar("You don't have enough tokens to send."));
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
						PopupService.push(Popups.snackbar(sent.error));
					} else if (sent) {
						PopupService.push(Popups.transactionSuccess(this.account.blockchain(), TransferService.getTransferId(sent, this.account.blockchain())));
						this.closer(sent);
						setTimeout(() => {
							BalanceService.loadBalancesFor(this.account);
						}, 500);
					} else {
						PopupService.push(Popups.snackbar("An error occurred while trying to transfer these tokens."));
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
		.selector {
			.options {
				justify-content: space-around;
			}
		}
	}

</style>
