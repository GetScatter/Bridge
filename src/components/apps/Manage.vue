<template>
	<section class="explore panel-pad">

		<section class="app-category">
			<figure class="title">Apps you're linked with</figure>
			<figure class="description">These are applications that you have granted the ability to see your accounts and interact with your Scatter.</figure>
			<SearchBar v-on:terms="x => terms = x" />
			<br>
			<section class="apps">
				<section class="app" v-for="app in apps">
					<img class="img" :src="app.img" />
					<section class="info">
						<figure class="name">{{app.name}}</figure>
						<figure class="text">{{app.description}}</figure>
					</section>
					<Button @click.native="revoke(app)" text="Revoke Access" />
				</section>
			</section>
		</section>




	</section>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as UIActions from '../../store/ui_actions'
	import AppsService from "@walletpack/core/services/apps/AppsService";
	import PermissionService from "@walletpack/core/services/apps/PermissionService";

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
				return AppsService.linkedApps(this.terms, this.selectedCategory);
			}
		},
		methods:{
			revoke(app){
				PermissionService.removeAllPermissionsFor(app.applink);
			}
		}
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
			overflow: hidden;

			.app {
				width:100%;
				margin:15px 0;
				float:left;
				display:flex;
				align-items: center;

				&:not(:last-child){
					border-bottom:1px solid $borderlight;
					padding-bottom:30px;
				}

				.img {
					width:120px;
					height:120px;
					margin-right:30px;
					border-radius:4px;
					overflow: hidden;
				}

				.info {
					flex:1;
					padding-right:30px;

					.name {
						display:block;
						width:100%;
						font-weight: bold;
						font-size: 20px;
					}

					.text {
						margin-top:5px;
						font-size: 13px;
						color:$grey;
					}
				}
			}
		}
	}

	.blue-steel {
		.apps {
			.app {
				&:not(:last-child){
					border-bottom:1px solid $borderdark;
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

				.img {
					width:40px;
					height:40px;
					margin-right:20px;
				}
			}
		}
	}

</style>
