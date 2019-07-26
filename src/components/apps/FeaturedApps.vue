<template>
	<section>
		<section class="featured" v-if="featuredApp">

			<figure class="bg" :style="`background-image:url(${featuredApp.img});`"></figure>
			<section class="details" :style="{'color':featuredApp.colors.text}">
				<section class="floater">
					<figure class="name">{{featuredApp.name}}</figure>
					<figure class="text">{{featuredApp.text}}</figure>
					<Button text="open" :forced-styles="featuredApp.colors.button" />
				</section>
			</section>

			<section class="featured-apps">
				<section class="app-list">
					<section class="app" v-for="(app, index) in featuredApps"
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
	import IdGenerator from "scatter-core/util/IdGenerator";

	export default {
		data(){return {
			// featuredApps:[],
			featuredAppIndex:null,
		}},

		computed:{
			...mapState([
				'dappData'
			]),
			featuredApps(){
				const apps = Object.keys(this.dappData).map(k => this.dappData[k]).filter(x => x.img).map(x => ({
					img:x.img,
					name:x.name,
					text:x.description,
					colors:{
						topActions:'#fff',
						text:'#fff',
						button:{
							color:'#000',
							background:'#fff',
							border:'none'
						}
					}
				}))
				apps.map((x,i) => x.index = i);
				return apps;
			},
			featuredApp(){
				return this.featuredApps[this.featuredAppIndex];
			},
			orderedAppsList(){
				const before = this.featuredApps.slice(this.featuredAppIndex - 3, this.featuredAppIndex - 1);
				const after = this.featuredApps.slice(this.featuredAppIndex, this.featuredApps.length - before.length - 1);
				return before.concat(after);
			}
		},
		mounted(){
			this.selectFeaturedApp(0)
		},
		destroyed(){
			this[UIActions.SET_TOP_ACTIONS_COLOR](null);
		},
		methods:{
			selectFeaturedApp(index){
				if(!this.featuredApps[index]) return;
				this.featuredAppIndex = index;
				this[UIActions.SET_TOP_ACTIONS_COLOR](this.featuredApps[index].colors.topActions);
			},
			appLeft(index){
				if(index === this.featuredAppIndex - 3) return -80;
				if(index === this.featuredAppIndex - 2) return -40;
				if(index === this.featuredAppIndex - 1) return -20;
				if(index === this.featuredAppIndex) return 0;
				return (index-this.featuredAppIndex)*110;
			},
			...mapActions([
				UIActions.SET_TOP_ACTIONS_COLOR
			])
		},
		watch:{
			['dappData'](){
				this.selectFeaturedApp(0)
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.featured {
		max-height:calc(100vh - #{$navbarheight} - 30%);
		height:100%;
		min-height:480px;

		position: relative;
		margin-top:-#{$topactions};

		.bg {
			position: absolute;
			top:-#{$topactions};
			bottom:$navbarheight;
			left:0;
			right:0;
			background-size: cover;
			background-position: top center;
			z-index:1;

			pointer-events: none;
		}

		.details {
			position: relative;
			z-index:2;
			max-width:$maxwidth;
			margin:0 auto;
			margin-top: $topactions;
			height:calc(100% - #{$navbarheight});

			.floater {
				position: absolute;
				bottom:100px;
				padding:0 50px;
				width:60%;

				.name {
					font-size: 36px;
					font-weight: bold;
				}

				.text {
					font-size: 13px;
					font-weight: bold;
				}

				button {
					margin-top:30px;
				}
			}
		}

		$appheight:60px;
		.featured-apps {
			position: absolute;
			bottom:40%;
			z-index:2;
			right:0;
			width:30%;
			overflow: hidden;
			height:$appheight;
			padding-left:40px;

			.app-list {
				position: relative;

				.app {
					cursor: pointer;
					display:inline-block;
					width:100px;
					height:$appheight;
					border-radius:4px;

					background-size:cover;
					background-position: center;
					z-index:3;

					position:absolute;
					top:0;

					transition: all 0.5s ease;
					transition-property: left, opacity, transform;

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




	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0
	}

</style>

