<template>
	<section class="identity">

		<section class="hero-panel">
			<figure class="corners"></figure>
		</section>

		<section class="switcher">
			<figure class="type" @click="state = STATES.PHYSICAL" :class="{'active':state === STATES.PHYSICAL}">Physical</figure>
			<figure class="type" @click="state = STATES.DIGITAL" :class="{'active':state === STATES.DIGITAL}">Digital</figure>
			<!--<figure class="type" @click="state = STATES.DOCS" :class="{'active':state === STATES.DOCS}">Docs</figure>-->
			<!--<figure class="type" @click="state = STATES.REPUTATION" :class="{'active':state === STATES.REPUTATION}">Reputation</figure>-->
		</section>

		<br>


		<section class="id-limiter">
			<Physical v-if="state === STATES.PHYSICAL" />
			<Digital v-if="state === STATES.DIGITAL" />
		</section>


	</section>
</template>

<script>
	import {mapState} from "vuex";
	import Loader from "../util/Loader";

	const STATES = {
		PHYSICAL:0,
		DIGITAL:1,
		// REPUTATION:2,
	};

	export default {
		components:{
			Physical:() => import('../components/identity/Physical'),
			Digital:() => import('../components/identity/Digital'),
		},
		data(){return {
			STATES,
			state:STATES.PHYSICAL,
		}},
		mounted(){
			this.$nextTick(() => Loader.set(false));
			if(this.$route.query.type){
				if(this.$route.query.type === 'digital') this.state = STATES.DIGITAL;
			}
		},
		computed:{
			...mapState([
				'scatter',
				'swiped'
			]),

		},
		watch:{
			['swiped'](){
				if(this.swiped !== null){
					this.state += this.swiped;
					if(this.state > Object.keys(STATES).length-1) this.state = Object.keys(STATES).length-1;
					if(this.state < 0) this.state = 0;
				}
			}
		},


	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.switcher {
		margin-top:10px;
	}

	.identity {

		.id-limiter {
			max-width:$maxwidth-default;
			margin:0 auto;
		}
	}



</style>

