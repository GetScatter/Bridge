<template>
	<section class="apps-panel">
		<FeaturedApps :hiding="state !== STATES.EXPLORE" ref="featured" class="featured" :class="{'manage':state !== STATES.EXPLORE}" />

		<section class="switcher">
			<figure class="type" @click="state = STATES.EXPLORE" :class="{'active':state === STATES.EXPLORE}">Explore</figure>
			<figure class="type" @click="state = STATES.MANAGE" :class="{'active':state === STATES.MANAGE}">Manage</figure>
		</section>

		<Explore class="explore panel-pad" v-if="state === STATES.EXPLORE" />
		<Manage class="explore panel-pad" v-if="state === STATES.MANAGE" />
	</section>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as UIActions from '../store/ui_actions'
	import AppsService from "@walletpack/core/services/apps/AppsService";
	import Loader from "../util/Loader";
	import StoreService from "@walletpack/core/services/utility/StoreService";
	import * as Actions from "@walletpack/core/store/constants";

	const STATES = {
		EXPLORE:0,
		MANAGE:1,
	};

	let oldApps;
	export default {
		components:{
			FeaturedApps:() => import('../components/apps/FeaturedApps'),
			Explore:() => import('../components/apps/Explore'),
			Manage:() => import('../components/apps/Manage'),
		},
		data(){return {
			STATES,
			state:STATES.EXPLORE,

			selectedCategory:null,
			showRestricted:false,
		}},
		computed:{
			...mapState([
				'dappData',
				'swiped',
				'isMobile'
			]),
			categories(){
				let cats = AppsService.categories();
				if(this.showRestricted) return cats;
				cats = cats.filter(x => !this.showRestricted && x.toLowerCase() !== 'gambling');
				cats.push('Restricted');
				return cats;
			},
			apps(){
				return AppsService.appsByCategory(this.selectedCategory)
					.filter(x => !this.showRestricted && x.type.toLowerCase() !== 'gambling');
			}
		},
		// beforeMount(){
		// 	setTimeout(() => {
		// 		if(!Object.keys(this.dappData).length) AppsService.getApps();
		// 	}, 1000);
		// },
		// beforeDestroy(){
		// 	AppsService.getApps({include:AppsService.linkedApps().map(x => x.applink)})
		// },
		watch:{
			['swiped'](){
				if(this.swiped !== null){
					this.state += this.swiped;
					if(this.state > 3) this.state = 3;
					if(this.state < 0) this.state = 0;
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.apps-panel {
		height:100%;
	}

	.featured {
		height:400px;
		overflow: hidden;

		transition:all 0.5s ease;
		transition-property: height;
		transition-delay: 0s;

		&.manage {
			height: $topactions;
			transition-delay: 0.3s;
		}
	}

	.switcher {
		border-top:1px solid rgba($blue, 0.12);
	}

	.mobile {
		.switcher {
			margin-top:0;
		}
	}

</style>

