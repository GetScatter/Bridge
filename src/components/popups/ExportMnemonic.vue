<template>
	<section class="export-mnemonic transfer" :class="{'embedded':embedded}">

		<section class="popup-content" v-if="mnemonic">
			<figure v-if="!embedded" class="title" style="margin-bottom:10px;">Exporting <span>secret words</span></figure>
			<figure class="sub-title"><b>Write the words down, and <u>never give them to anyone</u>!</b></figure>

			<section class="mnemonic" v-if="mnemonic">
				<figure class="word" v-for="(word,i) in mnemonic.split(' ')"><b>{{i+1}}</b><span>{{word}}</span></figure>
			</section>
		</section>




		<section class="popup-buttons">
			<Button v-if="!embedded" primary="1" @click.native="() => closer(null)" text="Close" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import {blockchainName} from '@walletpack/core/models/Blockchains'
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";
	import KeyService from "../../services/utility/KeyService";
	import {mapState} from "vuex";
	import PluginRepository from '@walletpack/core/plugins/PluginRepository'

	export default {
		props:['popin', 'closer', 'embedded'],
		data(){return {
			mnemonic:null,
		}},
		computed:{
			...mapState([
				'scatter',
			])
		},
		created(){
			if(this.embedded) return this.mnemonic = this.embedded;
			if(window.wallet){
				const keypair = this.scatter.keychain.keypairs.find(x => x.base);
				if(!keypair) return;

				window.wallet.getPrivateKey(keypair.id, keypair.blockchains[0]).then(privateKey => {
					if(!privateKey) this.closer(null);
					this.mnemonic = KeyService.getMnemonic(PluginRepository.plugin(keypair.blockchains[0]).hexPrivateToBuffer(privateKey));
				})
			}
		},
		methods:{
			copyMnemonic(){
				window.wallet.utility.copy(this.mnemonic);
				PopupService.push(Popups.snackbar('Your words have been copied to your clipboard.'))
			},
			blockchainName,
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.export-mnemonic {
		max-width:500px;
		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			color:$red;
			margin-top:10px;
			font-size: $font-size-tiny;
		}

		&.embedded {
			max-width:none;
			width:100%;
		}

		&:not(.embedded){

			.sub-title {
				margin-top:-10px;
				margin-bottom:40px;
			}

		}

		.mnemonic {
			display:flex;
			flex-wrap: wrap;
			margin-top:10px;
			justify-content: center;

			.word {
				margin:1px;
				border-radius:4px;
				border:1px solid $opaqueblue;
				font-size: $font-size-standard;
				flex:1;
				display:flex;
				align-items: center;

				b {
					background:$borderlight;
					display:flex;
					align-items: center;
					height:100%;
					font-size: 9px;
					color:$blue;
					width:25px;
					justify-content: center;
				}

				span {
					padding:10px;
					display:inline-block;
				}

				&:hover {
					border:1px solid $blue;
				}
			}
		}
	}

	.blue-steel {
		.export-mnemonic {
			.mnemonic {
				.word {
					border:1px solid rgba(255, 255, 0, 0.37);

					b {
						background:$borderdark;
						color:yellow;
					}

					&:hover {
						border:1px solid yellow;
					}
				}
			}
		}
	}


</style>
