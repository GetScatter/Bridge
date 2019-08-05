<template>
	<section class="scan-qr">

		<section class="popup-content">

			<figure class="title">Scan <span>QR Code</span></figure>
			<figure class="sub-title">Place your camera over the QR code and it will automatically scan it.</figure>

			<figure class="line"></figure>

			<section class="qr loading" v-if="loading">
				<i class="animate-spin fas fa-spinner"></i>
			</section>
			<qrcode-stream ref="qr" class="qr" v-show="!loading" @decode="qrScanned" />

		</section>

		<section class="popup-buttons">
			<Button secondary="1" @click.native="() => closer(null)" text="Cancel" />
		</section>

	</section>
</template>

<script>

	let interval;
	export default {
		props:['popin', 'closer'],
		data(){return {
			loading:true
		}},
		mounted(){
			interval = setInterval(() => {
				if(this.$refs.qr.cameraInstance){
					clearInterval(interval);
					this.loading = false;
				}
			}, 50);
		},
		destroyed(){
			clearInterval(interval);
		},
		methods:{
			qrScanned(qr){
				this.closer(qr);
			}
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.scan-qr {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;
		
		.sub-title {
			margin-top:-20px;
		}

		.line {
			margin-top:40px;
			margin-bottom:40px;
		}

		.qr {
			border-radius:4px;
			overflow:hidden;
			width:100%;
			height:220px;
			line-height:220px;
			background:$blue-gradient;
			text-align:center;
			font-size: 48px;

			i {
				color:#fff;
			}
		}
	}


</style>