<template>
	<section class="transfer manage-fio">
		<section class="popup-content">

			<figure class="title">Managing <span>FIO</span> Identity</figure>
			<figure class="sub-title" style="margin-top:-20px;">{{account.fio_address}}</figure>

			<section class="networks" v-if="fioData">
				<section class="network" v-for="network in networks">
					<figure class="name">{{network.name}}</figure>
					<figure class="action">
						<Button v-if="!fioData[network.unique()]" text="Attach" @click.native="linkNetwork(network)" />
						<Button v-if="fioData[network.unique()]" primary="1" disabled="1" text="Linked" />
					</figure>
				</section>
			</section>


		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Close" />
		</section>


	</section>
</template>
<script>
	import "../../styles/transfers.scss";
	import SymbolBall from "../reusable/SymbolBall";
	import {Blockchains} from '@walletpack/core/models/Blockchains'
	import PluginRepository from '@walletpack/core/plugins/PluginRepository'
	import {mapState} from "vuex";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";

	const STATES = {
		TO_ACCOUNT:0,
		TO_IDENTITY:1,
	}

	export default {
		props:['popin', 'closer'],
		components: {SymbolBall},
		data(){return {
			fioData:null,
		}},
		async mounted(){
			this.syncData()
		},
		computed:{
			...mapState([
				'scatter',
			]),
			account(){
				return this.popin.data.props.account;
			},
			networks(){
				return this.scatter.settings.networks.filter(x => x.blockchain !== Blockchains.FIO && x.accounts().length);
			}
		},
		methods:{
			async syncData(){
				const plugin = PluginRepository.plugin(Blockchains.FIO);
				this.fioData = await Promise.all(this.networks.map(async network => {
					return {
						network,
						address:await plugin.recipientToSendable(this.account.network(), this.account.fio_address, network.blockchain, network.systemToken().symbol).catch(() => null)
					};
				})).then(x => x.reduce((acc, y) => {
					acc[y.network.unique()] = y.address;
					return acc;
				}, {}));
			},
			async linkNetwork(network){
				const plugin = PluginRepository.plugin(Blockchains.FIO);
				await plugin.linkAddress(this.account, [{
					"chain_code": network.blockchain.toUpperCase(),
					"token_code": network.systemToken().symbol.toUpperCase(),
					"public_address": network.accounts()[0].sendable()
				}]).catch(err => {
					PopupService.push(Popups.snackbar(err.error));
					return false
				}).then(x => {
					this.syncData();
				});

			},
		},
	}
</script>

<style lang="scss">
	@import "../../styles/variables";

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
