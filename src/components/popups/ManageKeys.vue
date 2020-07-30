<template>
	<section class="edit-network-account transfer">

		<section class="popup-content">
			<section class="head">

				<section class="texts" v-if="!addingNewKey">
					<figure class="title">Manage your keys</figure>
					<figure class="sub-title">
						Keys are what control your decentralized accounts. If you lose them, or give them away, it's bad. So be careful with them and never share them!
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
				<section v-if="scatter.keychain.keypairs.length">
					<section class="search">
						<i class="fa fa-search"></i>
						<input v-model="terms" />
					</section>

					<section class="scroller">

						<section class="keys">
							<section class="key" :class="{'phrase':!detachedKey(key)}" :key="key.id" v-for="key in filteredKeys">
								<figure class="public-key">
									<figure class="key-text">{{key.publicKeys.find(x => x.blockchain === key.blockchains[0]).key}}</figure>
									<figure class="phrase-key" v-if="!detachedKey(key)">linked to phrase</figure>
									<figure class="phrase-key" v-if="key.external">hardware</figure>
								</figure>
								<section class="actions">
									<section class="left">
										<figure class="accounts">{{linkedAccounts(key)}} linked accounts</figure>
									</section>
									<section class="right">
										<Button v-tooltip="`Copy public key`" icon="fal fa-copy" @click.native="copyPublicKey(key)" />
										<Button v-if="!key.external" v-tooltip="`Convert blockchains`" icon="fal fa-link" @click.native="convertKeypair(key)" />
										<Button v-if="detachedKey(key)" icon="fal fa-ban" v-tooltip="`Remove key`" @click.native="removeKey(key)" />
										<Button primary="1" v-if="!key.external" text="Export" icon="fal fa-key" @click.native="exportKey(key)" />
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
			<Button v-if="addingNewKey" @click.native="toggleAddingKey" text="Back" />
			<Button primary="1" v-if="!addingNewKey" @click.native="() => closer(null)" text="Close" />
			<Button v-if="!addingNewKey"  @click.native="toggleAddingKey" text="Create or Import a Key" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import {BlockchainsArray, blockchainName} from '@walletpack/core/models/Blockchains'
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
	import * as UIActions from "../../store/ui_actions";

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
			blockchain:null,

			tappedCtrl:false,
		}},
		beforeMount(){
			window.addEventListener("keydown", this.tapCtrl);
		},
		beforeDestroy(){
			window.removeEventListener("keydown", this.tapCtrl);
		},
		created(){
			if(this.importing){
				this.addingNewKey = true;
			}

		},
		computed:{
			...mapState([
				'scatter',
				'accountCache',
			]),
			importing(){
				return this.popin.data.props.importing
			},
			hasMnemonic(){
				return !!this.scatter.keychain.keypairs.find(x => x.base);
			},
			filteredKeys(){
				return this.scatter.keychain.keypairs.sort((a,b) => {
					return this.linkedAccounts(b) - this.linkedAccounts(a);
				});
			}
		},
		methods:{
			linkedAccounts(keypair){
				return Object.keys(this.accountCache).reduce((acc, network) => {
					return acc + this.accountCache[network].filter(x => x.keypairUnique === keypair.unique()).length;
				}, 0);
			},
			detachedKey(keypair){
				return !keypair.base;
			},
			async importedHardware(keypair){
				if(keypair.isUnique()) {
					await KeyPairService.saveKeyPair(keypair);
					await SingularAccounts.refreshAccounts(this.scatter.settings.networks.filter(x => x.blockchain === this.blockchain), [keypair]);
					this.importingHardware = false;
					this.loadingKey = false;
					this.addingNewKey = false;
				}
			},
			toggleAddingKey(){
				if(!this.addingNewKey){
					PopupService.push(Popups.selectList('Select a <span>Blockchain</span>', 'Select the type of blockchain you want to either create or import a key for.', BlockchainsArray, x => {
						return blockchainName(x.value);
					}, async blockchain => {
						if(!blockchain) return;
						this.blockchain = blockchain.value;

						await window.wallet.hardwareTypes()
							.then(x => this.canUseHardware = x.length && x.some(y => y.blockchains.find(b => b === this.blockchain)))
							.catch(() => this.canUseHardware = false);

						this.addingNewKey = true;
						this.importingHardware = false;
					}));
				} else {
					this.addingNewKey = !this.addingNewKey;
					this.importingHardware = false;
				}
			},
			async generateKey(){
				const keypair = Keypair.placeholder();
				keypair.blockchains = [this.blockchain];
				await KeyPairService.generateKeyPair(keypair);
				await KeyPairService.makePublicKeys(keypair);
				keypair.setName();
				await KeyPairService.saveKeyPair(keypair);
				await SingularAccounts.refreshAccounts(this.scatter.settings.networks.filter(x => x.blockchain === this.blockchain), [keypair]);

				this.exportKey(keypair, true);

				this.loadingKey = false;
				this.addingNewKey = false;
			},
			async copyPublicKey(keypair){
				window.wallet.utility.copy(keypair.publicKeys.find(x => x.blockchain === this.blockchain).key);
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

					const cache = this.accountCache;
					Object.keys(cache).map(network => {
						this[UIActions.SET_ACCOUNT_CACHE]({key:network, value:cache[network].filter(x => x.keypairUnique !== keypair.unique())});
					});
				}))
			},
			async checkTextKey(){

				const keypair = await KeyService.checkTextKey(this.privateKey, this.blockchain);
				this.loadingKey = false;

				if(keypair){
					this.privateKey = null;
					this.addingNewKey = false;
					await KeyPairService.saveKeyPair(keypair);
					await SingularAccounts.refreshAccounts(this.scatter.settings.networks.filter(x => x.blockchain === this.blockchain), [keypair]);
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
				UIActions.SET_ACCOUNT_CACHE,
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
		max-width:700px;
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
				border:1px solid $blue;
				border-radius:4px;
				margin-bottom:10px;
				overflow:hidden;

				.public-key {
					background:$blue;
					padding:5px 10px;
					color:white;
					display:flex;
					justify-content: space-between;
					align-items: center;

					.key-text {
						font-size: $font-size-tiny;
						word-break: break-word;
					}

					.fingerprint {
						font-size: 14px;
					}

					.phrase-key {
						font-size: 9px;
					}
				}

				&.phrase {
					border:1px solid $darkblue;

					.public-key {
						background: $darkblue;
					}
				}

				.actions {
					padding:10px;
					display:flex;
					justify-content: space-between;
					align-items: center;

					.left {
						.accounts {
							font-size: $font-size-small;
						}
					}

					.right {
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

					.public-key {

					}
				}
			}
			.accounts {
				border-top:3px solid $borderdark;
			}
		}
	}


</style>
