<template>
	<section class="apps-panel">
		<FeaturedApps :hiding="state !== STATES.EXPLORE" ref="featured" class="featured" :class="{'manage':state !== STATES.EXPLORE}" />

		<section class="switcher">
			<figure class="type" @click="state = STATES.EXPLORE" :class="{'active':state === STATES.EXPLORE}">Explore</figure>
			<figure class="type" @click="state = STATES.MANAGE" :class="{'active':state === STATES.MANAGE}">Manage</figure>
		</section>

		<transition name="slide-route" mode="out-in">
			<Explore class="explore panel-pad" v-if="state === STATES.EXPLORE" />
			<Manage class="explore panel-pad" v-if="state === STATES.MANAGE" />
		</transition>
	</section>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as UIActions from '../store/ui_actions'
	import AppsService from "@walletpack/core/services/apps/AppsService";

	const STATES = {
		EXPLORE:0,
		MANAGE:1,
	};

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
				'swiped'
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
		mounted(){
			setTimeout(() => {
				if(!Object.keys(this.dappData).length) AppsService.getApps();
			}, 1000);
		},
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
		max-height:calc(100vh - #{$navbarheight} - 30%);
		height:100%;
		min-height:400px;
		overflow: hidden;

		transition:all 0.5s ease;
		transition-property: max-height, min-height;
		transition-delay: 0s;

		&.manage {
			min-height:0;
			max-height:180px;
			transition-delay: 0.3s;
		}
	}

	.switcher {
		margin-top:calc(-10px - #{$topactions});
		border-top:0;
		border-top:1px solid rgba($blue, 0.12);
	}

</style>

