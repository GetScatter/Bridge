<template>
	<section class="cta-apps">

		<figure class="title">Enjoy using top quality apps</figure>
		<figure class="description">We've curated some top quality applications for you to use with Scatter</figure>

		<section class="apps-list">
			<section class="app" v-for="app in featuredApps.concat(featuredApps).slice(0,3)">
				<figure class="name">{{app.name}}</figure>
				<img :src="app.img" />
			</section>
		</section>
	</section>
</template>

<script>
	import AppsService from "@walletpack/core/services/apps/AppsService";
	import {mapActions, mapState} from "vuex";
	import * as UIActions from "../../store/ui_actions";

	export default {
		data(){return {

		}},
		computed:{
			...mapState([
				'featuredApps',
			])
		},
		mounted(){
			if(!this.featuredApps.length) AppsService.getFeaturedApps().then(x => {
				x.map((y,i) => y.index = i);
				this[UIActions.SET_FEATURED_APPS](x)
			});
		},
		methods:{
			...mapActions([
				UIActions.SET_FEATURED_APPS
			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.cta-apps {

		.title {
			font-size: $font-size-large;
			font-weight:bold;
			font-family: 'Poppins', sans-serif;
		}

		.description {
			font-size: $font-size-standard;
			font-family: 'Poppins', sans-serif;
			opacity:0.4;
			margin-top:4px;
			margin-bottom:20px;
		}


		.apps-list {
			width:100%;
			display:flex;
			justify-content: space-between;

			.app {
				width:calc(33.3% - 20px);

				.name {
					font-size: $font-size-small;
					font-weight: bold;
					margin-bottom:10px;
				}

				img {
					border-radius:4px;
					width:100%;
					height:140px;
					background:blue;
					object-fit: cover;
				}
			}
		}
	}

</style>