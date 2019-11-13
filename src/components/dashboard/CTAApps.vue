<template>
	<section class="cta-apps">

		<section v-if="!isMobile">
		</section>

		<section class="apps-list">
			<section class="app" @click="openInBrowser(app.url)" v-for="app in filteredApps.slice(0,3)">
				<figure class="name">{{app.name}}</figure>
				<figure class="image">
					<img :src="app.img" />
				</figure>
			</section>
		</section>
		<figure class="description">Promoted Apps</figure>

		<section class="more" v-if="isMobile">
			View more great apps <i class="fas fa-chevron-right"></i>
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
				'isMobile',
				'showRestricted',
			]),
			filteredApps(){
				return this.featuredApps.filter(x => this.showRestricted || x.type.toLowerCase() !== 'gambling');
			}
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
		text-align:center;
		margin-top:-80px;

		.title {
			font-size: $font-size-large;
			font-weight:bold;
			font-family: 'Poppins', sans-serif;
		}

		.description {
			font-size: $font-size-small;
			font-family: 'Poppins', sans-serif;
			opacity:0.4;
			margin-top:-40px;
		}


		.apps-list {
			width:100%;
			display:flex;
			justify-content: space-between;
			margin-top:70px;
			margin-bottom:30px;

			.app {
				cursor: pointer;
				width:calc(33.3% - 20px);

				transition:transform 0.2s ease;

				&:hover {
					transform:scale(1.1);
				}

				.name {
					font-size: $font-size-small;
					font-weight: bold;
					margin-bottom:10px;
				}



				.image {
					position: relative;

					img {
						border-radius:4px;
						width:100%;
						height:130px;
						object-fit: cover;
						position: relative;
						display:block;
						box-shadow:0 1px 3px rgba($blue, 0.2);
					}

					&:after {
						content:'';
						display:block;
						position: absolute;
						top:0; bottom:0; left:0; right:0;
						border-radius:4px;
					}
				}



				&:nth-child(1){
					text-align:left;

					.image {

						&:after {
							box-shadow:inset -90px 0 50px rgba(0,0,0,0.3);
						}
					}
				}

				&:nth-child(2){
					width:calc(50%);
					margin:-30px -50px;
					z-index:2;
					text-align:center;

					.image {
						img {
							height:140px;
							box-shadow:0 5px 6px rgba(0,0,0, 0.2);
						}

						&:after {
							display:none;
						}
					}
				}

				&:nth-child(3){
					text-align:right;

					.image {
						&:after {
							box-shadow:inset 90px 0 50px rgba(0,0,0,0.3);
						}
					}
				}
			}
		}
	}

	.mobile {



		.apps-list {
			margin-top:-20px;
			margin-bottom:10px;

			.app {

				.name {
					font-size: $font-size-big;
				}

				&:not(:nth-child(1)){
					display:none;
				}

				width:100%;
				box-shadow:none;

				.image {
					height:200px;
					box-shadow:none;

					&:after {
						display:none;
					}

					img {
						height:200px;
						box-shadow:none;
					}
				}

			}
		}

		.more {
			text-align:left;
			position: relative;
			bottom:0;
			margin-bottom:30px;
		}
	}

</style>
