<template>
	<section class="transfer">
		<section class="popup-content">

			<TransferHead :token="token"
			              :title="`How much <span>money</span> do you want to <span>send</span>?`"
			              v-on:amount="x => fiat = x" />

			<section style="padding-top:20px; display:flex; align-items: flex-end;">
				<Input style="margin-bottom:0;" placeholder="Identity name... (someone@scatter)" :text="recipient" v-on:changed="x => recipient = x" />
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
	import SymbolBall from "../reusable/SymbolBall";
	import TransferHead from "../reusable/TransferHead";
	import {mapState} from "vuex";
	import Token from '@walletpack/core/models/Token'

	export default {
		props:['popin', 'closer'],
		components: {TransferHead, SymbolBall},
		data(){return {
			recipient:'',
			memo:'',
			fiat:0,

			sending:false,
		}},
		mounted(){

		},
		computed:{
			...mapState([
				'scatter',
			]),
			contacts(){
				return this.scatter.contacts
					.filter(x => x.name.toLowerCase().indexOf(this.terms) > -1 || x.recipient.toLowerCase().indexOf(this.terms) > -1 || x.note.toLowerCase().indexOf(this.terms) > -1)
					.filter(x => x.blockchain === this.token.blockchain && x.chainId === this.token.chainId);
			},
			token(){
				return Token.fromJson({
					blockchain:'btc',
					chainId:'1',
					symbol:'$'
				});
			}
		},
		methods:{
			async send(){
				// const isSystemToken = this.token.network().systemToken().uniqueWithChain(false) === this.token.uniqueWithChain(false);
				// if(isSystemToken && parseFloat(this.token.totalBalance().amount) < parseFloat(this.token.amount)){
				// 	return this.buyWithCard();
				// }
				//
				// const reset = () => this.sending = false;
				//
				// if(this.sending) return;
				//
				// const recipient = this.contact ? this.contact.recipient : this.recipient;
				//
				// if(!PluginRepository.plugin(this.fromToken.blockchain).isValidRecipient(recipient))
				// 	return PopupService.push(Popups.snackbar(`The recipient you entered isn't a valid recipient for ${this.fromToken.symbol}`));
				//
				// if(this.token.amount <= 0)
				// 	return PopupService.push(Popups.snackbar(`You must specify an amount to send`));
				//
				// if(!await PasswordHelpers.verifyPIN()) return reset();
				//
				// this.sending = true;
				// const sent = await TransferService[this.account.blockchain()]({
				// 	account:this.account,
				// 	recipient,
				// 	amount:this.token.amount,
				// 	memo:this.memo,
				// 	token:this.token,
				// 	promptForSignature:false,
				// }).catch(err => {
				// 	PopupService.push(Popups.snackbar(`There was an issue sending: ${err}`));
				// 	return false
				// });
				//
				// reset();
				//
				// if(sent) {
				// 	if(sent.hasOwnProperty('error')){
				// 		PopupService.push(Popups.snackbar(sent.error, "attention-circled"));
				// 	} else if (sent) {
				// 		PopupService.push(Popups.transactionSuccess(this.account.blockchain(), TransferService.getTransferId(sent, this.account.blockchain())));
				// 		this.closer(sent);
				// 		setTimeout(() => {
				// 			BalanceService.loadBalancesFor(this.account);
				// 		}, 500);
				// 	} else {
				// 		PopupService.push(Popups.snackbar("An error occurred while trying to transfer these tokens."));
				// 	}
				//
				// }
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
