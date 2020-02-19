<template>
	<section class="change-id-key">

		<section class="popup-content">

			<figure class="title">Changing <span>identity key</span></figure>
			<figure class="sub-title">Your identity's key is used to prove authenticity. Changing this key while you have an identity linked will also change the key linked to the identity.</figure>

			<br>
			<br>
			<span class="public-key" v-if="publicKey">{{formattedPublicKey}}</span>
			<section class="flex">
				<Input :text="privateKey" style="margin-bottom:0;" type="password" placeholder="Enter a private key" v-on:changed="x => privateKey = x" />
				<i v-if="tooltip" class="key-status" v-tooltip="tooltip" :class="keypair ? 'blue fas fa-check' : 'red fas fa-times'"></i>
			</section>
			<section class="flex">
				<Button text="Copy private key" :disabled="!publicKey" style="margin-top:5px;" @click.native="copyKey" />
				<Button text="Create random key" style="margin-left:5px; margin-top:5px;" primary="1" @click.native="randomize" />
			</section>
		</section>

		<section class="popup-buttons">
			<Button @click.native="closer(null)" text="Cancel" />
			<Button :disabled="!keypair" primary="1" @click.native="change" icon="fas fa-check" text="Change key" />
		</section>

	</section>
</template>

<script>

	import KeyService from "../../services/utility/KeyService";
	import Keypair from '@walletpack/core/models/Keypair';
	import KeyPairService from '@walletpack/core/services/secure/KeyPairService';
	import {Blockchains} from '@walletpack/core/models/Blockchains'
	import {mapState} from "vuex";
	import PluginRepository from '@walletpack/core/plugins/PluginRepository';
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";

	let keyTimeout;
	export default {
		props:['popin', 'closer'],
		data(){return {
			privateKey:'',
			keypair:null,
			rawPrivateKey:null,
		}},
		computed:{
			...mapState([
				'scatter',
			]),
			publicKey(){
				if(!this.keypair) return null;
				return this.keypair.publicKeys.find(x => x.blockchain === Blockchains.EOSIO).key;
			},
			formattedPublicKey(){
				return this.publicKey.replace('EOS', 'ID_KEY_');
			},
			tooltip(){
				if(!this.privateKey.length) return null;
				if(this.keypair) return 'Key is valid';
				else return 'Key is not valid'
			}
		},
		mounted(){

		},
		methods:{
			copyKey(){
				window.wallet.utility.copy(this.privateKey);
				PopupService.push(Popups.snackbar(`Private key has been copied to your clipboard.`))
			},
			async randomize(){
				this.keypair = null;
				this.privateKey = ' ';
				const keypair = Keypair.placeholder();
				keypair.blockchains = [Blockchains.EOSIO];
				await KeyPairService.generateKeyPair(keypair);
				await KeyPairService.makePublicKeys(keypair);
				this.keypair = keypair;
				this.rawPrivateKey = this.keypair.privateKey;
				this.privateKey = PluginRepository.plugin(Blockchains.EOSIO).bufferToHexPrivate(this.keypair.privateKey);
			},
			async checkTextKey(){
				this.keypair = await KeyService.checkTextKey(this.privateKey, Blockchains.EOSIO);
				this.rawPrivateKey = this.keypair.privateKey;
			},
			async change(){
				this.closer({
					publicKey:this.publicKey,
					privateKey:this.rawPrivateKey,
				})
			}
		},
		watch:{
			['privateKey'](){
				this.keypair = null;
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

	.change-id-key {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			margin-top:-20px;
			font-size: $font-size-small;
		}

		.public-key {
			font-size: 9px;
			text-align:left;
			display:block;
			margin-bottom:5px;
			color:$blue;
			font-weight: bold;
		}

		.key-status {
			height:44px;
			display:flex;
			align-items: center;
			justify-content: flex-end;
			margin-left:10px;
			width:25px;

			&.blue {
				color:$blue;
			}

			&.red {
				color:$red;
			}
		}
	}


</style>
