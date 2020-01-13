<template>
	<section class="view-base" :class="{'blue-steel':theme === THEMES.BLUE_STEEL, 'mobile':isMobile}">
		<!--<figure class="global-bg" style="background-image:url(https://images.unsplash.com/photo-1532798369041-b33eb576ef16?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=701&q=80);"></figure>-->
		<figure class="global-bg-color"></figure>


		<!-- TOP LOADER BAR -->
		<transition-group name="working-bar-anim" mode="out-in">
			<figure key="working-bar" v-if="workingBar !== null" class="working-bar">
				<figure v-if="workingBar !== 'revert'" class="percentage-bar" :style="{
					'width':(workingBar ? workingBar === 'revert' ? 0 : workingBar : 0)+'%',
					'opacity':(workingBar ? workingBar === 'revert' ? 0 : workingBar : 0)/100+0.5
				}"></figure>
			</figure>
		</transition-group>



		<Popups />

		<!-- FULLSCREEN LOADER -->
		<figure v-if="working" class="working-screen">
			<figure class="logo scatter-logologo"></figure>
			<figure class="loader fa fa-spinner animate-spin"></figure>
		</figure>

		<section class="router-container" v-if="!isPopOut && !isLogin && unlocked">
			<section v-if="!scatter.onboarded">
				<Onboarding />
			</section>

			<section v-else>
				<section id="router" class="router">
					<section id="views" class="views">

						<TopActions />
						<router-view></router-view>
					</section>
				</section>
				<NavigationBar />
			</section>
		</section>

		<section v-else>
			<router-view></router-view>
		</section>



		<!-- UTILITY -->
		<SwipeHandler />
		<!--<ScrollHandler />-->

	</section>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import {RouteNames, Routing} from '../vue/Routing'
	import * as UIActions from '../store/ui_actions';

	import TopActions from '../components/TopActions';
	import NavigationBar from '../components/NavigationBar';
	import Popups from '../components/Popups';

	import SwipeHandler from '../components/util/SwipeHandler';
	import ScrollHandler from '../components/util/ScrollHandler';
	import {setMobileBrowserThemeColor} from "../util/Themes";

	export default {
		components:{
			TopActions,
			NavigationBar,
			Popups,
			SwipeHandler,
			ScrollHandler,
			Onboarding:() => import('../components/Onboarding')
		},
		data(){ return {

		}},
		mounted(){
			this[UIActions.SET_THEME](window.localStorage.getItem('theme') || this.THEMES.FLUORESCENT);
			this.checkDevice();
			this.checkMobileSize();
			window.addEventListener('resize', this.checkMobileSize)
		},
		computed:{
			...mapState([
				'scatter',
				'working',
				'workingBar',
			]),
			...mapGetters([
				'unlocked',
			]),
			isLogin(){
				return this.$route.name === this.RouteNames.Login;
			},
			isPopOut(){
				return this.$route.name === this.RouteNames.POP_OUT;
			},
		},
		methods:{
			checkMobileSize(){
				if(this.isMobileDevice) return;
				this[UIActions.SET_IS_MOBILE](window.innerWidth < 768);
			},
			checkDevice(){
				let check = false;
				(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
				if(check) {
					this[UIActions.SET_IS_MOBILE_DEVICE](true);
					this[UIActions.SET_IS_MOBILE](true);
				}
			},

			...mapActions([
				UIActions.SET_IS_MOBILE,
				UIActions.SET_IS_MOBILE_DEVICE,
				UIActions.SET_THEME,
			])
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







		.working-bar {
			position:fixed;
			top:1px;
			left:0;
			right:0;
			height:2px;
			z-index:9999999999999999;

			.percentage-bar {
				background:$blue;
				height:100%;
				width:0;
				opacity: 0;

				transition:all 0.1s ease;
				transition-property: width, opacity;
			}
		}

		.working-bar-anim-enter-active,
		.working-bar-anim-leave-active {
			transition:opacity 0.1s ease;
		}

		.working-bar-anim-leave-active {
			transition-delay: 0.2s;
		}

		.working-bar-anim-enter,
		.working-bar-anim-leave-active {
			opacity: 0
		}







		.working-screen {
			position:fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			z-index:9999;
			background:$blue;
			color:#fff;
			display:flex;
			justify-content: center;
			align-items: center;
			text-align:center;
			flex-direction: column;

			.logo {
				font-size: 88px;
				display:block;
			}

			.loader {
				margin-top:20px;
				font-size: 48px;
				opacity:0.45;

			}
		}

		.global-bg-color {
			position: fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			background:$light;
			z-index:-1;

			transition: $themetransition;
			transition-property: background, color;
		}

		&.blue-steel {
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
			background-position: center;
			opacity:0.05;
			z-index:1;
			pointer-events: none;
		}
	}
/*

	.router-container {

		border-left:1px solid $borderlight;
		border-right:1px solid $borderlight;
	}

	.blue-steel {
		.router-container {

			border-left:1px solid $borderdark;
			border-right:1px solid $borderdark;
		}
	}
 */

	.router {
		height:calc(100vh - #{$navbarheight});
		overflow-y:scroll;
		overflow-x: hidden;

		.views {
			min-height:calc(100vh - #{$navbarheight}); //
			height: 100%;

		}
	}

	.mobile {
		.view-base {
			.global-bg {
				bottom:$mobilenavbarheight;
			}
		}

		.router {
			height:calc(100vh - #{$mobilenavbarheight});

			.views {
				min-height:calc(100vh - #{$mobilenavbarheight});
			}
		}
	}




</style>
