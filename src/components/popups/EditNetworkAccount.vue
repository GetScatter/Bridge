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
						<span v-if="!addingNewKey">Add key</span>
						<span v-if="addingNewKey">Back</span>
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
								<figure class="public-key">
									<figure class="key-text">{{key.publicKeys.find(x => x.blockchain === network.blockchain).key}}</figure>
									<figure class="warning" v-if="detachedKey(key)">
										This key is not attached to your mnemonic phrase (words).
										It will not import when you import your words. You should save this key manually.
									</figure>
								</figure>
								<section class="actions">
									<Button v-tooltip="`Copy public key`" icon="fa fa-copy" @click.native="copyPublicKey(key)" />
									<Button v-if="!key.external" v-tooltip="`Export private key`" icon="fa fa-key" @click.native="exportKey(key)" />
									<Button v-if="!key.external" v-tooltip="`Convert blockchains`" icon="fa fa-link" @click.native="convertKeypair(key)" />
									<Button v-if="!isAccountlessChain" v-tooltip="`Refresh accounts`" icon="fa fa-sync-alt" :loading="loadingAccounts[key.unique()]" @click.native="refreshAccounts(key)" />
									<Button v-if="detachedKey(key)" icon="fa fa-trash" v-tooltip="`Remove key`" @click.native="removeKey(key)" />
									<Button v-if="tappedCtrl" icon="fa fa-user" v-tooltip="`Manually Link Account`" @click.native="manuallyLinkAccount(key)" />
								</section>

								<section class="accounts">
									<section @click="select(account)"
									         :key="account.unique()"
									         class="account"
									         v-for="account in keyAccounts(key)"
									         :class="{'active':isCurrentlySelected(account)}">
										<span class="formatted">
											{{isAccountlessChain ? 'Use this address' : account.sendable()}}<span class="authority" v-if="account.authority">@{{account.authority}}</span>
										</span>
										<span class="dangerous-authority" v-if="isDangerous(account)">
											dangerous <i class="fas fa-ban"></i>
										</span>
										<span class="selected" v-if="isCurrentlySelected(account)">
											selected <i class="fas fa-check"></i>
										</span>
									</section>

									<section @click="select(null)" v-if="!keyAccounts(key).length"
									         :key="key.id"
									         class="account"
									         :class="{'active':!currentlySelected}">
										<span class="formatted">Use this key</span>
										<span class="selected" v-if="!currentlySelected">
											selected <i class="fas fa-check"></i>
										</span>
									</section>
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
			hardwareBlockchains:[],

			addingNewKey:false,

			terms:'',
			privateKey:'',
			loadingKey:false,
			loadingAccounts:{},

			accounts:{},
			tappedCtrl:false,
		}},
		beforeMount(){
			window.addEventListener("keydown", this.tapCtrl);
		},
		beforeDestroy(){
			window.removeEventListener("keydown", this.tapCtrl);
		},
		created(){
			this.keys.map(keypair => this.loadAccounts(keypair));

			if(this.importing){
				this.addingNewKey = true;
			}

			window.wallet.hardwareTypes()
				.then(x => this.canUseHardware = x.length && x.some(y => y.blockchains.find(b => b === this.network.blockchain)))
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
			},
			hasMnemonic(){
				return !!this.scatter.keychain.keypairs.find(x => x.base);
			}
		},
		methods:{
			async manuallyLinkAccount(keypair){
				PopupService.push(Popups.getInput('Manually Link Account', 'If you link an account that does not actually belong to this key, you will not be able to sign anything.', 'account name', 'What is the account name?', async name => {
					if(!name || !name.length) return;
					let [account_name, permission] = name.split('@');
					if(!permission || !permission.length) permission = 'active';

					this.select(Account.fromJson({
						keypairUnique: keypair.unique(),
						networkUnique: this.network.unique(),
						name:account_name,
						permission,
						publicKey: keypair.publicKeys.find(x => x.blockchain === this.network.blockchain).key
					}));
				}))
			},
			tapCtrl(event){
				if (event.keyCode === 17) {
					this.tappedCtrl = !this.tappedCtrl;
				}
			},
			detachedKey(keypair){
				return !keypair.base;
			},
			async loadAccounts(keypair){
				const loadedAccount = SingularAccounts.accounts([this.network])[0];
				let accounts = await AccountService.getAccountsFor(keypair, this.network);

				if(loadedAccount && loadedAccount.keypairUnique === keypair.unique() && !accounts.find(x => x.unique() === loadedAccount.unique())){
					accounts.unshift(loadedAccount);
				}

				if(keypair.blockchains.includes('fio')){
					const plugin = PluginRepository.plugin('fio');
					const publicKey = keypair.publicKeys.find(x => x.blockchain === this.network.blockchain).key;
					const fioAddresses = await plugin.getNames(this.network, publicKey).catch(err => {
						console.error("Error getting FIO addresses", err);
						return false;
					}).then(x => x.fio_addresses);

					if(fioAddresses){
						accounts = [];
						fioAddresses.map(x => {
							accounts.unshift(Account.fromJson({
								keypairUnique: keypair.unique(),
								networkUnique: this.network.unique(),
								publicKey,
								account_hash:plugin.accountHash(publicKey),
								name:x.fio_address.split('@')[0],
								authority:x.fio_address.split('@')[1],
								fio_address:x.fio_address
							}));
						})
					}
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

				this.exportKey(keypair, true);

				// We don't need to tap chain here, since eosio networks won't automatically add an account.
				if(this.isAccountlessChain) {
					const account = Account.fromJson({
						keypairUnique: keypair.unique(),
						networkUnique: this.network.unique(),
						publicKey: keypair.publicKeys.find(x => x.blockchain === this.network.blockchain).key
					});
					await AccountService.addAccount(account);

					this.select(account, false);
				}

				await this.loadAccounts(keypair);
				this.loadingKey = false;
				this.addingNewKey = false;
			},
			isDangerous(account){
				return account.authority && account.authority === 'owner';
			},
			isCurrentlySelected(account){
				if(!this.currentlySelected) return false;
				if(account.fio_address) return this.currentlySelected.fio_address === account.fio_address;
				return this.currentlySelected.unique() === account.unique();
			},
			async copyPublicKey(keypair){
				window.wallet.utility.copy(keypair.publicKeys.find(x => x.blockchain === this.network.blockchain).key);
				PopupService.push(Popups.snackbar('Your public key was copied to your clipboard.'))
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
				if(keypair.base) return PopupService.push(Popups.snackbar('This is a base key which belongs to your seed, you can not remove it.'));
				PopupService.push(Popups.confirmDeleteKeypair(confirmed => {
					if(!confirmed) return;
					KeyPairService.removeKeyPair(keypair);
				}))
			},
			async refreshAccounts(keypair){
				if(this.loadingAccounts[keypair.unique()]) return;

				this.loadingAccounts[keypair.unique()] = true;
				delete this.accounts[keypair.unique()];
				this.$forceUpdate();
				await this.loadAccounts(keypair);
				delete this.loadingAccounts[keypair.unique()];
				this.$forceUpdate();
			},
			keyAccounts(keypair){
				if(!this.accounts[keypair.unique()]) return [];
				return this.accounts[keypair.unique()]
					.filter(x => x.sendable().toLowerCase().trim().indexOf(this.terms.toLowerCase().trim()) > -1)
					// .sort((a,b) => b.authority === 'active' ? 1 : a.authority === 'active' ? -1 : 0)
					.sort((a,b) => a.sendable() > b.sendable() ? 1 : b.sendable() > a.sendable() ? -1 : 0)
					.sort((a,b) => this.isCurrentlySelected(b) ? 1 : this.isCurrentlySelected(a) ? -1 : 0);
			},
			async select(account, close = true){
				const oldAccounts = this.network.accounts();
				if(oldAccounts.length) await AccountService.removeAccounts(oldAccounts);

				if(account) {
					if (this.network.blockchain === 'fio' && account.account_hash) {
						account.fio_address = account.formatted();
						account.name = account.account_hash;
						delete account.account_hash;
						account.authority = 'active';
					}

					await AccountService.addAccount(account);
					SingularAccounts.setPredefinedAccount(this.network, account);
					BalanceService.loadBalancesFor(account);
				} else {
					SingularAccounts.setPredefinedAccount(this.network, account);
				}

				if(close) this.closer(true);
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
			},
			convertKeypair(keypair){
				PopupService.push(Popups.convertKeypair(keypair, converted => {
					if(converted) PopupService.push(Popups.snackbar("Conversion successful. Check the network for the corresponding blockchain."))
				}));
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
					padding:6px 12px;
					background:$blue;
					color:white;
					font-size: $font-size-tiny;
					display:flex;
					justify-content: center;
					align-items: center;
					border-radius:4px;
					cursor: pointer;

					backface-visibility: hidden;

					transition: background 0.2s ease;

					&:hover { background:$darkblue; }
					&:active { background:$blue; }
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
				margin-bottom:20px;

				.public-key {
					margin-bottom:10px;

					.key-text {
						font-size: $font-size-tiny;
						word-break: break-word;
						font-weight: bold;
						color:$blue;
						border-bottom:1px solid $borderlight;
						padding-bottom:10px;
					}

					.warning {
						font-size: $font-size-tiny;
						border:2px solid $red;
						color:$red;
						font-weight: bold;
						padding:5px 10px;
						border-radius:4px;
						margin-top:5px;
						display:table;
					}
				}

				.accounts {
					margin-top:10px;

					.account {
						cursor: pointer;
						width:100%;
						margin-top:5px;
						padding:10px;
						border-radius:4px;
						display:flex;
						align-items: center;
						font-size: $font-size-small;
						background:$lightblue;
						height:40px;

						span {
							flex:1;

							&:not(:first-child) {
								flex:0 0 auto;
								background:$blue;
								border-radius:4px;
							}
						}

						.selected {
							margin-left:10px;
						}

						.dangerous-authority {
							background:$red !important;
							font-size: $font-size-tiny;
							padding:5px 5px 5px 7px;
							color:white;
							display:flex;
							align-items: center;

							i {
								margin-left:4px;
							}
						}

						.formatted {
							.authority {
								color:$blue;
							}
						}

						&:hover, &.active {
							background:$blue;
							color:white;
							box-shadow:0 1px 2px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1);

							.dangerous-authority {
								background:white !important;
								color:$red;
							}

							.formatted {
								.authority {
									color:white;
								}
							}
						}

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

	.blue-steel {
		.edit-network-account {
			.head {
				border-bottom: 1px solid $borderdark;
			}
			.search {
				border-bottom: 1px solid $borderdark;
			}
			.keys {

				.key {
					border: 3px solid $borderdark;

					.public-key {

						.key-text {
							border-bottom:1px solid $borderdark;
						}
					}
				}
			}
			.accounts {
				border-top:3px solid $borderdark;
			}
		}
	}


</style>
