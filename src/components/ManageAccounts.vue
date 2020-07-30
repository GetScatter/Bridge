<template>
	<section class="manage-accounts" :class="{'collapsed':collapsedSidebar, 'mobile':isMobile}">

		<section class="head">
			<Button v-show="!collapsedSidebar" v-tooltip="'Refresh'" small="1" :icon="`fal fa-sync ${loadingAccounts ? 'fa-spin' : ''}`" :disabled="loadingAccounts" @click.native="refreshAccounts" />
			<Button v-show="!collapsedSidebar" v-tooltip="'Networks'" small="1" icon="fal fa-globe-americas" @click.native="manageNetworks" />
			<Button v-show="!collapsedSidebar" v-tooltip="'Keys'" small="1" icon="fal fa-key" @click.native="manageKeys" />
			<Button small="1" icon="fas fa-user" @click.native="toggleCollapsed" />
		</section>

		<SearchBar placeholder="Search accounts..." v-show="!collapsedSidebar" v-on:terms="x => search = x" />

		<section class="networks" v-show="!collapsedSidebar">
			<section class="network" v-for="{network, accounts} in networkAccounts" v-show="accounts && accounts.length">
				<figure class="network-name">{{network.name}}</figure>
				<section class="accounts">
					<section class="account" v-for="account in accounts">
						<figure class="account-name">{{account.sendable()}}<span class="authority" v-if="account.authority">@{{account.authority}}</span></figure>
						<figure class="toggle">
							<Switcher small="1" :state="enabledAccounts.find(x => x.unique() === account.unique())" v-on:switched="select(account, network)" />
						</figure>
					</section>
				</section>
			</section>
		</section>

	</section>

</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import * as UIActions from "../store/ui_actions";
	import SearchBar from "../components/reusable/SearchBar";
	import Switcher from "../components/reusable/Switcher";
	import SingularAccounts from "../services/utility/SingularAccounts";
	import AccountService from '@walletpack/core/services/blockchain/AccountService'
	import PluginRepository from '@walletpack/core/plugins/PluginRepository'
	import Account from '@walletpack/core/models/Account'
	import BalanceService from '@walletpack/core/services/blockchain/BalanceService';
	import Popups from "../util/Popups";
	import PopupService from "../services/utility/PopupService";

	export default {
		components:{
			SearchBar,
			Switcher,
		},
		data(){return {
			search:'',
			loadingAccounts:false,
			networkAccounts:{},
		}},
		computed:{
			...mapState([
				'scatter',
				'topActionsColor',
				'currencies',
				'loadingBalances',
				'collapsedSidebar',
				'isMobile',
				'accountCache'
			]),
			networks(){
				return this.scatter.settings.networks;
			},
			keys(){
				return this.scatter.keychain.keypairs;
			},
			enabledAccounts(){
				return SingularAccounts.accounts(this.networks);
			},
		},
		mounted(){
			this.refreshAccounts()
		},
		methods:{
			async refreshAccounts(){
				this.loadingAccounts = true;
				await SingularAccounts.refreshAccounts(this.networks, this.keys);
				this.loadingAccounts = false;
			},
			toggleCollapsed(){
				this[UIActions.SET_COLLAPSED_SIDEBAR](!this.collapsedSidebar);
			},
			manageNetworks(){
				PopupService.push(Popups.manageNetworks());
			},
			manageKeys(){
				PopupService.push(Popups.manageKeys());
			},
			setNetworkAccounts(){
				this.networkAccounts = this.networks.map(network => {
					return {
						network,
						accounts:(() => {
							if(!this.accountCache[network.unique()]) return [];
							return this.accountCache[network.unique()].filter(x => {
								return x.sendable().toLowerCase().indexOf(this.search) > -1
									|| x.authority.toLowerCase().indexOf(this.search) > -1
									|| network.name.toLowerCase().indexOf(this.search) > -1;
							});
						})().sort((a,b) => {
							return a.sendable().localeCompare(b.sendable())
						}).sort((a,b) => {
							return this.enabledAccounts.find(x => x.unique() === a.unique()) ? -1 : 0;
						})
					}
				});
			},
			async select(account, network){
				const oldAccounts = network.accounts();
				if(oldAccounts.length) await AccountService.removeAccounts(oldAccounts);

				if(account) {
					if (network.blockchain === 'fio' && account.account_hash) {
						account.fio_address = account.formatted();
						account.name = account.account_hash;
						delete account.account_hash;
						account.authority = 'active';
					}

					await AccountService.addAccount(account);
					SingularAccounts.setPredefinedAccount(network, account);
					BalanceService.loadBalancesFor(account);
				} else {
					SingularAccounts.setPredefinedAccount(network, account);
				}
			},
			...mapActions([
				UIActions.SET_COLLAPSED_SIDEBAR,
				UIActions.SET_ACCOUNT_CACHE,
			])
		},
		watch:{
			['search'](){
				this.setNetworkAccounts();
			},
			['scatter.settings.networks'](){
				this.setNetworkAccounts();
			},
			accountCache:{
				deep: true,
				handler(){
					this.setNetworkAccounts();
				}

			},

		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.manage-accounts {
		position:fixed;
		top:0;
		right:0;
		bottom:0;
		width:$accountssidebar;
		border-left:1px solid $borderlight;
		padding:20px;
		z-index:2;

		transition:width 0.2s ease;

		&.collapsed {
			width:$accountssidebarcollapsed;
		}

		&:not(.collapsed){
			&.mobile {
				z-index:9999999999999999;
				background:white;
				width:100%;
			}
		}

		.search-bar {
			margin:10px 0;
			width:100%;

			input {
				width:100%;
			}
		}

		.head {
			width:100%;
			display:flex;
			justify-content: flex-end;

			.search {

			}
		}

		.networks {
			overflow-y:auto;
			max-height:calc(100vh - 180px);
			margin-top:20px;
			padding-bottom:40px;

			.network {
				margin-bottom:30px;

				.network-name {
					font-size: $font-size-tiny;
					font-weight: bold;
					position: relative;
					padding-bottom:5px;

					&:after {
						content:'';
						border-bottom:1px solid $borderlight;
						width:100%;
						position:absolute;
						bottom:0;
						left:-20px;
						right:-20px;
					}
				}

				.accounts {


					.account {
						margin-top:10px;
						display:flex;
						justify-content: space-between;
						align-items: center;
						padding-right:10px;

						.account-name {
							font-size: $font-size-tiny;
							color:$blue;

							max-width:80%;

							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;

							.authority {
								color:$black;
							}
						}

						.toggle {

						}
					}
				}
			}
		}
	}

	.blue-steel {
		.manage-accounts {
			border-left:2px solid $borderdark;

			.networks {

				.network {

					.network-name {
						&:after {
							border-bottom:1px solid $borderdark;
						}
					}

					.accounts {

						.account {

							.account-name {
								color:$blue;
								.authority {
									color:white;
								}
							}
						}
					}
				}
			}
		}
	}

</style>
