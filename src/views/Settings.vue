<template>
	<section class="settings">

		<section class="hero-panel">
			<figure class="corners"></figure>
		</section>

		<section class="switcher">
			<figure class="type" @click="state = STATES.GENERAL" :class="{'active':state === STATES.GENERAL}">General</figure>
			<figure class="type" @click="state = STATES.SECURITY" :class="{'active':state === STATES.SECURITY}">Security</figure>
			<figure class="type" @click="state = STATES.ACCOUNTS" :class="{'active':state === STATES.ACCOUNTS}">Accounts</figure>
			<figure v-if="featureFlags.premium" class="type" @click="state = STATES.PREMIUM" :class="{'active':state === STATES.PREMIUM}">Premium</figure>
		</section>

		<br>

		<!-------------------------------------->
		<!------------- GENERAL --------------->
		<!-------------------------------------->
		<section class="panel-pad limiter settings-panel" v-if="state === STATES.GENERAL">
			<section class="title">General Settings</section>
			<figure class="text">
				These are some general settings for Scatter
			</figure>

			<br>
			<br>
			<br>

			<!-- LANGUAGE -->
			<section class="setting">
				<section class="flex">
					<section>
						<label>Language</label>
						<figure class="text">
							Scatter is an international application. Select the language you prefer.
						</figure>
					</section>
					<select>
						<option selected>English</option>
					</select>
				</section>
			</section>


			<!-- THEMES -->
			<section class="setting">
				<section class="flex">
					<section>
						<label>Theme</label>
						<figure class="text">
							You can change Scatter's look and feel to match your own personality.
						</figure>
					</section>
					<select @change="changeTheme">
						<option :selected="theme === THEMES.FLUORESCENT">{{THEMES.FLUORESCENT}}</option>
						<option :selected="theme === THEMES.BLUE_STEEL">{{THEMES.BLUE_STEEL}}</option>
					</select>
				</section>
			</section>


			<!-- DISPLAY CURRENCY -->
			<section class="setting">
				<section class="flex">
					<section>
						<label>Display Currency</label>
						<figure class="text">
							You can select what type of fiat currency you want as your display type.
						</figure>
					</section>
					<select @change="changeCurrency">
						<option :selected="currencyCurrency === currency" v-for="(price, currency) in currencies">{{currency}}</option>
					</select>
				</section>
			</section>

			<!-- SIMPLE MODE -->
			<section class="setting">
				<section class="flex">
					<section>
						<label>Enable developer mode</label>
						<figure class="text">
							If you are a developer you might need some special configurations for your Scatter.
							Enabling developer mode will change the user-interface for Scatter into something with
							far more options, but also far more complex and hard to use for an average user.
						</figure>
					</section>
					<Switcher :state="false" v-on:switched="enabledAdvancedMode" />
				</section>
			</section>



		</section>

		<!-------------------------------------->
		<!------------- SECURITY --------------->
		<!-------------------------------------->
		<section class="panel-pad limiter settings-panel" v-if="state === STATES.SECURITY">
			<section class="title">Security Settings</section>
			<figure class="text">
				These settings allow you to enhance your Scatter's security, and get backups of your data.
			</figure>

			<br>
			<br>
			<br>

			<!-- TWO FACTOR AUTH -->
			<!--<section class="setting">-->
				<!--<section class="flex">-->
					<!--<section>-->
						<!--<label>Two Factor Authentication</label>-->
						<!--<figure class="text">-->
							<!--Two factor authentication allows you to enable an extra step to logging into your account.-->
						<!--</figure>-->
					<!--</section>-->
					<!--<Switcher :state="twoFactor" v-on:switched="toggleTwoFactor" />-->
				<!--</section>-->
			<!--</section>-->

			<!-- CHANGE PASSWORD -->
			<section class="setting">
				<section class="flex">
					<section>
						<label>Change your password</label>
						<figure class="text">
							Changing your password periodically is healthy. Just make sure you don't get locked out.
						</figure>
					</section>
					<Button @click.native="changePassword" text="Change" />
				</section>
			</section>

			<!-- EXPORT FULL BACKUP -->
			<section class="setting">
				<section class="flex">
					<section>
						<label>Export a full backup</label>
						<figure class="text">
							You can export a full backup of your Scatter with all of your settings.
						</figure>
					</section>
					<Button text="Export Backup" @click.native="exportBackup" />
				</section>
			</section>

			<!-- EXPORT MNEMONIC -->
			<section class="setting" v-if="hasMnemonic">
				<section class="flex">
					<section>
						<label>Export your words</label>
						<figure class="text">
							You can export your words (otherwise known as mnemonic/seed phrase).
						</figure>
					</section>
					<Button text="Export Words" @click.native="exportMnemonic" />
				</section>
			</section>


			<!-- RESET -->
			<section class="setting">
				<section class="flex">
					<section>
						<label>Reset Scatter</label>
						<figure class="text">
							This will delete all of your local data. There are no cloud backups on third party servers,
							you will lose absolutely everything that you have not saved yourself; like your keys, accounts, and personal settings.
						</figure>
					</section>
					<Button text="Reset" @click.native="reset" />
				</section>
			</section>


		</section>

		<!-------------------------------------->
		<!------------- ACCOUNTS --------------->
		<!-------------------------------------->
		<section class="panel-pad limiter settings-panel" v-if="state === STATES.ACCOUNTS">
			<section class="title">Account Settings</section>
			<figure class="text">
				Each network can have 1 account associated at a time. However, for some networks you might have multiple
				accounts on the same keys, so you can manage which accounts to use here. Select a network from below to manage
				which account it is using.
			</figure>

			<br>
			<br>

			<section class="setting">
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


			<br>
			<br>
			<section class="setting">

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
								<Button @click.native="toggleNetwork(network)" :key="`${network.id}_toggle`" v-tooltip="`Disable`" icon="fa fa-power-off" />
								<Button style="margin-right:5px;" @click.native="editNetwork(network)" :key="`${network.id}_settings`" v-tooltip="`Manage`" icon="fa fa-cog" />
								<Button  @click.native="selectAccountFor(network)" primary="1" :key="`${network.id}_accounts`" text="Edit Accounts" />
							</section>
						</figure>
					</section>
					<br>
					<br>
					<br>
				</section>


				<section v-show="networks.filter(x => !isEnabled(x)).length">
					<label>Default networks</label>
					<section class="networks">
						<figure class="network" v-for="network in networks.filter(x => !isEnabled(x))">
							<section class="info">
								<section class="details">
									<figure class="name">{{network.name}}</figure>
								</section>
							</section>
							<section class="actions">
								<Button @click.native="toggleNetwork(network)" :key="`${network.id}_toggle`" v-tooltip="`Enable`" icon="fa fa-power-off" primary="1" />
							</section>
						</figure>
					</section>
				</section>

				<section class="loading-networks" v-if="loadingNetworks">
					<b>Loading default networks</b> <i class="fa fa-spinner animate-spin"></i>
				</section>
			</section>


		</section>

		<!-------------------------------------->
		<!------------- PREMIUM --------------->
		<!-------------------------------------->
		<section class="panel-pad limiter settings-panel" v-if="state === STATES.PREMIUM">
			<section class="title">Scatter Premium</section>
			<figure class="text">
				Going premium gives you special benefits not available to free users.
			</figure>

			<br>

			<GoPremium class="premium" embedded="1" v-if="!hasPremium" />

			<!--<section class="setting" v-if="!hasPremium">-->
				<!--<section class="flex">-->
					<!--<section>-->
						<!--<label>Get premium</label>-->
						<!--<figure class="text">-->
							<!--If you want -->
						<!--</figure>-->
					<!--</section>-->
					<!--<Button primary="1" text="Cancel Premium" @click.native="cancelPremium" />-->
				<!--</section>-->
			<!--</section>-->

			<section class="setting" v-if="hasPremium">
				<section class="flex">
					<section>
						<label>Cancel premium service</label>
						<figure class="text">
							By cancelling your premium service you will lose access to premium features.
							This will instantly stop automatic monthly payments.
						</figure>
					</section>
					<Button primary="1" text="Cancel Premium" @click.native="cancelPremium" />
				</section>
			</section>


		</section>


	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import Loader from "../util/Loader";
	import * as UIActions from "../store/ui_actions";
	import Switcher from "../components/reusable/Switcher";
	import PopupService from "../services/utility/PopupService";
	import Popups from "../util/Popups";
	import {blockchainName, BlockchainsArray} from "@walletpack/core/models/Blockchains";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import * as Actions from "@walletpack/core/store/constants";
	import {GET} from "@walletpack/core/services/apis/BackendApiService";
	import Network from '@walletpack/core/models/Network'
	import NetworkService from "@walletpack/core/services/blockchain/NetworkService";
	import AccountService from "@walletpack/core/services/blockchain/AccountService";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import SingularAccounts from "../services/utility/SingularAccounts";
	import PluginRepository from '@walletpack/core/plugins/PluginRepository';
	import GoPremium from '../components/popups/GoPremium'
	import BackupService from "../services/utility/BackupService";

	const STATES = {
		GENERAL:0,
		SECURITY:1,
		ACCOUNTS:2,
		PREMIUM:3,
	};

	export default {
		components:{
			Switcher,
			GoPremium
		},
		data(){return {
			STATES,
			state:STATES.GENERAL,
			BlockchainsArray,

			twoFactor:false,
			currencies:{},

			unlocked:false,
			knownNetworks:[],
			loadingNetworks:true,
			unreachable:{},
		}},
		beforeMount(){
			this.currencies[this.currencyCurrency] = 0;
			PriceService.getCurrencyPrices().then(x => this.currencies = x);
			// GET('2fa/enabled').then(enabled => this.twoFactor = enabled)
		},
		computed:{
			...mapState([
				'scatter',
				'swiped',
				'theme'
			]),
			hasMnemonic(){
				return !!this.scatter.keychain.keypairs.find(x => x.base);
			},
			currencyCurrency(){
				return this.scatter.settings.displayCurrency;
			},
			networks(){
				return this.scatter.settings.networks.concat(this.knownNetworks).reduce((acc,network) => {
					if(!acc.find(x => x.unique() === network.unique())) acc.push(network);
					return acc;
				}, []);
			}
		},
		methods:{
			reset(){
				PopupService.push(Popups.resetScatter());
			},
			async enabledAdvancedMode(){
				await window.wallet.storage.setSimpleMode(false);
				await window.wallet.lock();
				window.wallet.utility.reload(null, true)

			},
			isEnabled(network){
				return this.scatter.settings.networks.find(x => x.unique() === network.unique());
			},
			async toggleNetwork(network){
				// Loader.set(true);
				if(this.isEnabled(network)) {
					await NetworkService.removeNetwork(network);
					const account = SingularAccounts.accounts([network])[0];
					if(account) this[Actions.REMOVE_BALANCES]([account.identifiable()])
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

				Loader.set(false);
			},
			async selectAccountFor(network){
				PopupService.push(Popups.editNetworkAccount(network));
			},
			async unlock(){
				if(this.unlocked) return true;
				return new Promise(resolve => {
					PopupService.push(Popups.getPassword(async password => {
						if(!password) return resolve(false);
						if(window.wallet){
							this.unlocked = await window.wallet.verifyPassword(password).catch(() => false);
							resolve(this.unlocked);
						}
					}))
				})
			},
			async exportKey(blockchain){
				if(!await this.unlock()) return;
				const keypair = this.scatter.keychain.keypairs.find(x => x.blockchains[0] === blockchain);
				PopupService.push(Popups.exportPrivateKey(keypair))
			},
			async changePassword(){
				if(!await this.unlock()) return;
				PopupService.push(Popups.getPassword(async password => {
					if(!password) return;

					Loader.set(true);

					// For native wallets
					if(window.wallet){
						await window.wallet.changePassword(password);
					}

					Loader.set(false);
				}, true))
			},
			changeTheme(event){
				this[UIActions.SET_THEME](event.target.value);
			},
			changeCurrency(event){
				const clone = this.scatter.clone();
				clone.settings.displayCurrency = event.target.value;
				this[Actions.SET_SCATTER](clone);
			},
			toggleTwoFactor(){
				this.twoFactor = !this.twoFactor;
				if(this.twoFactor){
					PopupService.push(Popups.twoFactorAuth(success => {
						if(!success) this.twoFactor = false;
					}, true))
				} else {
					this.twoFactor = false;
					this.$nextTick(() => GET('2fa/disable'))
				}
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
			editNetwork(network = null){
				PopupService.push(Popups.addOrEditNetwork(network, updated => {
					if(updated) this.checkReachable(updated);
				}));
			},
			blockchainName,
			cancelPremium(){

			},
			async exportBackup(){
				if(await BackupService.createBackup()){
					PopupService.push(Popups.snackbar(`Backup created!`))
				}
			},
			async exportMnemonic(){
				if(!await this.unlock()) return;
				PopupService.push(Popups.exportMnemonic());
			},

			...mapActions([
				UIActions.SET_THEME,
				Actions.SET_SCATTER,
				Actions.REMOVE_BALANCES
			])
		},
		watch:{
			['state'](){
				if(this.state === STATES.ACCOUNTS){
					this.getNetworks();
					this.checkNetworks();
				}
			}
		}


	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.switcher {
		margin-top:10px;
	}

	.settings {

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
				}
			}
		}

		.settings-panel {
			.title {
				font-size: $font-size-large;
				font-weight: bold;
			}

			.text {
				margin-top:5px;
				font-size: $font-size-standard;
				color:$grey;
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



		.premium {
			width:100%;
			max-width:none;
			margin:0 auto;
		}
	}



</style>

