<template>
	<section class="transfer manage-fio">
		<section class="popup-content" v-if="token">

			<!--<figure class="title">Requesting <span>{{token.symbol}}</span></figure>-->

			<TransferHead :token="token"
			              :title="`How much <span>${token.symbol}</span> do you <br>want to <span>request</span>?`"
			              v-on:amount="x => token.amount = x" :hide-total="true" />

			<RecipientField placeholder="Identity name or FIO Address" :recipient="recipient" :token="token" v-on:recipient="x => recipient = x" />

			<figure class="tokens-text smaller" style="margin-top:30px;">Want to add a memo?</figure>
			<Input :text="memo" v-on:changed="x => memo = x" style="margin-top:20px; margin-bottom:0;" />

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Close" />
			<Button :loading="sending" primary="1" text="Request" icon="fal fa-hand-holding-usd" @click.native="request" />
		</section>


	</section>
</template>
<script>
	import "../../../styles/transfers.scss";
	import SymbolBall from "../../reusable/SymbolBall";
	import {Blockchains} from '@walletpack/core/models/Blockchains'
	import PluginRepository from '@walletpack/core/plugins/PluginRepository'
	import {mapState} from "vuex";
	import PopupService from "../../../services/utility/PopupService";
	import Popups from "../../../util/Popups";
	import TransferHead from "../../reusable/TransferHead";
	import RecipientField from '../../reusable/RecipientField';

	export default {
		props:['popin', 'closer'],
		components: {TransferHead, SymbolBall, RecipientField},
		data(){return {
			recipient:null,
			sending:false,
			memo:'',
		}},
		async mounted(){

		},
		computed:{
			...mapState([
				'scatter',
			]),
			account(){
				return this.popin.data.props.account;
			},
			token(){
				return this.popin.data.props.token;
			},
			networks(){
				return this.scatter.settings.networks.filter(x => x.blockchain !== Blockchains.FIO && x.accounts().length);
			}
		},
		methods:{
			async request(){
				this.sending = true;
				const reset = (msg = null) => {
					if(msg) PopupService.push(Popups.snackbar(msg));
					this.sending = false;
				};
				const plugin = PluginRepository.plugin('fio');

				if(!plugin.isValidRecipient(this.recipient)) return reset("This is not a valid recipient");

				const recipientPublicKey = await plugin.recipientToSendable(this.account.network(), this.recipient).catch(() => null);
				if(!recipientPublicKey) return reset("Could not find public key for recipient");

				let payee_public_address;
				if(this.token.blockchain === 'fio'){
					payee_public_address = this.account.publicKey;
				} else {
					payee_public_address= this.token.accounts()[0].sendable();
				}

				const content = {
					payee_public_address,
					amount:parseFloat(this.token.amount).toFixed(this.token.decimals).toString(),
					chain_code:this.token.network().blockchain.toUpperCase(),
					token_code:this.token.symbol,
					memo:this.memo,
					hash:'',
					offline_url:'',
				};

				const sharedSecret = await window.wallet.createSharedSecret('fio', this.account.publicKey, recipientPublicKey);
				const encrypted = await plugin.encrypt('new_funds_content', content, sharedSecret);

				// this.getCipherContent('new_funds_content', this.content, this.privateKey, this.payerFioPublicKey);
				const requested = await plugin.requestFunds(this.account, this.recipient, encrypted).catch(() => null);
				if(requested && requested.hasOwnProperty('transaction_id')){
					PopupService.push(Popups.transactionSuccess(this.account.blockchain(), requested.transaction_id));
					reset(null);
					this.closer(true);
				} else {
					reset(requested.error ? requested.error : "There was an error creating this request.");
				}
			},
		},
	}
</script>

<style lang="scss">
	@import "../../../styles/variables";

	.manage-fio {

		.networks {
			margin-top:30px;

			.network {
				display:flex;
				align-items: center;
				border:1px solid $blue;
				border-radius:4px;
				margin-top:4px;
				padding:2px 2px 2px 20px;

				.name {
					flex:1;
					text-align:left;
					font-size: $font-size-standard;
					font-weight: bold;
				}

				.action {
					flex:0 0 auto;
				}
			}
		}
	}

</style>
