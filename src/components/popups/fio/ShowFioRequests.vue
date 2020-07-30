<template>
	<section class="transfer fio-requests">
		<section class="popup-content">

			<section class="switcher">
				<figure class="type" @click="switchTo(STATES.RECEIVED)" :class="{'active':state === STATES.RECEIVED}">Received</figure>
				<figure class="type" @click="switchTo(STATES.SENT)" :class="{'active':state === STATES.SENT}">Sent</figure>
			</section>

			<figure class="sub-title" v-if="state === STATES.RECEIVED">
				The requests below are transfer requests that others have sent you.
			</figure>
			<figure class="sub-title" v-if="state === STATES.SENT">
				The requests below are transfer requests that you have sent others.
			</figure>

			<section class="requests" v-if="loading">
				<i class=" animate-spin fas fa-spinner"></i>
			</section>

			<section class="requests" v-if="!loading && fioData.length">
				<section class="request" v-for="request in fioData">
					<section class="request-head">
						<section class="details">
							<figure class="name">{{request.sender}}</figure>
							<figure class="amount"><span>{{request.content.amount}}</span> {{request.content.token_code}} </figure>

						</section>
						<figure class="action" v-if="state === STATES.RECEIVED">
							<Button v-tooltip="'Reject'" icon="fal fa-times" @click.native="deny(request)" />
							<Button v-tooltip="'Send Tokens'" icon="fal fa-check" primary="1" @click.native="accept(request)" />
						</figure>
					</section>
					<section class="request-body" v-if="state === STATES.SENT">
						<figure class="status" :class="{'blue':statusCode(request.status) === 1, 'red':statusCode(request.status) === 0}">
							{{readableStatus(request.status)}}
							<i style="margin-left:5px;" class="fa fa-spinner fa-spin" v-if="statusCode(request.status) === -1"></i>
						</figure>
					</section>
					<section class="request-body" v-if="request.content.memo && request.content.memo.length">
						<figure class="memo">
							{{request.content.memo.substr(0,300)}}
						</figure>
					</section>

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
		RECEIVED:0,
		SENT:1,
	}

	export default {
		props:['popin', 'closer'],
		components: {SymbolBall},
		data(){return {
			state:STATES.RECEIVED,
			STATES,

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
			statusCode(status){
				switch(status){
					case 'sent_to_blockchain': return 1;
					case 'rejected': return 0;

					default: return -1;
				}
			},
			readableStatus(status){
				switch(status){
					case 'sent_to_blockchain': return 'Received';
					case 'requested': return 'Waiting for recipient';
					case 'rejected': return 'Rejected';

					default: return status;
				}
			},
			switchTo(state){
				if(this.loading) return;
				this.state = state;
			},
			async loadRequests(){
				this.loading = true;
				const plugin = PluginRepository.plugin(Blockchains.FIO);
				this.fioData = [];
				const fn = this.state === STATES.RECEIVED ? 'getPendingRequests' : 'getSentRequests';

				let cached = null;

				const parse = async requests => {
					cached = requests;
					requests = requests.filter(y => [y.payee_fio_address, y.payer_fio_address].includes(this.account.fio_address));
					requests = requests.reverse();

					for(let i = 0; i < requests.length; i++){
						if(this.fioData.length >= 5) break;
						const request = requests[i];

						const sharedSecret = await window.wallet.createSharedSecret('fio', this.account.publicKey, request.payee_fio_public_key).catch(() => null);
						if(!sharedSecret) continue;

						const content = await plugin.decrypt('new_funds_content', request.content, sharedSecret).catch(err => {
							console.error("FIO decryption error", err);
							return null;
						});
						if(!content) continue;

						const token = this.contentToToken(content);
						if(!token) continue;

						this.fioData.push({
							content,
							token,
							status:request.status,
							id:request.fio_request_id,
							sender:request.payee_fio_address,
							original:request,
						});

					}
				};
				const get = async (offset = 0) => {
					await plugin[fn](this.account).then(async requests => {
						if(requests.length === 100) {
							cached = requests;
							return get(offset+100);
						}
						if(requests.length === 0 && cached) return parse(cached);
						return parse(requests);
					});
				}

				await get();

				this.loading = false;
			},
			contentToToken(content){
				let token = BalanceHelpers.tokens().find(x => x.blockchain.toUpperCase() === content.chain_code.toUpperCase() && x.symbol.toUpperCase() === content.token_code.toUpperCase());
				if(!token) return null;
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
						memo:sent.added_memo,
						hash:null,
						offline_url:null,
					};
					const sharedSecret = await window.wallet.createSharedSecret('fio', this.account.publicKey, request.original.payee_fio_public_key);
					const encrypted = await plugin.encrypt('record_obt_data_content', content, sharedSecret);
					const recorded = await plugin.recordRequestData(this.account, request.id, request.original.payee_fio_address, encrypted);
					this.loadRequests();

				}, request.content.payee_public_address, request.token.amount, '', true, true))
			},
			async deny(request){
				const denied = await PluginRepository.plugin(Blockchains.FIO).rejectFundsRequest(this.account, request.id).catch(x => x);
				if(denied.error) return console.error(denied);
				this.loadRequests();
			}
		},
		watch:{
			['state'](){
				this.loadRequests();
			}
		}
	}
</script>

<style lang="scss">
	@import "../../../styles/variables";

	.fio-requests {
		min-height:500px;

		.switcher {
			margin-top:-40px;
			margin-bottom:30px;
			padding-top:0;
		}

		.requests {
			margin-top:30px;

			.request {
				align-items: flex-start;
				border:1px solid $blue;
				border-radius:4px;
				margin-top:4px;
				padding:5px;

				.request-head {

					display:flex;
				}

				.request-body {
					border-top:1px solid $borderlight;
					margin-top:5px;
				}

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

					.status {
						flex:1;
						text-align:left;
						margin-top:10px;
						font-size: $font-size-tiny;
					}
				}

				.action {
					flex:0 0 auto;
					display:flex;

					button {
						width:50px;
						margin-left:5px;
					}
				}

				.memo, .status {
					flex:1;
					text-align:left;
					margin-top:5px;
					font-size: $font-size-tiny;
					color:$grey;

					&.blue { color:$blue; }
					&.red { color:$red; }
				}

				.status {
					text-transform: capitalize;
					text-align:right;
				}
			}
		}
	}

	.blue-steel {
		.fio-requests {
			.requests {
				.request {
					.request-body {
						border-top:1px solid $borderdark;

					}
				}
			}
		}
	}

</style>
