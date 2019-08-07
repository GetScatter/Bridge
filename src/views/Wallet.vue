<template>
	<section class="wallet">

		<section class="switcher">
			<figure class="type" @click="state = STATES.ASSETS" :class="{'active':state === STATES.ASSETS}">Assets</figure>
			<!--<figure class="type" @click="state = STATES.ITEMS" :class="{'active':state === STATES.ITEMS}">Items</figure>-->
			<figure class="type" @click="state = STATES.CARD" :class="{'active':state === STATES.CARD}">Card</figure>
			<figure class="type" @click="state = STATES.HISTORY" :class="{'active':state === STATES.HISTORY}">History</figure>
		</section>

		<br>


		<transition name="slide-route" mode="out-in">
			<Assets v-if="state === STATES.ASSETS" />
			<CreditCard v-if="state === STATES.CARD" />
			<History v-if="state === STATES.HISTORY" />

		</transition>


	</section>
</template>

<script>
	import {mapState} from "vuex";

	const STATES = {
		ASSETS:0,
		// ITEMS:1,
		CARD:1,
		HISTORY:2,
	};

	export default {
		components:{
			Assets:() => import('../components/wallet/Assets'),
			CreditCard:() => import('../components/wallet/CreditCard'),
			History:() => import('../components/wallet/History'),
		},
		data(){return {
			STATES,
			state:STATES.ASSETS,
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

	.wallet {

	}



</style>

