<template>
	<section class="two-factor">

		<section class="popup-content" v-if="firstTime">

			<figure class="title">Enable <b>Two Factor Authentication</b>?</figure>
			<figure class="sub-title">Enabling multiple factors of authentication keeps you safer, <b>we highly recommend it</b>.</figure>

			<section class="qr">
				<img v-if="qr" :src="qr" />
			</section>

			<Input big="1" label="Enter your current authenticator code" :text="code" v-on:changed="x => code = x" />
		</section>

		<section class="popup-content" v-else>

			<figure class="title">Verify <b>Two Factor Authentication</b></figure>
			<figure class="sub-title">Open your authenticator app and type in the code below.</figure>
			<br>
			<br>
			<br>

			<Input big="1" label="Enter your current authenticator code" :text="code" v-on:changed="x => code = x" />
		</section>

		<section class="popup-buttons">
			<Button secondary="1" @click.native="() => closer(null)" text="Cancel" />
			<Button @click.native="verify" text="Verify Code" />
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
		}},
		mounted(){
			if(this.firstTime) GET('2fa/disable').then(() => {
				GET('2fa/setup').then(qr => {
					this.qr = qr;
				})
			})
		},
		computed:{
			firstTime(){
				return this.popin.data.props.firstTime
			},
		},
		methods:{
			verify(){
				POST('2fa/verify', {code:this.code}).then(res => {
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

		.qr {
			padding:20px;
			display:flex;
			justify-content: center;
			align-items: center;

			$qr:250px;
			img {
				height:$qr;
				width:$qr;
			}
		}

		.input {
			margin-bottom:0;
		}

	}


</style>