<template>
	<section class="import-keys">

		<section class="popup-content">
			<figure class="title">Let's <span>import</span> some <span>keys</span>.</figure>
			<figure class="sub-title">Leave inputs blank to have a key generated for that blockchain instead</figure>

			<ImportHardware v-if="importingHardware" :blockchain="importingHardware" v-on:imported="importedHardware" />

			<section class="scroller">
				<section class="keys">
					<section class="key" v-for="blockchain in blockchains">
						<label>{{blockchainName(blockchain)}}</label>
						<section class="flex">
							<Input :disabled="keys[blockchain]" :type="keys[blockchain] ? 'password' : 'text'" v-on:changed="x => checkKey(x, blockchain)" placeholder="Enter a private key" />
							<figure v-tooltip="`Hardware`" v-if="hasHardware(blockchain) && !keys[blockchain]" class="icon-button fab fa-usb" @click="importingHardware = blockchain"></figure>
							<i :class="{'accepted':keys[blockchain]}" class="fa fa-circle"></i>
						</section>

					</section>
				</section>
			</section>

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button :disabled="!hasKeys" @click.native="done" text="Done" icon="fas fa-check" primary="1" />
		</section>

	</section>
</template>

<script>
	import Vue from 'vue';
	import "../../styles/transfers.scss";
	import {mapActions, mapState} from "vuex";
	import * as UIActions from '../../store/ui_actions';
	import {blockchainName, BlockchainsArray, Blockchains} from '@walletpack/core/models/Blockchains'
	import KeyService from "../../services/utility/KeyService";
	import KeyPairService from '@walletpack/core/services/secure/KeyPairService';
	import AccountService from '@walletpack/core/services/blockchain/AccountService';
	import SingularAccounts from "../../services/utility/SingularAccounts";

	export default {
		props:['popin', 'closer'],
		components:{
			ImportHardware:() => import('./importable/ImportHardware'),
		},
		data(){return {
			blockchainName,
			importingHardware:'eos',
			keys:BlockchainsArray.reduce((acc,x) => {
				acc[x.value] = null;
				return acc;
			}, {}),
		}},
		computed:{
			...mapState([
				'scatter',
			]),
			blockchains(){
				return BlockchainsArray.map(x => x.value);
			},
			keysArr(){
				return Object.keys(this.keys).map(key => this.keys[key]).filter(x => !!x);
			},
			hasKeys(){
				return this.keysArr.length;
			}
		},
		methods:{
			hasHardware(blockchain){
				switch(blockchain){
					case Blockchains.EOSIO:
					case Blockchains.ETH:
						return true;
					default: return false;
				}
			},
			importedHardware(){},
			async checkKey(privateKey, blockchain){
				this.keys[blockchain] = null;
				const keypair = await KeyService.checkTextKey(privateKey, blockchain);
				if(keypair) this.keys[blockchain] = keypair;
			},
			async done(){
				await Promise.all(this.keysArr.map(async keypair => {
					await KeyPairService.saveKeyPair(keypair);
					const networks = this.scatter.settings.networks.filter(x => x.blockchain === keypair.blockchains[0]);
					await Promise.all(networks.map(async network => {
						const accounts = await AccountService.getAccountsFor(keypair, network);
						if(accounts.length){
							AccountService.addAccount(accounts[0]);
							SingularAccounts.setPredefinedAccount(network, accounts[0]);
						}
						return true;
					}));

					return true;
				}));

				this.closer(true);
			},
			...mapActions([
				UIActions.RELEASE_POPUP
			])
		},
	}
</script>

<style lang="scss">
	@import "../../styles/variables";

	.import-keys {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;
		position: relative;

		.sub-title {
			margin-top:-20px !important;
			font-size: $font-size-standard !important;
			color:$blue !important;
		}

		.scroller {
			margin-top:20px;
			max-height:250px;
			overflow-y: auto;

		}

		.keys {
			.key {
				text-align:left;

				&:not(:first-child){
					margin-top:5px;
				}

				label {
					font-size: $font-size-tiny;
					color:$grey;
				}

				.flex {
					align-items: center;
				}

				.input {
					margin-bottom:0;

					input {
						height:30px;
						padding:0 8px;
						font-size: $font-size-tiny;
					}
				}

				i {
					color:$grey;
					opacity:0.2;

					&.accepted {
						color:$blue;
						opacity:1;
					}
				}

				.icon-button {
					cursor: pointer;
					border:1px solid $grey;
					color:$grey;
					height:30px;
					padding:0 5px;
					border-radius:4px;
					display:flex;
					align-items: center;

					&:hover {
						color:$blue;
						border:1px solid $blue;
					}
				}
			}
		}
	}

	.blue-steel {
		.import-keys {

		}
	}

</style>
