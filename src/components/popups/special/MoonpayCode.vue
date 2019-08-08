<template>
	<section class="moonpay-code">

		<section class="popup-content">
			<MoonpayLogo class="logo" />
			<figure class="title" style="margin-bottom:10px;">Authenticate Moonpay</figure>
			<figure class="sub-title">
				You will need to authenticate with moonpay before you continue.
			</figure>

			<br>
			<br>

			<Input big="1" label="Moonpay security code" :text="code" v-on:changed="x => code = x" />


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