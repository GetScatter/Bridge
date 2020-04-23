<template>
	<section class="transfer fio-requests">
		<section class="popup-content">

			<figure class="title">Pending <span>Requests</span></figure>
			<figure class="sub-title" style="margin-top:-20px;">
				The requests below are transfer requests that others have sent you.
			</figure>

			<section class="requests" v-if="loading">
				<i class=" animate-spin fas fa-spinner"></i>
			</section>

			<section class="requests" v-if="!loading && fioData.length">
				<section class="request" v-for="request in fioData">
					<section class="details">
						<figure class="name">{{request.sender}}</figure>
						<figure class="amount"><span>{{request.content.amount}}</span> {{request.content.token_code}} </figure>
					</section>
					<figure class="action">
						<Button v-tooltip="'Reject'" icon="fal fa-ban" @click.native="deny(request)" />
						<Button v-tooltip="'Send Tokens'" icon="fal fa-paper-plane" primary="1" @click.native="accept(request)" />
					</figure>
				</section>
			</section>

			<section class="requests" v-if="!loading && !fioData.length">
				<h3>You don't have any requests!</h3>
			</section>


		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Close" />
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
	import BalanceHelpers from "../../../services/utility/BalanceHelpers";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import TransferService from "@walletpack/core/services/blockchain/TransferService";

	const STATES = {
		TO_ACCOUNT:0,
		TO_IDENTITY:1,
	}

	export default {
		props:['popin', 'closer'],
		components: {SymbolBall},
		data(){return {
			fioData:[],
			loading:true,
		}},
		async mounted(){
			this.loadRequests();
		},
		computed:{
			...mapState([
				'scatter',
			]),
			currency(){
				return PriceService.fiatSymbol()
			},
			account(){
				return this.popin.data.props.account;
			},
		},
		methods:{
			async loadRequests(){
				this.loading = true;
				const plugin = PluginRepository.plugin(Blockchains.FIO);
				this.fioData = [];
				await plugin.getPendingRequests(this.account).then(async x => {
					for(let i = 0; i < x.length; i++){
						if(this.fioData.length >= 5) break;
						const request = x[i];

						const sharedSecret = await window.wallet.createSharedSecret('fio', this.account.publicKey, request.payee_fio_public_key).catch(() => null);
						if(!sharedSecret) continue;
						const content = await plugin.decrypt('new_funds_content', request.content, sharedSecret);
						const token = this.contentToToken(content);
						if(!token) continue;
						this.fioData.push({
							content,
							token,
							id:request.fio_request_id,
							sender:request.payee_fio_address,
							original:request,
						});
						this.loading = false;
					}

				});
				this.loading = false;
			},
			contentToToken(content){
				const possibleTokens = BalanceHelpers.tokens().filter(x => x.blockchain.toUpperCase() === content.chain_code.toUpperCase() && x.symbol.toUpperCase() === content.token_code.toUpperCase());
				if(possibleTokens.length === 0) return null;
				let token = null;

				if(possibleTokens.length === 1) token = possibleTokens[0];
				// TODO: What should we do here? This could be a different token because FIO doesn't actually give a chain id.
				else token = possibleTokens[0];

				token = token.clone();
				token.amount = parseFloat(content.amount);
				return token;
			},
			async accept(request){
				const plugin = PluginRepository.plugin(Blockchains.FIO);
				PopupService.push(Popups.transfer(request.token.accounts()[0], request.token, async sent => {
					if(!sent) return;
					const txid = TransferService.getTransferId(sent, request.token.blockchain);
					const content = {
						payer_public_address:'',
						payee_public_address:'',
						amount:'',
						chain_code:'',
						token_code:'',
						status:'sent_to_blockchain',
						obt_id:txid,
						memo:null,
						hash:null,
						offline_url:null,
					};
					const sharedSecret = await window.wallet.createSharedSecret('fio', this.account.publicKey, request.original.payee_fio_public_key);
					const encrypted = await plugin.encrypt('record_obt_data_content', content, sharedSecret);
					const recorded = await plugin.recordRequestData(this.account, request.id, request.original.payee_fio_address, encrypted);
					// this.fioData = this.fioData.filter(x => x.id !== request.id);
					this.loadRequests();

				}, request.content.payee_public_address, request.token.amount, request.content.memo, true))
			},
			async deny(request){
				const denied = await PluginRepository.plugin(Blockchains.FIO).rejectFundsRequest(this.account, request.id).catch(x => x);
				if(denied.error) return console.error(denied);
				// this.fioData = this.fioData.filter(x => x.id !== request.id);
				this.loadRequests();
			}
		},
	}
</script>

<style lang="scss">
	@import "../../../styles/variables";

	.fio-requests {
		min-height:500px;

		.requests {
			margin-top:30px;

			.request {
				display:flex;
				align-items: center;
				border:1px solid $blue;
				border-radius:4px;
				margin-top:4px;
				padding:5px;

				.details {
					flex:1;
					padding-left:5px;

					.name {
						flex:1;
						text-align:left;
						font-size: $font-size-tiny;
						font-weight: bold;
						color:$blue;
					}

					.amount {
						flex:1;
						text-align:left;
						margin-top:10px;
						font-size: $font-size-tiny;

						span {
							font-size: $font-size-medium;
							font-weight: bold;
							margin-right:5px;
						}
					}
				}

				.action {
					flex:0 0 auto;
					display:flex;

					button {
						margin-left:5px;
					}
				}
			}
		}
	}

</style>
