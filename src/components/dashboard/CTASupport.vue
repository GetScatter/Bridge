<template>
	<section class="dash-action-template">
		<section class="image">
			<img src="assets/onboarding_get_started.jpg" />
		</section>

		<section class="details">
			<figure class="above-title">Feeling bored?</figure>
			<figure class="title">You can help Scatter!</figure>
			<figure class="text">Scatter is a community initiative, and there's plenty to do. Click the button below to find out how you can use your knowledge and skills to help.</figure>
			<Button primary="1" text="I'd love to help!" @click.native="help" />
		</section>
	</section>
</template>

<script>
	import { mapState } from 'vuex'
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";
	require('../../styles/dash-actions.scss')

	export default {
		computed:{
			...mapState([
				'scatter'
			])
		},
		methods:{
			help(){
				window.wallet.utility.openLink('https://get-scatter.com/help-out');
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";
</style>
