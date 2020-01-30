<template>
	<section class="export-private-key transfer">

		<section class="popup-content">
			<figure class="title" style="margin-bottom:10px;">{{blockchainName(keypair.blockchains[0])}} <span> Private Key</span></figure>
			<figure class="sub-title">Never give your private keys to <b><u>anyone</u></b>.</figure>

			<br><br>
			<figure class="line"></figure>
			<br><br>

			<section class="flex">
				<Input disabled="1" :text="privateKey" />
				<Button v-tooltip="`Copy key`" icon="fas fa-copy" @click.native="copyKey" />
			</section>
		</section>




		<section class="popup-buttons">
			<Button primary="1" @click.native="() => closer(null)" text="Close" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import {blockchainName} from '@walletpack/core/models/Blockchains'
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";

	export default {
		props:['popin', 'closer'],
		data(){return {
			privateKey:null,
		}},
		created(){
			if(window.wallet){
				window.wallet.getPrivateKey(this.keypair.id, this.keypair.blockchains[0]).then(privateKey => {
					if(!privateKey) this.closer(null);
					this.privateKey = privateKey;
				})
			}
		},
		computed:{
			keypair(){
				return this.popin.data.props.keypair
			}
		},
		methods:{
			copyKey(){
				window.wallet.utility.copy(this.privateKey);
				PopupService.push(Popups.snackbar('Your private key was copied to your clipboard.'))
			},
			blockchainName,
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.export-private-key {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;

		.sub-title {
			margin-top:10px;
		}

		input {
			font-size: 11px;
		}
	}


</style>
