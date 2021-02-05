<template>
	<section class="export-private-key transfer">

		<section class="popup-content">
			<figure class="title" style="margin-bottom:10px;">Exporting <span> Private Key</span></figure>
			<figure class="sub-title">Never give your private keys to <b>anyone</b></figure>

			<br><br>
			<figure class="line"></figure>
			<br><br>

			<section class="flex">
				<Input disabled="1" :text="privateKey" />
				<Button v-tooltip="`Copy key`" icon="fas fa-copy" @click.native="copyKey" />
			</section>

			<section class="qr">
				<img v-if="qr" :src="qr" />
				<div v-else>
					<i class="animate-spin fas fa-spinner"></i>
				</div>
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
	import QRService from "../../services/utility/QRService";

	export default {
		props:['popin', 'closer'],
		data(){return {
			privateKey:null,
			qr:null,
		}},
		async created(){
			if(window.wallet){
				window.wallet.getPrivateKey(this.keypair.id, this.keypair.blockchains[0]).then(async privateKey => {
					if(!privateKey) this.closer(null);
					this.privateKey = privateKey;
					this.qr = await QRService.createQR(privateKey);
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

		$qr:120px;
		.qr {
			display:inline-block;
			height:$qr;
			width:$qr;
			background:red;

			img {
				height:$qr;
				width:$qr;
			}

			div {
				height:$qr;
				width:$qr;
				font-size: 48px;
				display:flex;
				justify-content: center;
				align-items: center;
				margin:0 auto;
				color:$grey;
			}
		}

		.sub-title {
			background:$red;
			padding:5px 10px;
			color:white;
			border-radius:4px;
			font-size: $font-size-standard;
			display:table;
			margin:0 auto;

			animation: important 1s ease infinite;
		}

		@keyframes important {
			0%, 100% {
				transform:translateX(-5px);
			}
			50% {
				transform:translateX(5px);
			}
		}

		input {
			font-size: 11px;
		}
	}


</style>
