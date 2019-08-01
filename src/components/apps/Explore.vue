<template>
	<section class="explore panel-pad">
		<SearchBar v-on:terms="x => terms = x" />
		<br>
		<br>

		<section v-if="apps.length">


			<section v-if="!terms.length">
				<section class="app-category">
					<figure class="title">Trending Apps</figure>
					<figure class="description">These are the hottest apps out there right now.</figure>
					<section class="apps">
						<section class="app" v-for="app in apps[0].apps.slice(0,6)">
							<img class="img" :src="app.img" />
							<figure class="name">{{app.name}}</figure>
						</section>
					</section>
				</section>

				<section class="app-category">
					<figure class="title">New Additions</figure>
					<figure class="description">Expect this list to change frequently. There's always new apps coming out.</figure>
					<section class="apps">
						<section class="app" v-for="app in apps[0].apps.slice(6,12)">
							<img class="img" :src="app.img" />
							<figure class="name">{{app.name}}</figure>
						</section>
					</section>
				</section>

				<section class="app-category">
					<figure class="title">Recommended</figure>
					<figure class="description">Based on the apps you're linked with, here's some suggestions.</figure>
					<section class="apps">
						<section class="app" v-for="app in apps[0].apps.slice(12,18)">
							<img class="img" :src="app.img" />
							<figure class="name">{{app.name}}</figure>
						</section>
					</section>
				</section>
			</section>

			<section v-else>

				<section class="app-category">
					<figure class="title">Search</figure>
					<figure class="description">Results for "{{terms}}"</figure>
					<section class="apps">
						<section class="app" v-for="app in apps">
							<img class="img" :src="app.img" />
							<figure class="name">{{app.name}}</figure>
						</section>
					</section>
				</section>

			</section>






		</section>




	</section>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as UIActions from '../../store/ui_actions'
	import AppsService from "@walletpack/core/services/apps/AppsService";

	export default {
		data(){return {
			selectedCategory:null,
			showRestricted:false,
			terms:'',
		}},
		computed:{
			categories(){
				let cats = AppsService.categories();
				if(this.showRestricted) return cats;
				cats = cats.filter(x => !this.showRestricted && x.toLowerCase() !== 'gambling');
				cats.push('Restricted');
				return cats;
			},
			apps(){
				if(!this.terms.length) {
					return AppsService.appsByCategory(this.selectedCategory)
						.filter(x => !this.showRestricted && x.type.toLowerCase() !== 'gambling');
				} else {

				}
			}
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

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
			}

			.description {
				font-size: 13px;
				color:$grey;
				margin-top:10px;
				padding-bottom:20px;
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
		.featured {
			max-height:calc(100vh - #{$mobilenavbarheight} - 30%);
		}

		.explore {
			padding-bottom:$mobilenavbarheight + 80px;
		}

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