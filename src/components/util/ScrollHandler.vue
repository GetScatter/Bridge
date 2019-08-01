<template></template>
<script>
	import {mapActions} from "vuex";
	import * as UIActions from "../../store/ui_actions";

	export default {
		data(){return {
			pos:0,
		}},
		mounted(){
			window.addEventListener('wheel', this.handle, false);
		},
		destroyed(){
			window.removeEventListener('wheel', this.handle, false);
		},
		methods:{
			handle(e){
				this[UIActions.SET_SCROLL](document.getElementById('router').scrollTop);
			},

			...mapActions([
				UIActions.SET_SCROLL
			])
		},
		watch:{
			['$route.name'](){

			}
		}
	}
</script>