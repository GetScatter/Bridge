<template>
	<section class="apps-panel">
		<FeaturedApps ref="featured" class="featured" />

		<section class="explore panel-pad">
			<section class="filters">
				<figure class="title">Filter by Genre</figure>
				<select>
					<option v-for="category in categories">
						{{category}}
					</option>
				</select>
			</section>

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
	</section>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as UIActions from '../store/ui_actions'
	import FeaturedApps from '../components/apps/FeaturedApps'
	import AppsService from "scatter-core/services/apps/AppsService";

	export default {
		data(){return {
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
		min-height:480px;
	}

	.explore {
		position: relative;
		z-index:2;
		padding-bottom:$navbarheight + 80px;
		margin-top:- #{$topactions};

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

</style>

