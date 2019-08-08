<template>
	<section class="moonpay-code">

		<section class="popup-content">
			<MoonpayLogo class="logo" />
			<br>
			<br>
			<figure class="sub-title" style="margin-top:0px;">
				You will need to authenticate with MoonPay before you continue. You should have received a <u><b>security code</b></u> in your email.
			</figure>

			<br>
			<br>

			<Input big="1" label="Enter your MoonPay security code" :text="code" v-on:changed="x => code = x" />


		</section>

		<section class="popup-buttons">
			<Button secondary="1" @click.native="() => closer(null)" text="Cancel" />
			<Button @click.native="closer(code)" text="Authenticate" />
		</section>
	</section>
</template>

<script>
	import MoonpayLogo from '../../graphics/MoonpayLogo'

	export default {
		props:['popin', 'closer'],
		components:{
			MoonpayLogo
		},
		data(){return {
			code:'',
		}},

	}
</script>

<style scoped lang="scss">
	@import "../../../styles/variables";

	.moonpay-code {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;

		.logo {
			width:150px;
			height:50px;
		}


	}

</style>