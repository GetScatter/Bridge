<template>
	<section>

		<section class="fader" :class="{'show':showFader}">

			<section class="pop-ins" v-for="popIn in popIns">
				<section class="overlay">
					<figure class="bg-holder">
						<section class="pop-in-over">
							<figure class="bg" @click="clickedFader"></figure>
							<!--<AddCreditCard :popin="popIn" v-if="popIn.data.type === 'addCreditCard'" />-->
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


	export default {
		components:{

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


</style>
