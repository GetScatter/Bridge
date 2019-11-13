<template>
	<section class="get-public-key">
		<section class="content">
			<section class="app-details">
				<PopOutLogos :app="app" />

				<figure class="action">Update Username</figure>
				<figure class="app-name">via <b>{{app.name}}</b></figure>

				<figure class="text">This app wants to update your <b>username</b> to "<b>{{payload.name}}</b>".</figure>
			</section>
		</section>

		<section class="popout-buttons">
			<Button @click.native="closer" text="Deny" />
			<Button @click.native="$emit('returned', true)" primary="1" text="Update" />
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
			payload(){ return this.popup.payload(); },
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

	.get-public-key {
		.content {


		}
	}

</style>