<template>
	<section class="edit-network-account transfer">

		<section class="popup-content">
			<section class="head">

				<section class="texts" v-if="!addingNewKey">
					<figure class="title">Select account</figure>
					<figure class="sub-title">
						In simple mode you can only use a single account per network. Please select your preferred account.
					</figure>
				</section>

				<section v-if="addingNewKey">
					<section class="texts" v-if="!importingHardware">
						<figure class="title">Import account</figure>
						<figure class="sub-title">
							Blockchain accounts are linked to <b>private keys</b>.
							If you have a private key, you can import it from text or a hardware wallet below.
						</figure>
					</section>
					<section class="texts" v-if="importingHardware">
						<figure class="title">Import from hardware</figure>
						<figure class="sub-title">
							The safest way to utilize your private keys is using a hardware wallet.
							Plug in your hardware wallet now if you haven't already done so.
						</figure>
					</section>
				</section>



				<figure class="action">
					<figure class="bubble" @click="toggleAddingKey" :class="{'active':addingNewKey}">
						<i class="fa fa-plus"></i>
					</figure>
				</figure>
			</section>

			<section class="new-key" v-if="addingNewKey">
				<section v-if="!importingHardware">
					<Input :disabled="loadingKey" label="Input your private key" :text="privateKey" v-on:changed="x => privateKey = x" style="margin-bottom:0;" />

					<br>
					<figure class="line"></figure>
					<br>

					<Button text="Generate New Key" style="margin-bottom:5px;" primary="1" @click.native="generateKey" />
					<Button v-if="canUseHardware" text="Import From Hardware" primary="1" @click.native="importingHardware = true" />
				</section>

				<ImportHardware v-if="importingHardware" :blockchain="network.blockchain" v-on:imported="importedHardware" />
			</section>

			<section v-if="!addingNewKey">
				<section v-if="keys.length">
					<section class="search">
						<i class="fa fa-search"></i>
						<input v-model="terms" />
					</section>

					<section class="scroller">

						<section class="keys">
							<section class="key" :key="key.id" v-for="key in keys">
								<figure class="public-key">{{key.publicKeys.find(x => x.blockchain === network.blockchain).key}}</figure>
								<section class="actions">
									<Button v-if="!key.external" icon="fa fa-key" @click.native="exportKey(key)" />
									<Button v-if="!isAccountlessChain" icon="fa fa-sync-alt" :loading="loadingAccounts[key.unique()]" @click.native="refreshAccounts(key)" />
									<Button icon="fa fa-trash" @click.native="removeKey(key)" />
								</section>

								<section class="accounts">
									<Button @click.native="select(account)"
									        :key="account.unique()"
									        v-for="account in keyAccounts(key)"
									        :text="isAccountlessChain ? 'Use this address' : account.sendable()"
									        :primary="isCurrentlySelected(account)"
									/>
								</section>
							</section>
						</section>

					</section>
				</section>


				<section v-else class="no-keys">

					<img src="static/assets/identity.svg" />
					<p>You have no keys imported</p>
				</section>
			</section>

		</section>




		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import {blockchainName} from '@walletpack/core/models/Blockchains'
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import {mapActions, mapState} from "vuex";
	import * as Actions from '@walletpack/core/store/constants';
	import BalanceService from '@walletpack/core/services/blockchain/BalanceService';
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";
	import Account from '@walletpack/core/models/Account'
	import Keypair from '@walletpack/core/models/Keypair'
	import KeyPairService from '@walletpack/core/services/secure/KeyPairService'
	import AccountService from '@walletpack/core/services/blockchain/AccountService'
	import PluginRepository from '@walletpack/core/plugins/PluginRepository'
	import KeyService from "../../services/utility/KeyService";

	let keyTimeout;
	export default {
		props:['popin', 'closer'],
		components:{
			ImportHardware:() => import('./importable/ImportHardware'),
		},
		data(){return {
			importingHardware:false,
			canUseHardware:false,

			addingNewKey:false,

			terms:'',
			privateKey:'',
			loadingKey:false,
			loadingAccounts:{},

			accounts:{},
		}},
		created(){
			this.keys.map(keypair => this.loadAccounts(keypair));

			if(this.importing){
				this.addingNewKey = true;
			}

			window.wallet.hardwareTypes()
				.then(x => this.canUseHardware = !!x.length)
				.catch(() => this.canUseHardware = false);
		},
		computed:{
			...mapState([
				'scatter',
			]),
			isAccountlessChain(){
				return !PluginRepository.plugin(this.network.blockchain).accountsAreImported();
			},
			network(){
				return this.popin.data.props.network
			},
			importing(){
				return this.popin.data.props.importing
			},
			keys(){
				return this.scatter.keychain.keypairs.filter(x => x.blockchains[0] === this.network.blockchain);
			},
			currentlySelected(){
				return SingularAccounts.accounts([this.network])[0];
			}
		},
		methods:{
			async loadAccounts(keypair){
				const loadedAccount = SingularAccounts.accounts([this.network])[0];
				const accounts = await AccountService.getAccountsFor(keypair, this.network);

				if(loadedAccount && !accounts.find(x => x.unique() === loadedAccount.unique())){
					accounts.unshift(loadedAccount);
				}

				this.accounts[keypair.unique()] = accounts;

				if(!SingularAccounts.accounts([this.network]).length && accounts.length){
					SingularAccounts.setPredefinedAccount(this.network, accounts[0]);
				}

				this.$forceUpdate();
			},
			async importedHardware(keypair){
				if(keypair.isUnique()) {
					await KeyPairService.saveKeyPair(keypair);
					await this.loadAccounts(keypair);
					this.importingHardware = false;
					this.loadingKey = false;
					this.addingNewKey = false;
				}
			},
			toggleAddingKey(){
				this.addingNewKey = !this.addingNewKey;
				this.importingHardware = false;
			},
			async generateKey(){
				const keypair = Keypair.placeholder();
				keypair.blockchains = [this.network.blockchain];
				await KeyPairService.generateKeyPair(keypair);
				await KeyPairService.makePublicKeys(keypair);
				keypair.setName();
				await KeyPairService.saveKeyPair(keypair);

				// We don't need to tap chain here, since eosio networks won't automatically add an account.
				if(this.isAccountlessChain) {
					await AccountService.addAccount(Account.fromJson({
						keypairUnique: keypair.unique(),
						networkUnique: this.network.unique(),
						publicKey: keypair.publicKeys.find(x => x.blockchain === this.network.blockchain).key
					}));
				}
				this.exportKey(keypair, true);
			},
			isCurrentlySelected(account){
				if(!this.currentlySelected) return false;
				return this.currentlySelected.identifiable() === account.identifiable();
			},
			async exportKey(keypair, bypassPassword = false){
				const unlocked = bypassPassword ? true : await new Promise(r => {
					PopupService.push(Popups.getPassword(async password => {
						if(!password) return r(false);
						if(window.wallet) r(await window.wallet.verifyPassword(password).catch(() => false));
					}));
				});

				if(unlocked){
					PopupService.push(Popups.exportPrivateKey(keypair))
				}
			},
			removeKey(keypair){
				PopupService.push(Popups.confirmDeleteKeypair(confirmed => {
					if(!confirmed) return;
					KeyPairService.removeKeyPair(keypair);
				}))
			},
			refreshAccounts(keypair){
				if(this.loadingAccounts[keypair.unique()]) return;

				this.loadingAccounts[keypair.unique()] = true;
				this.$forceUpdate();
				setTimeout(() => {
					delete this.loadingAccounts[keypair.unique()];
					this.$forceUpdate()
				}, 1000);
			},
			keyAccounts(keypair){
				if(!this.accounts[keypair.unique()]) return [];
				return this.accounts[keypair.unique()]
				// return keypair.accounts(true)
				// .filter(x => x.network().unique() === this.network.unique())
				.filter(x => {
					return x.sendable().toLowerCase().trim().indexOf(this.terms.toLowerCase().trim()) > -1;
				}).sort((a,b) => b.authority === 'active' ? 1 : 0).reduce((acc, account) => {
					if(!acc.find(x => x.sendable() === account.sendable())) acc.push(account);
					return acc;
				}, []);
			},
			addHardware(){
				// TODO: Need to add hardware importing
			},
			async select(account){
				const oldAccounts = this.network.accounts();
				if(oldAccounts.length) await AccountService.removeAccounts(oldAccounts);

				await AccountService.addAccount(account);
				SingularAccounts.setPredefinedAccount(this.network, account);
				BalanceService.loadBalancesFor(account);
				this.closer(true);
			},
			async checkTextKey(){

				const keypair = await KeyService.checkTextKey(this.privateKey, this.network.blockchain);
				this.loadingKey = false;

				if(keypair){
					this.privateKey = null;
					this.addingNewKey = false;
					await KeyPairService.saveKeyPair(keypair);
					await this.loadAccounts(keypair);
				}

				// this.error = null;
				// if(!this.privateKey || !this.privateKey.trim().length) return;
				// const key = this.privateKey.trim().replace(/\W/g, '').replace('0x', '');
				// const keypair = Keypair.placeholder();
				// keypair.privateKey = key;
				// if(!KeyPairService.isValidPrivateKey(keypair)) return;
				//
				//
				// // Buffer conversion
				// await KeyPairService.convertHexPrivateToBuffer(keypair);
				//
				// const blockchains = KeyPairService.getImportedKeyBlockchains(key);
				// if(!blockchains.includes(this.network.blockchain)){
				// 	this.loadingKey = false;
				// 	return PopupService.push(Popups.snackbar('This key does not match this network.'))
				// }
				//
				// keypair.blockchains = [this.network.blockchain];
				// await KeyPairService.makePublicKeys(keypair);
				// if(!keypair.publicKeys.find(x => x.blockchain === this.network.blockchain)) {
				// 	this.loadingKey = false;
				// 	return PopupService.push(Popups.snackbar('Error generating public keys.'));
				// }
				// keypair.setName();
				//
				// if(keypair.isUnique()) {
				// 	await KeyPairService.saveKeyPair(keypair);
				// 	await this.loadAccounts(keypair);
				// }
				//
				// this.privateKey = null;
				// this.loadingKey = false;
				// this.addingNewKey = false;
			},
			...mapActions([
				Actions.SET_BALANCES,
				Actions.REMOVE_BALANCES,
			])
		},
		watch:{
			['privateKey'](){
				clearTimeout(keyTimeout);
				keyTimeout = setTimeout(() => {
					this.checkTextKey();
				}, 500);
			},
		}
	}
</script>

<style lang="scss">
	@import "../../styles/variables";

	.edit-network-account {
		max-width:500px;
		width:calc(100% - 80px);
		margin:0 auto;

		.popup-content {
			padding:0;
		}

		.no-keys {
			padding:20px 0;

			img {
				width:180px;
				height:auto;
			}

			p {
				color:$grey;
				font-size: $font-size-small;
				font-weight: bold;
			}
		}

		.new-key {
			padding:20px;

			button {
				width:100%;
			}
		}

		.head {
			padding:20px;
			text-align:left;
			border-bottom:1px solid $borderlight;

			.texts {
				max-width:calc(100% - 80px);

				.title {
					font-size: $font-size-medium;
					font-weight: bold;
					margin:0;
				}

				.sub-title {
					margin-top:0;
					font-size: $font-size-small;
				}
			}

			.action {
				position:absolute;
				top:20px;
				right:20px;

				.bubble {
					width:40px;
					height:40px;
					background:$blue;
					color:white;
					font-size: 18px;
					display:flex;
					justify-content: center;
					align-items: center;
					border-radius:50%;
					cursor: pointer;

					transition: transform 0.2s ease;

					&:hover { transform:scale(1.1); }
					&:active { transform:scale(0.9); }

					&.active {
						transform:rotateZ(45deg);

						&:hover { transform:rotateZ(45deg) scale(1.1); }
						&:active { transform:rotateZ(45deg) scale(0.9); }
					}
				}
			}
		}

		.scroller {
			padding-bottom:40px;
			overflow-y:auto;
			max-height:320px;
		}

		.search {
			display:flex;
			align-items: center;
			padding:10px 20px;
			border-bottom:1px solid $borderlight;

			i {
				margin-right:10px;
				font-size: 11px;
			}

			input {
				border:0;
				outline:0;
				flex:1;
			}

		}

		.keys {
			padding:20px;

			.key {
				text-align:left;
				padding:10px;
				border:3px solid $borderlight;
				border-radius:4px;

				.public-key {
					font-size: $font-size-standard;
					word-break: break-word;
					font-weight: bold;
					color:$blue;
					margin-bottom:10px;
				}

				.accounts {
					margin-top:20px;

					button {
						width:100%;
						margin-top:5px;
					}
				}

				.actions {
					display:flex;
					justify-content: flex-end;

					button {
						padding:10px;
						height:auto;
						margin-left:5px;

						.icon {
							font-size: 13px;
						}
					}
				}
			}
		}
	}


</style>
