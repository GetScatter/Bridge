<template>
	<section class="view-base" :class="{'dark':theme === THEMES.DARK}">
		<!--<figure class="global-bg" style="background-image:url(https://images.unsplash.com/photo-1521762849825-1dc1dda29785?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1306&q=80);"></figure>-->
		<figure class="global-bg-color"></figure>

		<section class="router">
			<TopActions />
			<transition name="slide-route" mode="out-in">
				<router-view class="views"></router-view>
			</transition>
		</section>
		<NavigationBar />

	</section>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import {RouteNames, Routing} from '../vue/Routing'
	import * as UIActions from '../store/ui_actions';

	import TopActions from '../components/TopActions';
	import NavigationBar from '../components/NavigationBar';

	export default {
		components:{
			TopActions,
			NavigationBar,
		},
		data(){ return {

		}},
		computed:{

		},
		methods:{

		}
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	@import '../styles/variables';

	.view-base {
		height:100vh;
		color:$black;

		transition: all 0.2s ease;
		transition-property: background, color;

		.global-bg-color {
			position: fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			background:$light;
			z-index:-1;

			transition: all 0.2s ease;
			transition-property: background, color;
		}

		&.dark {
			color:$light;

			.global-bg-color {
				background:$dark;
			}
		}

		.global-bg {
			position: fixed;
			top:0;
			bottom:$navbarheight;
			left:0;
			right:0;
			background-size: cover;
			opacity:0.05;
			z-index:1;
			pointer-events: none;
		}
	}

	.router {
		height:calc(100vh - #{$navbarheight});

		.views {
			height:calc(100vh - #{$navbarheight} - #{$topactions});
			//overflow:auto;
		}
	}




	.slide-route-enter-active {
		transition: all .5s ease;
	}
	.slide-route-leave-active {
		transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-route-enter, .slide-route-leave-to
		/* .slide-route-leave-active below version 2.1.8 */ {
		transform: translateY(-10px);
		opacity:0;
	}

</style>
