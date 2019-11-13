<template>
	<section class="allow-restricted-apps">

		<section class="popup-content">

			<p>
				<b>
					We trust you to make the right choice for you.
				</b>
				<br>
				<br>
				You are about to enable the ability to view <u>Restricted Applications</u>.
				These applications might include things like online gambling or adult entertainment.
				Some of these applications might be restricted to your country, so keep that in mind.
			</p>

		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button primary="1" @click.native="() => closer(true)" text="Enable" />
		</section>

	</section>
</template>

<script>

	import {mapState} from "vuex";

	export default {
		props:['popin', 'closer'],
		data(){return {

		}},
		computed:{
			...mapState([
				'isMobile',
			])
		},
		mounted(){

		},
		destroyed(){

		},
		methods:{

		},
	}
</script>

<style scoped lang="scss">
	@import "../../../styles/variables";

	.allow-restricted-apps {
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

		.click-me {
			width:100%;
		}
	}


</style>
