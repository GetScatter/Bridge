<template>
	<section class="moonpay-code">

		<section class="popup-content">
			<MoonpayLogo class="logo" />
			<br>
			<br>
			<figure class="sub-title" style="margin-top:0px;">
				You will need to authenticate with MoonPay before you continue. You should have received a <u><b>security code</b></u> in your email.

			</figure>

			<figure class="terms">
				By authenticating you are agreeing to
				<u><a href="https://www.moonpay.io/terms_of_use" target="_blank">MoonPay's Terms of Use</a></u>
			</figure>

			<Input big="1" placeholder="0000" label="Enter your MoonPay security code" :text="code" v-on:changed="x => code = x" />


		</section>

		<section class="popup-buttons">
			<Button secondary="1" @click.native="() => closer(null)" text="Cancel" />
			<Button primary="1" @click.native="closer(code)" text="Authenticate" />
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

		.terms {
			margin:50px auto;
			font-size: $font-size-small;
			font-weight: bold;
			max-width:80%;
			a {
				color:$blue;
			}
		}

		.input {
			margin:0;
		}


	}

	.blue-steel {
		.moonpay-code {
			.logo {
				fill:#fff;
			}
		}
	}

</style>