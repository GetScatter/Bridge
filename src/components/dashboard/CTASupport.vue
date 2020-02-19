<template>
	<section class="dash-action-template dash-support">
		<section class="dash-action-template-header">
			<figure class="everipedia">
				<img src="static/assets/scatter_logo.svg" alt="">
			</figure>
			<figure class="above-title">
				Get involved!
			</figure>
		</section>

		<section class="dash-action-template-content">
			<section>
				<figure class="title">Make a difference.</figure>
				<figure class="text">Scatter is a community initiative, and there's plenty to do, no matter what your skill-set is.</figure>
			</section>
			<img style="width:100px; margin-left:20px;" src="static/assets/identity.svg" alt="">
		</section>

		<section class="dash-action-template-footer">
			<Button primary="1" text="How can I help?" @click.native="help" />
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
				// this.scatter.onboarded = false;
				window.wallet.utility.openLink('https://medium.com/getscatter/scatter-worker-proposal-fund-1b2deec54084');
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.dash-support {
		background-image: linear-gradient(180deg, #B6E1FF 12%, #fff4f4 95%);
	}

	.blue-steel {
		.dash-support {
			background-image: linear-gradient(180deg, #0b0d26 12%, transparent 95%);
		}
	}
</style>
