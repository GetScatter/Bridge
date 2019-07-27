<template></template>
<script>
	import {mapActions} from "vuex";
	import * as UIActions from "../../store/ui_actions";

	export default {
		data(){return {
			pos:0,
		}},
		mounted(){
			window.addEventListener('touchstart', this.start, false);
			window.addEventListener('touchend', this.end, false);
		},
		destroyed(){
			window.removeEventListener('touchstart', this.start, false);
			window.removeEventListener('touchend', this.end, false);
		},
		methods:{
			start(e){
				this.pos = {x:e.changedTouches[0].clientX, y:e.changedTouches[0].clientY};
			},
			end(e){
				const xdiff = this.pos.x - e.changedTouches[0].clientX;
				const ydiff = this.pos.y - e.changedTouches[0].clientY;
				if (Math.abs(xdiff) > Math.abs(ydiff)) {
					this[UIActions.SET_SWIPED](xdiff > 50 ? 1 : xdiff < -50 ? -1 : 0);
				}
				this.$nextTick(() => {
					this[UIActions.SET_SWIPED](null);
				})
			},

			...mapActions([
				UIActions.SET_SWIPED
			])

		}
	}
</script>