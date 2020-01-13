<template>
	<section class="dash-action-template">
		<section class="image">
			<img src="assets/onboarding_verify_identity.jpg" />
		</section>

		<section class="details">
			<figure class="above-title">Upgrade yourself</figure>
			<figure class="title">Verify your Identity</figure>
			<figure class="text">This will unlock premium features, and allow you access to apps you couldn't use before.</figure>
			<Button primary="1" text="I'm real!" @click.native="verify" />
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
			verify(){
				PopupService.push(Popups.kyc(this.scatter.keychain.identities[0]))
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";
</style>
