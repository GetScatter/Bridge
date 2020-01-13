<template>
	<section class="import-hardware">
		<!--<label>Select Hardware Wallet</label>-->
		<!--<Select :selected="hardwareType" bordered="1"-->
		        <!--:options="externalWallets"-->
		        <!--v-on:selected="changeHardwareType" />-->

		<!--<br>-->

		<Input :disabled="gettingAvailableKeys" v-if="external" :text="external.addressIndex"
		       v-on:changed="x => external.addressIndex = x"
		       type="number"
		       label="Index number on your device where you key is located (0 is default)" />

		<section class="key-list">
			<Button :text="item.key" v-for="item in availableKeys" :key="item.index" @click.native="importKey(item)" primary="1" />
			<!--<section class="key-row" v-for="item in availableKeys" @click="importKey(item)">-->
				<!--<figure class="index">{{item.index}}</figure>-->
				<!--<figure class="key">{{item.key}}</figure>-->
			<!--</section>-->
		</section>

		<figure class="loading-keys" v-if="gettingAvailableKeys">
			<i class="icon-spin4 animate-spin"></i>
		</figure>
	</section>
</template>

<script>
	import ExternalWallet from '@walletpack/core/models/hardware/ExternalWallet';
	import {Blockchains, BlockchainsArray} from "@walletpack/core/models/Blockchains";
	import Keypair from "@walletpack/core/models/Keypair";
	import PopupService from "../../../services/utility/PopupService";
	import Popups from "../../../util/Popups";

	let inputTimeout;
	export default {
		props:['blockchain'],
		data(){return {
			hardwareType:null,
			external:null,

			gettingAvailableKeys:false,
			availableKeys:[],

			availableWallets:[],
		}},

		mounted(){
			window.wallet.hardwareTypes().then(types => {
				this.availableWallets = types;
				if(types.length) this.changeHardwareType(types[0].name);
			});

		},

		computed:{
			externalWallets(){
				return this.availableWallets.map(x => x.name);
			},
		},

		methods:{
			changeHardwareType(type){
				this.hardwareType = type;
				this.external = new ExternalWallet(this.hardwareType, this.blockchain);
			},
			async getKeys(){
				this.gettingAvailableKeys = true;
				this.availableKeys = [];

				const key = await window.wallet.hardwareKey(this.external.blockchain, parseInt(this.external.addressIndex));

				if(typeof key === 'object' && !Array.isArray(key) && key.hasOwnProperty('error')){
					PopupService.push(Popups.snackbar(key.error))
				} else {
					this.availableKeys = [{index:this.external.addressIndex, key}];
				}

				this.gettingAvailableKeys = false;
			},
			async importKey(item){
				// this.setWorkingScreen(true);
				const {index, key} = item;
				const keypair = Keypair.placeholder();
				keypair.external = this.external;
				keypair.blockchains = [this.external.blockchain];

				keypair.external.addressIndex = index;
				keypair.external.publicKey = key;
				keypair.publicKeys.push({blockchain:keypair.external.blockchain, key});

				if(!keypair.isUnique()) {
					// this.setWorkingScreen(false);
					return PopupService.push(Popups.snackbar('This key is already imported'));
				}

				setTimeout(() => this.$emit('imported', keypair), 1);
			}
		},

		watch:{
			['external.addressIndex'](){
				clearTimeout(inputTimeout);
				inputTimeout = setTimeout(() => {
					this.getKeys()
				}, 800);
			}
		}
	}

</script>


<style scoped lang="scss" rel="stylesheet/scss">
	@import "../../../styles/variables";

	.key-list {
		button {
			width:100%;
		}
	}


</style>
