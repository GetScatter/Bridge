<template>
	<section class="dashboard">

		<section class="hero-panel">
			<figure class="corners"></figure>
		</section>

		<section class="dash-container">
			<section class="promoted-app">
				<CTAApps />
			</section>

			<section class="dash-actions">
				<!--<CTAPremium class="dash-action" />-->
				<!--<CTACreditCard class="dash-action" />-->
				<CTASupport class="dash-action" />
				<CTAArticle class="dash-action" />

			</section>
		</section>




	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import Loader from "../util/Loader";
	import * as UIActions from '../store/ui_actions'

	export default {
		data(){return {

		}},
		components: {
			CTACreditCard:() => import("../components/dashboard/CTACreditCard"),
			CTAPremium:() => import("../components/dashboard/CTAPremium"),
			CTAApps:() => import("../components/dashboard/CTAApps"),
			CTAArticle:() => import("../components/dashboard/CTAArticle"),
			CTASupport:() => import("../components/dashboard/CTASupport"),
		},
		async mounted(){
			Loader.set(false);
			// this.featureFlags.premium = true;
			// this[UIActions.SET_PREMIUM](false);
		},
		computed:{
			...mapState([
				'scatter',
				'swiped',
				'isMobile',
			]),
			hasCard(){
				return !!this.scatter.keychain.cards.length
			},
			hasKyc(){
				return true;
				return this.scatter.keychain.identities[0].kyc;
			},
		},
		methods:{
			...mapActions([
				UIActions.SET_TOP_ACTIONS_COLOR,
				UIActions.SET_PREMIUM,
			])
		},
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.dashboard {

		.dash-container {
			display:flex;
			height:calc(100vh - #{$navbarheight} - #{$topactions} - 60px);
			min-height: 500px;
			padding:0 50px 30px;
			max-width:1080px;
			margin:0 auto;
			z-index:11;
			margin-top:-10px;
			position: relative;

			.promoted-app {
				flex:1;
				height:100%;
				border-radius:16px;
				overflow:hidden;
				margin-right:30px;
			}

			.dash-actions {
				flex:1;
				display:flex;
				flex-direction: column;

				.dash-action {
					flex:0 0 auto;
					height:calc(50% - 15px);

					&:first-child {
						margin-bottom:30px;
					}
				}
			}
		}


	}

	.mobile {
		.dash-container {
			flex-direction: column;
			height:auto;
			padding:0 15px 30px;

			.promoted-app {
				height:480px;
				margin: 0 0 2rem;
			}

		}
	}

</style>

