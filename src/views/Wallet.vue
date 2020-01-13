<template>
	<section class="wallet">


		<keep-alive>
			<component :is="stateComponent">
				<section class="switcher" v-if="hasHistory || hasItems || hasCards">
					<figure class="type" @click="state = STATES.ASSETS" :class="{'active':state === STATES.ASSETS}">Assets</figure>
					<!--<figure class="type" @click="state = STATES.ITEMS" :class="{'active':state === STATES.ITEMS}">Items</figure>-->
					<figure class="type" v-if="hasCards" @click="state = STATES.CARD" :class="{'active':state === STATES.CARD}">Card</figure>
					<figure class="type" v-if="hasHistory" @click="state = STATES.HISTORY" :class="{'active':state === STATES.HISTORY}">History</figure>
				</section>
			</component>
		</keep-alive>


		<!--<section class="switcher" v-if="hasHistory || hasItems || hasCards">-->
			<!--<figure class="type" @click="state = STATES.ASSETS" :class="{'active':state === STATES.ASSETS}">Assets</figure>-->
			<!--&lt;!&ndash;<figure class="type" @click="state = STATES.ITEMS" :class="{'active':state === STATES.ITEMS}">Items</figure>&ndash;&gt;-->
			<!--<figure class="type" @click="state = STATES.CARD" :class="{'active':state === STATES.CARD}">Card</figure>-->
			<!--<figure class="type" v-if="hasHistory" @click="state = STATES.HISTORY" :class="{'active':state === STATES.HISTORY}">History</figure>-->
		<!--</section>-->

		<!--<Assets v-if="state === STATES.ASSETS" />-->
		<!--<CreditCard v-if="state === STATES.CARD" />-->
		<!--<History v-if="state === STATES.HISTORY" />-->


	</section>
</template>

<script>
	import {mapState} from "vuex";
	import Loader from "../util/Loader";

	import Assets from '../components/wallet/Assets';
	import CreditCard from '../components/wallet/CreditCard';
	import History from '../components/wallet/History';

	const STATES = {
		ASSETS:0,
		// ITEMS:1,
		CARD:1,
		HISTORY:2,
	};

	export default {
		components:{
			// Assets:() => import('../components/wallet/Assets'),
			// CreditCard:() => import('../components/wallet/CreditCard'),
			// History:() => import('../components/wallet/History'),
		},
		data(){return {
			STATES,
			state:STATES.ASSETS,
		}},
		computed:{
			...mapState([
				'scatter',
				'swiped',
				'history'
			]),
			stateComponent(){
				switch(this.state){
					case STATES.ASSETS: return Assets;
					case STATES.CARD: return CreditCard;
					case STATES.HISTORY: return History;
				}
			},
			hasHistory(){
				return this.history && this.history.length;
			},
			hasItems(){
				return false;
			},
			hasCards(){
				// return true;
				return this.scatter.keychain.cards.length;
			}
		},
		beforeMount(){
			switch(this.$route.query.type){
				case 'assets': return this.state = STATES.ASSETS;
				case 'card': return this.state = STATES.CARD;
				case 'history': return this.state = STATES.HISTORY;
			}
		},
		mounted(){
			this.$nextTick(() => Loader.set(false));
		},
		watch:{
			['swiped'](){
				if(this.swiped !== null){
					this.state += this.swiped;
					if(this.state > Object.keys(STATES).length-1) this.state = Object.keys(STATES).length-1;
					if(this.state < 0) this.state = 0;
				}
			},
			['$route.query.type'](){
				switch(this.$route.query.type){
					case 'assets': return this.state = STATES.ASSETS;
					case 'card': return this.state = STATES.CARD;
					case 'history': return this.state = STATES.HISTORY;
				}
			},
			['state'](){
				this.$router.replace({ name: this.RouteNames.Wallet, query: {type: Object.keys(STATES)[this.state].toLowerCase()} });
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

