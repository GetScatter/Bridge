<template>
	<section class="wallet">

		<section class="switcher">
			<figure class="type" @click="state = STATES.ASSETS" :class="{'active':state === STATES.ASSETS}">Assets</figure>
			<figure class="type" @click="state = STATES.ITEMS" :class="{'active':state === STATES.ITEMS}">Items</figure>
			<figure class="type" @click="state = STATES.CARD" :class="{'active':state === STATES.CARD}">Card</figure>
			<figure class="type" @click="state = STATES.HISTORY" :class="{'active':state === STATES.HISTORY}">History</figure>
		</section>

		<br>


		<transition-group name="slide-route" mode="out-in">
			<Assets :key="STATES.ASSETS" v-if="state === STATES.ASSETS" />
			<CreditCard :key="STATES.CARD" v-if="state === STATES.CARD" />

		</transition-group>


	</section>
</template>

<script>
	import {mapState} from "vuex";

	import Assets from '../components/wallet/Assets'
	import CreditCard from '../components/wallet/CreditCard'

	const STATES = {
		ASSETS:0,
		ITEMS:1,
		CARD:2,
		HISTORY:3,
	};

	export default {
		components:{
			Assets,
			CreditCard,
		},
		data(){return {
			STATES,
			state:STATES.ASSETS,
		}},
		computed:{
			...mapState([
				'scatter'
			]),

		},
		methods:{

		}

	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.switcher {
		margin-top:10px;
	}

	.wallet {

	}



</style>

