<template>
	<section class="edit-network-account transfer">

		<section class="popup-content">
			<figure class="title" style="margin-bottom:10px;"><span>{{network.name}}</span> Account</figure>
			<figure class="sub-title">
				You can select an account from the list below to choose it as the default to use or add a new key to get access to more accounts.
			</figure>

			<Button v-if="!linking" @click.native="linking = true" text="Add More" style="width:100%; margin-top:20px;" primary="1" />
			<section v-if="linking" class="flex" style="margin-top:20px;">
				<Input :disabled="loadingKey" placeholder="Enter private key" :text="privateKey" v-on:changed="x => privateKey = x" style="margin-bottom:0;" />
				<Button disabled="1" text="Hardware" style="flex:0 0 auto;" />
			</section>

			<br><br>
			<figure class="line"></figure>
			<br>

			<SearchBar v-on:terms="x => terms = x" />

			<section class="items">
				<figure class="item" @click="select(account)" v-for="account in accounts">
					{{account.sendable()}}
				</figure>
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
	import Keypair from '@walletpack/core/models/Keypair'
	import KeyPairService from '@walletpack/core/services/secure/KeyPairService'
	import AccountService from '@walletpack/core/services/blockchain/AccountService'

	let keyTimeout;
	export default {
		props:['popin', 'closer'],
		data(){return {
			terms:'',
			privateKey:'',
			linking:false,
			loadingKey:false,
		}},
		created(){

		},
		computed:{
			network(){
				return this.popin.data.props.network
			},
			accounts(){
				return this.network.accounts().filter(x => {
					return x.sendable().toLowerCase().trim().indexOf(this.terms.toLowerCase().trim()) > -1;
				}).sort((a,b) => b.authority === 'active' ? 1 : 0).reduce((acc, account) => {
					if(!acc.find(x => x.sendable() === account.sendable())) acc.push(account);
					return acc;
				}, [])
			},
		},
		methods:{
			select(account){
				const oldAccount = SingularAccounts.accounts([this.network])[0];
				if(oldAccount.sendable() !== account.sendable()){
					this[Actions.REMOVE_BALANCES]([oldAccount.identifiable()])
				}

				SingularAccounts.setPredefinedAccount(this.network, account);
				BalanceService.loadBalancesFor(account);
				this.closer(true);
			},
			async checkTextKey(){

				this.error = null;
				if(!this.privateKey || !this.privateKey.trim().length) return;
				const key = this.privateKey.trim().replace(/\W/g, '').replace('0x', '');
				const keypair = Keypair.placeholder();
				keypair.privateKey = key;
				if(!KeyPairService.isValidPrivateKey(keypair)) return;

				this.loadingKey = true;

				// Buffer conversion
				await KeyPairService.convertHexPrivateToBuffer(keypair);

				const blockchains = KeyPairService.getImportedKeyBlockchains(key);
				if(!blockchains.includes(this.network.blockchain)){
					this.loadingKey = false;
					return PopupService.push(Popups.snackbar('This key does not match this network.'))
				}

				keypair.blockchains = [this.network.blockchain];
				await KeyPairService.makePublicKeys(keypair);
				if(!keypair.publicKeys.find(x => x.blockchain === this.network.blockchain)) {
					this.loadingKey = false;
					return PopupService.push(Popups.snackbar('Error generating public keys.'));
				}
				keypair.setName();

				if(keypair.isUnique()) {
					await KeyPairService.saveKeyPair(keypair);
					await AccountService.importAllAccounts(keypair, false, keypair.blockchains);
				}

				this.privateKey = null;
				this.loadingKey = false;
				this.linking = false;
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

<style scoped lang="scss">
	@import "../../styles/variables";

	.edit-network-account {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			margin-top:0;
			font-size: 9px;
		}


		.items {
			position: relative;
			min-height:150px;

			.item {
				cursor: pointer;
				margin-bottom:5px;
				border-radius:4px;
				border:1px solid $borderlight;
				padding:15px;
				display:flex;
				font-size: $font-size-standard;
				font-weight:bold;
				align-items: center;
				flex-direction:row;

				&:hover {
					color:white;
					background:$blue;
					border:1px solid $darkblue;
				}

			}
		}
	}


</style>
