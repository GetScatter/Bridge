<template>
	<section>

		<section class="fader" :class="{'show':showFader}">

			<section :key="popIn.data.type" class="pop-ins" v-for="(popIn,i) in popIns">
				<section class="overlay">
					<figure class="bg-holder">
						<section class="pop-in-over">
							<figure class="bg" v-if="i === popIns.length-1" @click="clickedFader"></figure>
							<AddCreditCard          class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'addCreditCard'" />
							<CreateEosAccount       class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'createEosAccount'" />
							<Exchange               class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'exchange'" />
							<Transfer               class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'transfer'" />
							<AddContact             class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'addContact'" />
							<BuyWithCard            class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'buyTokens'" />
							<EnterPassword          class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'getPassword'" />
							<TwoFactor              class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'twoFactorAuth'" />
						</section>
					</figure>
				</section>
			</section>

		</section>


		<!--<section class="snackbar-holder" :class="{'has-snackbar':snackbars.length}">-->
			<!--<transition-group name="snackbar-transition">-->
				<!--<Snackbar :popup="popup" v-for="popup in snackbars" :key="popup.id" />-->
			<!--</transition-group>-->
		<!--</section>-->



	</section>
</template>

<script>
	import {RouteNames} from '../vue/Routing'
	import { mapActions, mapGetters, mapState } from 'vuex'
	import * as Actions from '../store/ui_actions';
	import {PopupDisplayTypes} from '../models/popups/Popup'


	export default {
		components:{
			AddCreditCard:() => import('../components/popups/AddCreditCard'),
			CreateEosAccount:() => import('../components/popups/CreateEosAccount'),
			Exchange:() => import('../components/popups/Exchange'),
			Transfer:() => import('../components/popups/Transfer'),
			AddContact:() => import('../components/popups/AddContact'),
			BuyWithCard:() => import('../components/popups/BuyWithCard'),
			EnterPassword:() => import('../components/popups/EnterPassword'),
			TwoFactor:() => import('../components/popups/TwoFactor'),
		},
		data(){ return {
			popupDisplayTypes:PopupDisplayTypes,
		}},
		computed:{
			...mapState([
				'popups'
			]),
			...mapGetters([
				'popIns',
				'nextPopIn',
				'snackbars',
			]),
			showFader(){
				return this.nextPopIn && this.nextPopIn.displayType === PopupDisplayTypes.POP_IN
			}
		},
		methods:{
			clickedFader(){
				if(this.nextPopIn) {
					if(this.nextPopIn.hasOwnProperty('data') && typeof this.nextPopIn.data.callback === 'function') this.nextPopIn.data.callback(null);
					this[Actions.RELEASE_POPUP](this.popIns[this.popIns.length - 1]);
				}
			},

			closer(popup){
				return (result = null) => {
					if(popup.hasOwnProperty('data') && typeof popup.data.callback === 'function') popup.data.callback(result);
					this[Actions.RELEASE_POPUP](popup);
				}
			},

			...mapActions([
				Actions.RELEASE_POPUP
			])
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	@import "../styles/variables";


	.pop-in-over {
		position:fixed;
		top:40px;
		bottom:40px;
		left:0;
		right:0;

		display:flex;
		justify-content: center;
		align-items: center;
	}

	.fader {

		display: flex;
		justify-content: center;
		align-items: center;

		position:fixed;
		top:0;
		bottom:0;
		left:0;
		right:0;
		opacity:0;
		visibility: hidden;

		z-index:10001;

		transition:all 0s ease;
		transition-property: opacity, visibility;

		.bg {
			position:fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			background: rgba(3, 25, 49, 0.3);
			z-index: -1;
			cursor: pointer;
		}

		&.show {
			opacity:1;
			visibility: visible;
			transition:all 0.2s ease;
		}
	}

	.popin {
		background:$light;
		border-radius:4px;
		margin:0 20px;
		display:flex;
		max-height:calc(100vh - 80px);
		flex-direction: column;
		overflow:hidden;

		box-shadow:0 29px 88px rgba(0,0,0,0.1), 0 2px 5px rgba(0,0,0,0.28);

		margin-top:200%;

		animation: popinslide 0.2s forwards;

		@keyframes popinslide {
			0% { margin-top:200%; }
			100% { margin-top:0; }
		}

		.closer {
			height:30px;
			text-align:right;
			padding:0 10px;
			display:flex;
			align-items: center;
			justify-content: flex-end;
			border-bottom:1px solid rgba(0,0,0,0.1);

			i {
				cursor: pointer;
				width:30px;
				height:30px;
				display:flex;
				align-items: center;
				justify-content: flex-end;
			}
		}

		.popup-head {
			background:rgba(0,0,0,0.02);
			padding:40px;
			flex:0 0 auto;
			position: relative;
		}

		.popup-content {
			padding:40px;
			overflow-y:auto;
			overflow-x:hidden;
			position: relative;

			.title {
				font-size: 30px;
				margin-bottom:35px;

				span {
					color:$blue;
					font-weight: bold;
				}
			}

			.sub-title {
				font-size: 18px;
				margin-top:50px;
				position: relative;
				z-index: 2;

				transition:all 0.5s ease;
				transition-property: margin-top;
				transition-delay: 0.2s;

				&.no-margin {
					margin-top:0;
					transition-delay: 0s;
				}

				&.smaller {
					font-size: 11px;
					color:$blue;
					margin-bottom:-10px;
				}
			}
		}

		.popup-buttons {
			flex:0 0 auto;
			background:rgba(0,0,0,0.02);
			margin:0 -40px 0;
			padding:20px 60px 20px;
			position: relative;

			display:flex;
			justify-content: space-between;
		}

	}

	.blue-steel {
		.popin {
			background:$dark;

			.popup-head {
				border-bottom:1px solid transparent;
				background:rgba(0,0,0,0.1);
			}

			.popup-buttons {
				border-top:1px solid transparent;
				background:rgba(0,0,0,0.1);
			}
		}

		.fader {
			.bg {
				background:rgba(255,255,255,0.18);
			}
		}
	}

	.mobile {
		.popin {
			margin-top:0;
			animation: none;

			.popup-content {
				.title {
					font-size: 24px;
				}

				.sub-title {
					font-size: 16px;

					&.smaller {
						font-size: 11px;
						font-weight: bold;
					}
				}
			}
		}
	}

</style>
