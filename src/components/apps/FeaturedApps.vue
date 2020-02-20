<template>
	<section>
		<section class="featured" v-if="featuredApp" :class="{'hiding':hiding}">

			<section class="bg">
				<transition-group name="slide" mode="out-in">
					<!-- Loading all images, since they will look like shit when going to the next one if they arent preloaded -->
					<img v-if="app.applink === featuredApp.applink" v-for="app in indexedFeaturedApps" :key="app.img" :src="app.img" />
				</transition-group>
			</section>
			<section class="details" :style="{'color':featuredApp.colors ? featuredApp.colors.text : '#fff'}">
				<section class="floater">
					<transition name="slide-slow" mode="out-in">
						<section :key="featuredApp.applink">
							<figure class="name">{{featuredApp.name}}</figure>
							<figure class="promoted">promoted</figure>
							<figure v-if="featuredApp.description && featuredApp.description.length" class="text">{{featuredApp.description}}</figure>
							<figure v-else class="text">Check out {{featuredApp.name}} today!</figure>
							<Button @click="openInBrowser(featuredApp.url)" primary="1" :text="`Open ${featuredApp.name}`" :forced-styles="featuredApp.colors ? featuredApp.colors.button : null" />
						</section>
					</transition>

				</section>
			</section>

			<section class="featured-apps">
				<section class="app-list">
					<section class="app" v-for="(app, index) in indexedFeaturedApps"
					         @click="selectFeaturedApp(app.index)"
					         :class="{'neg-1':app.index === featuredAppIndex-1, 'neg-2':app.index === featuredAppIndex-2, 'gone':app.index < featuredAppIndex-2}"
					         :style="`background-image:url(${app.img}); left:${appLeft(app.index)}px`">

					</section>
				</section>
			</section>
		</section>
	</section>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as UIActions from '../../store/ui_actions'
	import AppsService from "@walletpack/core/services/apps/AppsService";
	import Loader from "../../util/Loader";
	import WebsocketAPIService from "../../services/utility/WebsocketAPIService";

	let destroyed;
	export default {
		props:['hiding'],
		data(){return {
			featuredAppIndex:0,
			indexedFeaturedApps:[],
		}},

		computed:{
			...mapState([
				'dappData',
				'featuredApps',
				'showRestricted'
			]),
			featuredApp(){
				return this.indexedFeaturedApps[this.featuredAppIndex];
			},
		},
		beforeMount(){
			Loader.set(true)
		},
		mounted(){
			this.getApps();


			destroyed = false;
			this[UIActions.SET_TOP_ACTIONS_COLOR]('#fff');
		},
		destroyed(){
			this[UIActions.SET_TOP_ACTIONS_COLOR](null);
			destroyed = true;
		},
		methods:{
			async getApps(){
				if(!this.featuredApps || !this.featuredApps.length){
					await WebsocketAPIService.getRoute('apps/featured').then(apps => {
						apps = apps.map(app => Object.assign(AppsService.getAppData(app.applink), app));
						this[UIActions.SET_FEATURED_APPS](apps);
					}).catch(err => {
						console.error(err);
					})
				}

				this.indexedFeaturedApps = this.featuredApps.filter(x => this.showRestricted || (x.type.toLowerCase() !== 'gambling' && x.type.length)).map(x => JSON.parse(JSON.stringify(x)));
				this.indexedFeaturedApps = this.indexedFeaturedApps.map((y,i) => {
					y.index = i;
					return y;
				});
				this.selectFeaturedApp(0);

				this.$nextTick(() => {
					Loader.set(false)
				});
			},
			selectFeaturedApp(index){
				if(destroyed) return;
				if(!this.indexedFeaturedApps[index]) return;
				this.featuredAppIndex = index;
				if(this.indexedFeaturedApps[index].colors) this[UIActions.SET_TOP_ACTIONS_COLOR](this.indexedFeaturedApps[index].colors.overlays);
			},
			appLeft(index){
				if(index === this.featuredAppIndex - 3) return -135;
				if(index === this.featuredAppIndex - 2) return -90;
				if(index === this.featuredAppIndex - 1) return -45;
				if(index === this.featuredAppIndex) return 0;
				return (index-this.featuredAppIndex)*90;
			},
			...mapActions([
				UIActions.SET_TOP_ACTIONS_COLOR,
				UIActions.SET_FEATURED_APPS
			])
		},
		watch:{
			['dappData'](){
				this.selectFeaturedApp(0)
			},
			['showRestricted'](){
				this.getApps();
			}
		}
	}
</script>

<style lang="scss">
	@import "../../styles/variables";

	.apps-panel {
		margin-top:-80px;
		position:relative;
	}

	.featured {
		height:480px;
		transition: all 0.3s ease;
		position: relative;
		background:$blue-gradient;

		.bg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index:1;
			box-shadow:inset 0 -120px 50px rgba(0,0,0,0.1);
			overflow: hidden;
			background:$blue-gradient;
			opacity:1;

			pointer-events: none;

			&:after {
				content:'';
				position: absolute;
				top:0;
				bottom:0;
				left:0;
				right:0;
				box-shadow:inset 0 50px 90px rgba(0,0,0,0.5);
			}

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				position: relative;
			}
		}

		.details {
			position: relative;
			z-index:2;
			margin:0 auto;
			height:100%;
			opacity:1;
			transition: all 0.3s ease;
			transition-property: opacity;
			transition-delay: 0.4s;

		    max-width:$maxwidth-default;

			.floater {
				position: absolute;
				bottom:140px;
				padding:0 50px;
				width:70%;

				.promoted {
					font-size: 9px;
					background:rgba(0,0,0,0.4);
					margin-top:10px;
					padding:5px 15px;

					border-radius:4px;
					border-bottom-left-radius:0;
					border-bottom-right-radius:0;
					display:table;
				}

				.name {
					font-size: $font-size-huge;
					font-family: 'Poppins', sans-serif;
					font-weight: bold;
					text-shadow:0 2px 3px rgba(0,0,0,0.3), 0 12px 25px rgba(0,0,0,0.2);
				}

				.text {
					font-size: $font-size-medium;
					font-family: 'Poppins', sans-serif;
					opacity:1;
					padding:8px 15px;
					background:rgba(0,0,0,0.6);
					border-radius:4px;
					border-top-left-radius:0;
					display:table;
				}

				button {
					margin-top:30px;
				}
			}
		}

		$appheight:60px;

		.featured-apps {
			position: absolute;
			bottom:154px;
			z-index:2;
			right:0;
			width:30%;
			overflow: hidden;
			height:$appheight + 40;
			padding:5px;
			padding-left:120px;
			opacity:1;
			transition: all 0.3s ease;
			transition-property: opacity;
			transition-delay: 0.4s;

			.app-list {
				position: relative;

				.app {
					cursor: pointer;
					display:inline-block;
					width:80px;
					height:$appheight;
					border-radius:4px;

					background-size:cover;
					background-position: center;
					z-index:3;

					position:absolute;
					top:0;

					transition: all 0.5s ease;
					transition-property: left, opacity, transform;

					box-shadow:$shadow-med;
					background-color:#fff;

					&.neg-1 {
						transform:scale(0.9);
						opacity:0.4;
						z-index:2;
					}

					&.neg-2 {
						transform:scale(0.8);
						opacity:0.2;
						z-index:1;
					}

					&.gone {
						transform: scale(0.4);
						opacity:0;
						z-index:0;
					}

				}
			}
		}
	}

	.mobile {
		.featured {
			height:580px;

			.details {
				height: calc(100% - #{$mobilenavbarheight});
			}
		}
		.details {
			.floater {
				position: absolute;
				bottom:150px;
				padding:0 50px;
				width:100%;

				.name {
					font-size: $font-size-huge;
					font-family: 'Poppins', sans-serif;
					font-weight: bold;
				}

				.text {
					font-size: $font-size-standard;
					font-family: 'Poppins', sans-serif;
					font-weight: bold;
				}

				button {
					margin-top:30px;
				}
			}
		}

		.featured-apps {
			bottom:60px;
			width:85%;

			.app-list {

				.app {
					width:80px;
					height:44px;
				}
			}
		}
	}

	.hiding {
		.details {
			opacity:0;
			transition-delay: 0s;
		}

		.featured-apps {
			opacity:0;
			transition-delay: 0s;
		}
	}




	.slide-slow-enter-active {
		transition: all 0.5s ease;
		transition-property: transform, opacity;
	}
	.slide-slow-leave-active {
		transition: all .8s ease;
		transition-delay: 0.3s;
		transition-property: transform, opacity;
	}
	.slide-enter-active {
		transition: all .5s ease;
		transition-property: transform, opacity;
		transition-delay:0.5s;
	}
	.slide-leave-active {
		transition: all .5s ease;
		transition-property: transform, opacity;
	}
	.slide-slow-leave-to, .slide-leave-to {
		transform: translateX(150px);
		opacity:0;
	}

	.slide-slow-enter, .slide-enter {
		transform: translateX(-150px);
		opacity:0;
	}

</style>

