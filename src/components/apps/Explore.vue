<template>
	<section class="explore panel-pad">
		<section class="search-and-filter">
			<SearchBar v-on:terms="x => terms = x" />
			<section class="toggle-restricted" :class="{'hide':showRestricted}" @click="toggleRestricted">
				<span v-if="!showRestricted">Show Restricted Apps</span>
				<span v-if="showRestricted">Hide Restricted Apps</span>
			</section>
		</section>
		<br>
		<br>

		<section v-if="apps.length">


			<section v-if="!terms.length">
				<section class="app-category" v-for="cat in apps">
					<figure class="title">{{cat.type}} ({{cat.apps.length}})</figure>
					<figure class="description"></figure>

					<section class="apps">
						<section class="app" @click="openInBrowser(app.url)" v-for="app in cat.apps.slice(0,6)">
							<v-lazy-image class="img" :src="app.img" />
							<section class="info">
								<figure class="name">{{app.name}}</figure>
								<figure class="text">{{app.description}}</figure>
							</section>
						</section>
					</section>
				</section>

				<!--<section class="app-category">-->
					<!--<figure class="title">Trending Apps</figure>-->
					<!--<figure class="description">These are the hottest apps out there right now.</figure>-->
					<!--<section class="apps">-->
						<!--<section class="app" v-for="app in apps[0].apps.slice(0,6)">-->
							<!--<v-lazy-image class="img" :src="app.img" />-->
							<!--<figure class="name">{{app.name}}</figure>-->
						<!--</section>-->
					<!--</section>-->
				<!--</section>-->

				<!--<section class="app-category">-->
					<!--<figure class="title">New Additions</figure>-->
					<!--<figure class="description">Expect this list to change frequently. There's always new apps coming out.</figure>-->
					<!--<section class="apps">-->
						<!--<section class="app" v-for="app in apps[0].apps.slice(6,12)">-->
							<!--<v-lazy-image class="img" :src="app.img" />-->
							<!--<figure class="name">{{app.name}}</figure>-->
						<!--</section>-->
					<!--</section>-->
				<!--</section>-->

				<!--<section class="app-category white-bg">-->
					<!--<figure class="title">Recommended</figure>-->
					<!--<figure class="description">Based on the apps you're linked with, here's some suggestions.</figure>-->
					<!--<section class="apps">-->
						<!--<section class="app" v-for="app in apps[0].apps.slice(12,18)">-->
							<!--<v-lazy-image class="img" :src="app.img" />-->
							<!--<figure class="name">{{app.name}}</figure>-->
						<!--</section>-->
					<!--</section>-->
				<!--</section>-->
			</section>

			<section v-else>

				<section class="app-category">
					<figure class="title">Search</figure>
					<figure class="description">Results for "{{terms}}"</figure>
					<section class="apps">
						<section class="app" @click="openInBrowser(app.url)" v-for="app in apps">
							<v-lazy-image class="img" :src="app.img" />
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
	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";

	export default {
		data(){return {
			selectedCategory:null,
			terms:'',
		}},
		computed:{
			...mapState([
				'showRestricted',
			]),
			categories(){
				let cats = AppsService.categories();
				if(this.showRestricted) return cats;
				cats = cats.filter(x => x.toLowerCase() !== 'gambling');
				return cats;
			},
			apps(){
				if(!this.terms.length) {
					return AppsService.appsByCategory(this.selectedCategory)
						.filter(x => this.showRestricted || x.type.toLowerCase() !== 'gambling');
				} else {

				}
			}
		},
		methods:{
			toggleRestricted(){
				const toggle = () => this[UIActions.SET_RESTRICTED_APPS](!this.showRestricted);
				if(!this.showRestricted){
					PopupService.push(Popups.allowRestrictedApps(yes => {
						if(yes) toggle();
					}));
				} else toggle();
			},
			...mapActions([
				UIActions.SET_RESTRICTED_APPS
			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.apps-panel {
		height:100%;
	}

	.search-and-filter {
		display:flex;
		align-items: center;

		.search-bar {
			flex:1;
			margin-right:10px;
		}

		.toggle-restricted {
			height:35px;
			font-size: 9px;
			display:flex;
			align-items: center;
			border:1px solid $red;
			padding:0 20px;
			border-radius:4px;
			cursor: pointer;
			background:$red;

			&:not(.hide){
				color:white;
			}

			&.hide {
				background:transparent;
				border:1px solid $borderlight;
			}
		}
	}

	.featured {
		max-height:calc(100vh - #{$navbarheight} - 30%);
		height:100%;
		min-height:480px;
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
				font-size: $font-size-big;
				font-weight: bold;
				font-family: 'Poppins', sans-serif;
			}

			select {
				margin-left:20px;
			}
		}

		.app-category {
			margin-top:20px;
			margin-bottom:100px;

			.title {
				font-size: $font-size-big;
				font-weight: bold;
				font-family: 'Poppins', sans-serif;
			}

			.description {
				font-size: $font-size-standard;
				color:$grey;
				opacity:0.6;
				margin-top:10px;
				padding-bottom:20px;
				font-family: 'Poppins', sans-serif;
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
				cursor: pointer;
				border:1px solid transparent;
				padding:10px;
				border-radius:4px;

				transition:border 0.5s ease;

				&:hover {
					border:1px solid $blue;
					transition:border 0.1s ease;
				}

				.img {
					width:60px;
					height:60px;
					margin-right:10px;
					border-radius:4px;
					overflow: hidden;

					&.placeholder {
						background:rgba(0,0,0,0.05);
					}
				}

				.info {
					padding-left:10px;

					.name {
						font-family: 'Poppins', sans-serif;
						color:$darkblue;
						font-size:$font-size-standard;
						text-transform: capitalize;
					}

					.text {
						margin-top:3px;
						font-size:$font-size-tiny;
					}
				}
			}
		}
	}

	.blue-steel {
		.app-category {

			.title {

			}

			.description {
				color:white;
			}
		}

		.explore {
			.apps {
				.app {
					.name {
						color:white;
					}
				}
			}
		}
	}

	.mobile {
		.featured {

		}

		.switcher {
		}

		.explore {

			.apps {

			.app {
				width:calc(50% - 30px);
				flex-direction: column;
				text-align: center;

				.img {
					width:80px;
					height:80px;
				}

				.info {
					.name {
						margin-top:10px;
						margin-left:0;
						font-size:$font-size-standard;
					}
				}

			}
		}
		}


	}

</style>
