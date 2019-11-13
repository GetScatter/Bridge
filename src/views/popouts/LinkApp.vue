<template>
	<section class="re-link-app">
		<section class="content">
			<section class="app-details">
				<PopOutLogos :app="app" />

				<figure class="action">Re-link App</figure>
				<figure class="app-name">via <b>{{app.name}}</b></figure>

				<figure class="text">It looks like the linking with <b>{{app.name}}</b> was somehow broken. <b>Make sure you are actually using this application before allowing re-linking!</b></figure>
			</section>
		</section>

		<section class="popout-buttons">
			<Button @click.native="closer" text="Deny" />
			<Button @click.native="$emit('returned', true)" primary="1" text="Allow" />
		</section>
	</section>
</template>

<script>
	import {IdentityRequiredFields} from "@walletpack/core/models/Identity";
	import {mapState} from "vuex";
	import PopOutLogos from "../../components/popups/PopOutLogos";

	export default {
		components: {PopOutLogos},
		props:['popup', 'closer'],

		computed:{
			...mapState([
				'scatter',
			]),
			app(){
				return this.popup.data.props.appData;
			},
		},
		methods:{
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.re-link-app {
		.content {


		}
	}

</style>