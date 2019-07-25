<template>
	<section class="apps" v-if="featuredApp">
		<section class="featured">
			<figure class="bg" :style="`background-image:url(${featuredApp.img});`"></figure>
			<section class="details" :style="{'color':featuredApp.colors.text}">
				<section class="floater">
					<figure class="name">{{featuredApp.name}}</figure>
					<figure class="text">{{featuredApp.text}}</figure>
					<Button text="open" :forced-styles="featuredApp.colors.button" />
				</section>
			</section>
		</section>
	</section>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as UIActions from '../store/ui_actions'

	export default {
		data(){return {
			featuredApps:[],
		}},

		computed:{
			featuredApp(){
				return this.featuredApps[0];
			}
		},
		created(){
			this.featuredApps = [{
				img:'https://godsunchained.com/assets/images/backgrounds/wide-hi-res-god.jpg',
				name:'Gods Unchained',
				text:'Collect and Battle in Gods Unchained, Blockchain\'s competitive eSport.',
				colors:{
					topActions:'#fff',
					text:'#fff',
					button:{
						color:'#000',
						background:'#fff',
						border:'none'
					}
				}
			}];
			this.selectFeaturedApp(this.featuredApp)
		},
		destroyed(){
			this[UIActions.SET_TOP_ACTIONS_COLOR](null);
		},
		methods:{
			selectFeaturedApp(app){
				if(!app) return;
				this[UIActions.SET_TOP_ACTIONS_COLOR](app.colors.topActions);
			},
			...mapActions([
				UIActions.SET_TOP_ACTIONS_COLOR
			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.featured {
		max-height:calc(100vh - #{$navbarheight} - 30%);
		height:100%;
		min-height:400px;

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
	}

</style>

