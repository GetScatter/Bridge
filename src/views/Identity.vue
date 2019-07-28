<template>
	<section class="identity">

		<section class="switcher">
			<figure class="type" @click="state = STATES.PHYSICAL" :class="{'active':state === STATES.PHYSICAL}">Physical</figure>
			<figure class="type" @click="state = STATES.DIGITAL" :class="{'active':state === STATES.DIGITAL}">Digital</figure>
			<!--<figure class="type" @click="state = STATES.DOCS" :class="{'active':state === STATES.DOCS}">Docs</figure>-->
			<figure class="type" @click="state = STATES.REPUTATION" :class="{'active':state === STATES.REPUTATION}">Reputation</figure>
		</section>

		<br>


		<section class="id-limiter">
			<transition name="slide-route" mode="out-in">
				<Physical v-if="state === STATES.PHYSICAL" />
				<Digital v-if="state === STATES.DIGITAL" />
			</transition>
		</section>


	</section>
</template>

<script>
	import {mapState} from "vuex";

	import Physical from '../components/identity/Physical'
	import Digital from '../components/identity/Digital'

	const STATES = {
		PHYSICAL:0,
		DIGITAL:1,
		REPUTATION:2,
	};

	export default {
		components:{
			Physical,
			Digital,
		},
		data(){return {
			STATES,
			state:STATES.PHYSICAL,
		}},
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
					if(this.state > 4) this.state = 4;
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
		overflow-x: hidden;

		.id-limiter {
			max-width:480px;
			margin:0 auto;
		}
	}



</style>

