<template>
	<section class="manage-networks">
		<section class="manager">
			<section class="title">Networks</section>
			<figure class="text">
				Scatter supports all types of EOSIO, Ethereum, Tron and Bitcoin networks. We've listed some of the more populars ones below, but you can use any network within Scatter
				as long as you know the network details.
			</figure>

			<br>

			<section class="switcher">
				<figure class="type" @click="state = STATES.MANAGE" :class="{'active':state === STATES.MANAGE}">Manage Networks</figure>
				<figure class="type" @click="state = STATES.ADD" :class="{'active':state === STATES.ADD}">Custom Network</figure>
			</section>

			<section class="setting" v-if="state === STATES.ADD">
				<section class="flex">
					<section>
						<label>Add a custom network</label>
						<figure class="text">
							Scatter allows you to define any network you want, and you can change existing networks. Note that this might cause issues with your Scatter
							if you don't know what you're doing.
						</figure>
					</section>
					<Button primary="1" text="Add custom network" @click.native="editNetwork()" />
				</section>
			</section>


			<section class="setting" v-if="state === STATES.MANAGE">

				<section v-show="networks.filter(x => isEnabled(x)).length">
					<label class="blue">Enabled networks</label>

					<section class="networks">
						<figure class="network" v-for="network in networks.filter(x => isEnabled(x))">
							<section class="info">
								<section class="details">
									<figure class="name">{{network.name}}</figure>
									<figure v-if="cantReach(network)" class="connection-error"><i class="fa fa-exclamation-triangle"></i> Connection error!</figure>
								</section>
							</section>
							<section class="actions">
								<Button style="margin-right:5px;" @click.native="editNetwork(network)" :key="`${network.id}_settings`" v-tooltip="`Configure`" icon="fa fa-cog" />
								<Switcher state="1" @click.native="toggleNetwork(network)" />
							</section>
						</figure>
					</section>
					<br>
					<br>
					<br>
				</section>


				<section v-show="networks.filter(x => !isEnabled(x)).length">
					<label>Popular networks</label>
					<section class="networks">
						<figure class="network" v-for="network in networks.filter(x => !isEnabled(x))">
							<section class="info">
								<section class="details">
									<figure class="name">{{network.name}}</figure>
								</section>
							</section>
							<section class="actions">
								<Switcher :state="0" @click.native="toggleNetwork(network)" />
							</section>
						</figure>
					</section>
				</section>

				<section class="loading-networks" v-if="loadingNetworks">
					<b>Loading default networks</b> <i class="fa fa-spinner animate-spin"></i>
				</section>
			</section>
		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Close" />
		</section>
	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import * as Actions from "@walletpack/core/store/constants";
	import PluginRepository from '@walletpack/core/plugins/PluginRepository';
	import {GET} from "@walletpack/core/services/apis/BackendApiService";
	import Network from '@walletpack/core/models/Network'
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import NetworkService from "@walletpack/core/services/blockchain/NetworkService";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import * as PluginTypes from '@walletpack/core/plugins/PluginTypes';
	import * as UIActions from "../../store/ui_actions";

	const STATES = {
		MANAGE:0,
		ADD:1,
	};

	export default {
		props:['closer', 'popin'],
		data(){return {
			loadingNetworks:false,
			knownNetworks:[],
			unreachable:{},
			STATES,
			state:STATES.MANAGE,
		}},
		computed:{
			...mapState([
				'scatter'
			]),
			networks(){
				const defaultNetworks = PluginRepository.plugins.filter(plugin => plugin.type === PluginTypes.BLOCKCHAIN_SUPPORT).map(x => x.getEndorsedNetwork())
				return this.scatter.settings.networks.concat(this.knownNetworks).concat(defaultNetworks).reduce((acc,network) => {
					if(!acc.find(x => x.unique() === network.unique())) acc.push(network);
					return acc;
				}, []);
			},
		},
		mounted(){
			this.getNetworks();
		},
		methods:{
			async selectAccountFor(network){
				PopupService.push(Popups.editNetworkAccount(network));
			},
			editNetwork(network = null){
				PopupService.push(Popups.addOrEditNetwork(network, updated => {
					if(updated) this.checkReachable(updated);
				}));
			},
			async checkNetworks(){
				this.scatter.settings.networks.map(async network => {
					await this.checkReachable(network);
				})
			},
			async checkReachable(network){
				const reachable = await PluginRepository.plugin(network.blockchain).checkNetwork(network);
				if(!reachable) this.unreachable[network.unique()] = true;
				else delete this.unreachable[network.unique()];
				this.$forceUpdate();
			},
			cantReach(network){
				return this.unreachable[network.unique()]
			},
			async getNetworks(){
				if(this.knownNetworks.length) return;
				this.loadingNetworks = true;
				this.knownNetworks = await Promise.race([
					new Promise(resolve => setTimeout(() => resolve([]), 2000)),
					GET(`networks?flat=true`).then(networks => networks.map(x => Network.fromJson(x))).catch(() => [])
				]);
				this.loadingNetworks = false;
			},
			isEnabled(network){
				return this.scatter.settings.networks.find(x => x.unique() === network.unique());
			},
			async toggleNetwork(network){
				if(this.isEnabled(network)) {
					await NetworkService.removeNetwork(network);
					const account = SingularAccounts.accounts([network])[0];
					if(account) this[Actions.REMOVE_BALANCES]([account.identifiable()])
					this[UIActions.REMOVE_ACCOUNT_CACHE](network.unique());
				}
				else {
					await NetworkService.addNetwork(network);
					const cachedAccount = SingularAccounts.accounts([network])[0];
					if(cachedAccount) {
						const toRemove = network.accounts().filter(account => account.unique() !== cachedAccount.unique());
						if(toRemove.length) await AccountService.removeAccounts(toRemove);
						BalanceService.loadBalancesFor(cachedAccount);
					}

				}
			},

			...mapActions([
				Actions.SET_SCATTER,
				Actions.REMOVE_BALANCES,
				UIActions.REMOVE_ACCOUNT_CACHE
			])
		},
		watch:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.manage-networks {
		max-width:600px;
		width:100%;
		display:flex;

		.manager {
			padding:40px;
			overflow-y: auto;
			text-align:left;

		}

		.title {
			font-size: $font-size-large;
			font-weight: bold;
		}

		.text {
			margin-top:5px;
			font-size: $font-size-standard;
			color:$grey;
		}

		.loading-networks {
			margin-top:20px;
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: $font-size-standard;
			color:$grey;

			i {
				margin-left:10px;
			}
		}

		.networks {

			.network {
				display:flex;
				align-items: center;
				padding:10px 0;
				border-bottom:1px solid $borderlight;

				.info {
					display:flex;
					align-items: center;
					flex:1;

					.switch {
						flex:0 0 auto;
						margin-right:10px;
					}

					.details {
						.connection-error {
							font-size: $font-size-small;
							color:red;
						}

						.name {
							flex:1;
							padding-right:20px;
						}
					}
				}

				.actions {
					flex:0 0 auto;
					display:flex;
					align-items: center;

					button {
						border-radius:50%;
					}
				}
			}
		}

		.setting {
			margin-top:20px;
			padding-bottom:20px;

			&:not(:last-child){
				border-bottom:1px solid $borderlight;
			}

			.flex {
				align-items: center;

				button, .switch, select {
					flex:0 0 auto;
					margin-left:20px;
				}
			}

			label {
				font-size: $font-size-small;
				font-weight: bold;
				color:$grey;
				display:block;
				margin-bottom:10px;

				&.blue {
					color:$blue;
				}
			}

			.text {
				margin-top:0;
				font-size: $font-size-small;
				color: inherit;
			}

			.buttons-list {
				button {
					display:inline-block;
					margin-right:5px;
				}
			}


		}


	}

	.blue-steel {

	}

</style>
