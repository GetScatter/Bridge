<template>
	<section>

		<section class="fader" :class="{'show':showFader}">

			<section class="pop-ins" v-for="popIn in popIns">
				<section class="overlay">
					<figure class="bg-holder">
						<section class="pop-in-over">
							<figure class="bg" @click="clickedFader"></figure>
							<section class="popin">
								<!--<figure class="closer"><i class="fas fa-times"></i></figure>-->
								<AddCreditCard :popin="popIn" v-if="popIn.data.type === 'addCreditCard'" />
								<CreateEosAccount :popin="popIn" v-if="popIn.data.type === 'createEosAccount'" />
							</section>
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
	import * as Actions from 'scatter-core/store/constants';
	import {PopupDisplayTypes, PopupTypes, isFullscreen} from 'scatter-core/models/popups/Popup'

	import AddCreditCard from '../components/popups/AddCreditCard'
	import CreateEosAccount from '../components/popups/CreateEosAccount'

	export default {
		components:{
			AddCreditCard,
			CreateEosAccount,
		},
		data(){ return {
			popupTypes:PopupTypes,
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

			...mapActions([
				Actions.RELEASE_POPUP
			])
		}
	}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	@import "../styles/variables";


	.pop-in-over {
		position:fixed;
		top:40px;
		bottom:0;
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
		top:40px;
		bottom:0;
		left:0;
		right:0;
		opacity:0;
		visibility: hidden;

		z-index:10001;

		&.show {
			opacity:1;
			visibility: visible;
		}

		.bg {
			position:fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			background: rgba(3, 25, 49, 0.71);
			z-index: -1;
			cursor: pointer;
		}
	}

	.popin {
		background:$light;
		border-radius:4px;
		margin:0 20px;

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

	}

	.blue-steel {
		.popin {
			background:$dark;
		}

		.fader {
			.bg {
				background:rgba(255,255,255,0.3);
			}
		}
	}

</style>
