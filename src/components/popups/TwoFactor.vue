<template>
	<section class="two-factor">

		<section class="popup-content" v-if="firstTime">

			<figure class="title">Enable <b>Two Factor Authentication</b></figure>

			<section class="qr">
				<img v-if="qr" :src="qr" />
				<div v-else>
					<i class="animate-spin fas fa-spinner"></i>
				</div>
			</section>

			<Input :loading="verifying" :disabled="!qr" big="1" label="Enter your authenticator code" :text="code" v-on:changed="x => code = x" />
		</section>

		<section class="popup-content" v-else>

			<figure class="title">Verify <b>Two Factor Authentication</b></figure>
			<figure class="sub-title">Open your authenticator app and type in the code below.</figure>
			<br>
			<br>
			<br>

			<Input big="1" label="Enter your authenticator code" :text="code" v-on:changed="x => code = x" />
		</section>

		<section class="popup-buttons">
			<Button secondary="1" @click.native="() => closer(null)" text="Cancel" />
			<Button :loading="verifying" @click.native="verify" text="Verify Code" />
		</section>

	</section>
</template>

<script>


	import {GET, POST} from "../../util/API";

	export default {
		props:['popin', 'closer'],
		data(){return {
			code:'',
			qr:null,
			verifying:false,
		}},
		mounted(){
			if(this.firstTime) setTimeout(() => {
				GET('2fa/setup').then(qr => {
					this.qr = qr;
				})
			}, 100);
		},
		computed:{
			firstTime(){
				return this.popin.data.props.firstTime
			},
		},
		methods:{
			verify(){
				this.verifying = true;
				POST('2fa/verify', {code:this.code}).then(res => {
					this.verifying = false;
					if(res) this.closer(true);
				})
			}
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.two-factor {
		max-width:400px;

		width:calc(100% - 80px);
		margin:0 auto;

		$qr:250px;
		.qr {
			padding:20px;

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

		.input {
			margin-bottom:0;
		}

	}


</style>