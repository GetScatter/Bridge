<template>
	<section class="transfer move-ridl">
		<section class="popup-content">

			<TransferHead :token="token" :title="`How much <span>RIDL</span> do you want to <span>move</span>?`" v-on:amount="x => token.amount = x" subtitle="Where do you want to move them to?" />
			<section class="switcher">
				<figure class="type" @click="state = STATES.TO_IDENTITY" :class="{'active':state === STATES.TO_IDENTITY}">Identity</figure>
				<figure class="type" @click="state = STATES.TO_ACCOUNT" :class="{'active':state === STATES.TO_ACCOUNT}">Account</figure>
			</section>
			<br>
			<section v-if="state === STATES.TO_IDENTITY">
				<Input placeholder="identity@scatter" :text="recipient" v-on:changed="x => recipient = x" />

				<figure class="description">
					It will take 24 hours before you can use these in your identity for assigning reputations.
				</figure>
			</section>

			<section v-if="state === STATES.TO_ACCOUNT">
				<section class="flex" style="margin-bottom:20px;">
					<Input style="margin-bottom:0;" placeholder="Account name" :text="recipient" v-on:changed="x => recipient = x" />
					<Select style="margin-top:0;" :parser="network => network ? network.name : 'Select a network'" :options="networks" :selected="selectedNetwork ? selectedNetwork.name : null" v-on:selected="x => selectNetwork(x)" />
				</section>

				<figure class="description">
					This will take a minimum of three minutes.
				</figure>
			</section>


		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button :loading="sending" primary="1" text="Move Tokens" icon="fal fa-random" @click.native="moveTokens" />
		</section>


	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import SymbolBall from "../reusable/SymbolBall";
	import TransferHead from "../reusable/TransferHead";
	import {mapState} from "vuex";
	import SavingsService from "../../services/utility/SavingsService";
	import RidlService from "../../services/utility/RidlService";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import TransferService from "@walletpack/core/services/blockchain/TransferService";
	import SingularAccounts from "../../services/utility/SingularAccounts";

	const STATES = {
		TO_ACCOUNT:0,
		TO_IDENTITY:1,
	}

	export default {
		props:['popin', 'closer'],
		components: {TransferHead, SymbolBall},
		data(){return {
			recipient:'',
			sending:false,
			STATES,
			state:STATES.TO_IDENTITY,
			availableChains:[],
			selectedNetwork:null,
		}},
		async mounted(){
			this.availableChains = await RidlService.getChains();
			this.selectedNetwork = this.availableChains[0];
		},
		computed:{
			...mapState([
				'scatter',
			]),
			token(){
				return this.popin.data.props.token;
			},
			networks(){
				if(!this.availableChains) return [];
				return [null].concat(this.scatter.settings.networks.filter(x => x.blockchain === 'eos' && this.availableChains.includes(x.chainId) && x.chainId !== this.token.chainId));
			},
		},
		methods:{
			selectNetwork(network){
				this.selectedNetwork = network;
				if(network) {
					const account = SingularAccounts.accounts([this.selectedNetwork])[0];
					if(account) return this.recipient = account.sendable();
				}
				this.recipient = '';
			},
			async moveTokens(){
				if(!this.recipient.length) return PopupService.push(Popups.snackbar('You must enter a recipient.'));
				this.sending = true;

				const account = SingularAccounts.accounts([this.token.network()])[0];

				let sent;
				if(this.state === STATES.TO_ACCOUNT){
					if(!this.selectedNetwork) PopupService.push(Popups.snackbar("You must select a network first."))
					else sent = await RidlService.moveTokensToAccount(account, this.token, this.recipient, this.selectedNetwork);
				}

				if (this.state === STATES.TO_IDENTITY){
					sent = await RidlService.moveTokensToIdentity(account, this.token, this.recipient);
				}

				if(sent) {
					if(sent.hasOwnProperty('error')) PopupService.push(Popups.snackbar(sent.error));
					else {
						PopupService.push(Popups.transactionSuccess(this.account.blockchain(), TransferService.getTransferId(sent, this.account.blockchain())));
						this.closer(sent);
					}

				}

				this.sending = false;
			},
		},
		watch:{

		}
	}
</script>

<style lang="scss">
	@import "../../styles/variables";

	.move-ridl {

		.select {
			.options {
				top: 45px;
			}
		}

		.description {
			font-size: $font-size-small;

			b {
				color:$red;
			}
		}
	}

</style>
