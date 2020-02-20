<template>
	<section class="convert-keypair">

		<section class="popup-content">

			<figure class="title">Converting <span>keypair</span></figure>
			<figure class="sub-title">
				This will allow you to convert a keypair to another blockchain.
				Simply click on a blockchain below and Scatter will convert your key for you.
			</figure>

			<br>
			<br>
			<figure class="line"></figure>
			<br>
			<br>

			<section class="blockchains" v-if="blockchains.length">
				<Button :text="blockchainName(blockchain)"
				        class="blockchain"
				        v-for="blockchain in blockchains"
				        @click.native="convert(blockchain)" />
			</section>

			<section class="blockchains" v-if="!blockchains.length">
				You have already converted this key for every available blockchain
			</section>

		</section>

		<section class="popup-buttons">
			<Button primary="1" @click.native="closer(null)" text="Cancel" />
			<!--<Button @click.native="closer(true)" icon="fas fa-exclamation-triangle" text="Delete" />-->
		</section>

	</section>
</template>

<script>

	import {mapState} from "vuex";
	import KeyPairService from '@walletpack/core/services/secure/KeyPairService'
	import {blockchainName} from "@walletpack/core/models/Blockchains";
	import Keypair from '@walletpack/core/models/Keypair'

	export default {
		props:['popin', 'closer'],
		data(){return {
			blockchainName
		}},
		computed:{
			...mapState([
				'scatter'
			]),
			keypair(){
				return this.popin.data.props.keypair;
			},
			currentChain(){
				return this.keypair.blockchains[0];
			},
			publicKey(){
				return this.keypair.publicKeys.find(k => k.blockchain === this.currentChain).key
			},
			blockchains(){
				const alreadyConverted = this.scatter.keychain.keypairs.filter(x => x.publicKeys.find(k => k.blockchain === this.currentChain).key === this.publicKey).map(x => x.blockchains[0]);
				return this.keypair.publicKeys.map(x => x.blockchain)
					.filter(x => !alreadyConverted.includes(x))
			},
		},
		methods:{
			async convert(blockchain){
				if(!blockchain) return;
				console.log(this.scatter.keychain.keypairs);
				const clone = KeyPairService.convertKey(Keypair.fromJson(this.keypair), blockchain);
				await KeyPairService.saveKeyPair(clone);
				return this.closer(clone);
			},
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.convert-keypair {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			margin-top:-20px;
			font-size: $font-size-small;
		}

		.blockchains {
			.blockchain {
				width:100%;
			}
		}
	}


</style>
