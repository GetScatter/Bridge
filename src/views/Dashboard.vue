<template>
	<section class="dashboard">

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
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import Loader from "../util/Loader";
	import SingletonService from "../services/utility/SingletonService";
	import * as UIActions from '../store/ui_actions'

	let destroyed = false;
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
		destroyed(){
			this[UIActions.SET_TOP_ACTIONS_COLOR](null);
			destroyed = true;
		},
		mounted(){
			destroyed = false;
			this[UIActions.SET_TOP_ACTIONS_COLOR](this.theme === this.THEMES.FLUORESCENT ? '#333' : '#fff');
			Loader.set(false);
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
			])
		},
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.dashboard {

		display:flex;
		height:calc(100vh - #{$navbarheight} - #{$topactions});
		min-height: 500px;
		padding:50px 50px;
		max-width:1080px;
		margin:0 auto;

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

	.mobile {
		.dashboard {
			flex-direction: column;
			height:auto;

			.promoted-app {
				height:480px;
				margin: 0 0 2rem;
			}

		}
	}

</style>

