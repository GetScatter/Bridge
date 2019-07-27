<template>
	<section class="apps-panel">
		<FeaturedApps :hiding="state !== STATES.EXPLORE" ref="featured" class="featured" :class="{'manage':state !== STATES.EXPLORE}" />

		<section class="switcher">
			<figure class="type" @click="state = STATES.EXPLORE" :class="{'active':state === STATES.EXPLORE}">Explore</figure>
			<figure class="type" @click="state = STATES.MANAGE" :class="{'active':state === STATES.MANAGE}">Manage</figure>
		</section>

		<transition-group name="slide-route" mode="out-in">
			<section :key="STATES.EXPLORE" class="explore panel-pad" v-if="state === STATES.EXPLORE">
				<SearchBar :options="sortingFilters" />
				<br>
				<br>

				<!--<section class="filters">-->
					<!--<figure class="title">Filter by Genre</figure>-->
					<!--<select>-->
						<!--<option v-for="category in categories">-->
							<!--{{category}}-->
						<!--</option>-->
					<!--</select>-->
				<!--</section>-->

				<section class="app-category" v-for="category in apps" v-if="!selectedCategory">
					<figure class="title">{{category.type}}</figure>
					<section class="apps">
						<section class="app" v-for="app in category.apps">
							<img class="img" :src="app.img" />
							<figure class="name">{{app.name}}</figure>
						</section>
					</section>
				</section>
			</section>
		</transition-group>
	</section>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as UIActions from '../store/ui_actions'
	import FeaturedApps from '../components/apps/FeaturedApps'
	import AppsService from "scatter-core/services/apps/AppsService";

	const STATES = {
		EXPLORE:0,
		MANAGE:1,
	};

	export default {
		data(){return {
			STATES,
			state:STATES.EXPLORE,

			selectedCategory:null,
			showRestricted:false,
		}},
		components:{
			FeaturedApps,
		},
		computed:{
			...mapState([
				'dappData'
			]),
			sortingFilters(){
				return [
					{text:'No sorting', value:null},
					{text:'Popular', value:'popularity'},
					{text:'New', value:'newest'},
				]
			},
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
			if(!Object.keys(this.dappData).length) AppsService.getApps();
		},
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
			transition-delay: 0.2s;
		}
	}

	.switcher {
		margin-top:calc(-10px - #{$topactions});
		box-shadow:0 -30px 80px rgba(0,0,0,0.3);
	}

	.explore {
		position: relative;
		z-index:2;
		padding-bottom:$navbarheight + 80px;
		//margin-top:- #{$topactions};

		.filters {
			display:flex;
			align-items: center;
			margin-bottom:100px;

			.title {
				font-size: 24px;
				font-weight: bold;
			}

			select {
				margin-left:20px;
			}
		}

		.app-category {
			margin-top:20px;
			margin-bottom:100px;

			.title {
				font-size: 24px;
				font-weight: bold;
				padding-bottom:10px;
				border-bottom:1px solid $borderlight;
			}
		}

		.apps {
			margin:0 -15px;
			overflow: hidden;

			.app {
				width:calc(33.3% - 30px);
				margin:15px;
				float:left;
				display:flex;
				align-items: center;

				.img {
					width:60px;
					height:60px;
					margin-right:10px;
					border-radius:4px;
					overflow: hidden;
				}

				.name {

				}
			}
		}
	}

	.mobile {
		.apps {

			.app {
				width:calc(50% - 30px);
				flex-direction: column;
				text-align: center;

				.img {
					width:80px;
					height:80px;
				}

				.name {
					margin-top:10px;
				}
			}
		}
	}

</style>

