<template>
	<section>

		<section class="fader" :class="{'show':showFader}">

			<section :key="popIn.data.type" class="pop-ins" v-for="(popIn,i) in popIns">
				<section class="overlay">
					<figure class="bg-holder">
						<section class="pop-in-over">
							<figure class="bg" v-if="i === popIns.length-1"></figure>
							<AddCreditCard          class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'addCreditCard'" />
							<CreateEosAccount       class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'createEosAccount'" />
							<Exchange               class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'exchange'" />
							<Transfer               class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'transfer'" />
							<AddContact             class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'addContact'" />
							<BuyWithCard            class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'buyTokens'" />
							<EnterPassword          class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'getPassword'" />
							<TwoFactor              class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'twoFactorAuth'" />
							<ScanQR                 class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'scanQR'" />
							<EnterSecurityCode      class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'enterSecurityCode'" />
							<MoonpayCode            class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'moonpayCode'" />
							<AllowPopups            class="popin" :popin="popIn" :closer="closer(popIn)" v-if="popIn.data.type === 'allowPopups'" />
						</section>
					</figure>
				</section>
			</section>

		</section>

		<section class="snackbar-holder" :class="{'has-snackbar':snackbars.length}">
			<transition-group name="snackbar-transition">
				<Snackbar :popup="popup" v-for="popup in snackbars" :key="popup.id" />
			</transition-group>
		</section>



	</section>
</template>

<script>
	import {RouteNames} from '../vue/Routing'
	import { mapActions, mapGetters, mapState } from 'vuex'
	import * as Actions from '../store/ui_actions';
	import {PopupDisplayTypes} from '../models/popups/Popup'

	import Snackbar from '../components/popups/Snackbar';


	export default {
		components:{
			AllowPopups:() => import('../components/popups/AllowPopups'),
			AddCreditCard:() => import('../components/popups/AddCreditCard'),
			CreateEosAccount:() => import('../components/popups/CreateEosAccount'),
			Exchange:() => import('../components/popups/Exchange'),
			Transfer:() => import('../components/popups/Transfer'),
			AddContact:() => import('../components/popups/AddContact'),
			BuyWithCard:() => import('../components/popups/BuyWithCard'),
			EnterPassword:() => import('../components/popups/EnterPassword'),
			TwoFactor:() => import('../components/popups/TwoFactor'),
			ScanQR:() => import('../components/popups/ScanQR'),
			EnterSecurityCode:() => import('../components/popups/EnterSecurityCode'),
			MoonpayCode:() => import('../components/popups/special/MoonpayCode'),
			Snackbar,
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

	.snackbar-holder {
		position:fixed;
		bottom:0;
		right:0;
		left:0;
		text-align:center;
		z-index:21001;
		pointer-events:none;
		margin:20px;
	}



	.snackbar-transition-leave-active {
		animation: snackbar-out 0.2s ease forwards;
	}
	.snackbar-transition-enter-active {
		animation: snackbar-in 0.3s ease forwards;
	}

	@keyframes snackbar-in {
		0% { transform: translateY(40px); }
		60% { transform: translateY(-20px); }
		100% { transform: translateY(0px); }
	}

	@keyframes snackbar-out {
		0% { transform: translateY(0px); }
		60% { transform: translateY(-20px); }
		100% { transform: translateY(40px); }
	}







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
			background: rgba(255,255,255,0.9);
			z-index: -1;
		}

		&.show {
			opacity:1;
			visibility: visible;
			transition:all 0.2s ease;
		}
	}

	.popin {
		background:$light;
		border-radius:10px;
		margin:0 20px;
		display:flex;
		max-height:calc(100vh - 80px);
		flex-direction: column;
		overflow:hidden;
		text-align:center;

		box-shadow: 0 40px 144px 0 rgba(0, 168, 255, 0.25), 0 10px 44px 0 rgba(0, 168, 255, 0.16);

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
			padding:20px;
			text-align:center;

			svg {
				margin:0px auto;
			}
		}

		.popup-content {
			flex:1;
			padding:40px;
			overflow-y:auto;
			overflow-x:hidden;
			position: relative;

			.title {
				font-size: $font-size-large;
				color: $grey;
				margin: 0px -40px 20px;
				padding: 0px 40px;
				line-height:32px;

				span {
					color:$blue;
					font-weight: bold;
				}
			}

			.sub-title {
				font-size: $font-size-standard;
				margin-top:30px;
				position: relative;
				z-index: 2;
				color:$grey;
				font-family: 'Poppins', sans-serif;
				transition:all 0.5s ease;
				transition-property: margin-top;
				transition-delay: 0.2s;
				display:block;
				padding-bottom:10px;

				&.no-margin {
					margin-top:0;
					transition-delay: 0s;
				}

				&.smaller {
					font-size: $font-size-small;
					color:$blue;
					margin-bottom:-10px;
				}
			}

			.sub-info {
				font-size:$font-size-tiny;
				opacity:0.72;
			}
		}

		.popup-buttons {
			flex:0 0 auto;
			background:$softblue;
			margin:0;
			padding:20px 20px 20px;
			position: relative;

			display:flex;
			justify-content: space-between;
		}

	}

	.blue-steel {
		.popin {
			background:$dark;

			box-shadow: -20px 40px 244px 0 rgba(0, 168, 255, 0.5), 0 10px 44px 0 rgba(0, 168, 255, 0.4);

			.popup-head {
				border-bottom:1px solid rgba($blue, 0.24);
				background:rgba(0,0,0,0.1);
			}

			.popup-buttons {
				border-top:1px solid transparent;
				background:rgba(0,0,0,0.24);
			}

			.popup-content {

				.title {
					color: white;
				}

				.sub-title {
					color:white;
				}

			}
		}

		.fader {
			.bg {
				background: rgba(0,0,0,0.9);
			}
		}
	}

	.mobile {

		.pop-in-over {
			top:0;
			left:0;
			right:0;
			bottom:0;
			padding:0;
			margin:0;
			height:100vh;
			position:fixed;

			.popin {
				margin:0;
				padding:0 0 80px;
				width:100vw;
				max-width:100vw;
				height: 100vh;
				max-height:100vh;
				border-radius:0;

				.popup-head {
					padding:20px;
					text-align:center;

					svg {
						margin:0px auto;
					}
          
		.fader {
			transition: none;
		}

		.popin {
			position:fixed !important;
			top:0;
			bottom:0;
			left:0;
			right:0;
			max-height:none;
			max-width:none !important;
			width:100% !important;
			border-radius:0;

			margin:0;
			animation: none;

			.popup-content {
				max-height:none !important;

				.title {
					font-size: 24px;
				}

				.popup-content {
					padding:20px 20px 40px;
					border-radius:0;
					animation: none;
					background:white;
					overflow-y:auto;

					.title {
						padding: 20px 40px 0px;
						line-height: 32px;
					}

					.sub-title {
						font-size: $font-size-standard;

						&.smaller {
							font-size: $font-size-small;
							font-weight: bold;
						}
					}
				}

				.popup-buttons {
					position:fixed;
					bottom:0;
					width:100vw;
					padding:10px 20px;
					margin:0;
					z-index:2;
					left:0;
					right:0;
					bottom:0;
					border-radius:0;
					animation: none;
					position:fixed;
					z-index:2;
					margin:0;
					width:100vw;
					overflow:hidden;
				}
			}

		}
	}

	.blue-steel {
		.pop-in-over {

			.popin {
				box-shadow:none;

				.popup-head {

					svg {
					}
				}

				.popup-content {
					background:transparent;

					.title {

					}

					.sub-title {


						&.smaller {
							
						}
					}
				}

				.popup-buttons {

				}
			}

		}
	}

</style>
