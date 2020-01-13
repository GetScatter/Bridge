<template>
	<section class="identity">

		<section class="hero-panel">
			<figure class="corners"></figure>
		</section>

		<section class="switcher">
			<figure class="type" @click="state = STATES.FEED" :class="{'active':state === STATES.FEED}">Social Feed</figure>
			<figure class="type" @click="state = STATES.CONTACTS" :class="{'active':state === STATES.CONTACTS}">Contacts</figure>
		</section>

	</section>
</template>

<script>
	import {mapState} from "vuex";


	const STATES = {
		CONTACTS:0,
		FEED:1,
	};

	export default {
		data(){return {
			state:STATES.FEED,
			STATES
		}},
		mounted(){

		},
		computed:{
			...mapState([
				'scatter',
				'swiped'
			]),

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

