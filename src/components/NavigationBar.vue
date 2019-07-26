<template>
	<section class="navbar">
		<router-link :to="{name:RouteNames.Dashboard}" class="item"><i class="far fa-stop-circle"></i> Dashboard</router-link>
		<router-link :to="{name:RouteNames.Apps}" class="item"><i class="far fa-star"></i> Apps</router-link>
		<router-link :to="{name:RouteNames.Wallet}" class="item"><i class="fas fa-wallet"></i> Wallet</router-link>
		<router-link :to="{name:RouteNames.Identity}" class="item"><i class="fas fa-user-circle"></i> Identity</router-link>
	</section>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		computed:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.navbar {
		height:$navbarheight;
		position:fixed;
		bottom:0;
		left:0;
		right:0;
		z-index:2;

		border-top:1px solid rgba(0,0,0,0.05);
		box-shadow:0 -20px 120px $lightshadow;

		transition: all 1s ease;
		transition-property: background, border, box-shadow;

		display:flex;
		justify-content: center;
		align-items: center;

		background:$light;

		.item {
			display:flex;
			flex-direction: column;
			align-items: center;
			padding:0 30px;
			font-size: 9px;
			font-weight: bold;
			text-transform: uppercase;

			i {
				font-size: 24px;
				margin-bottom:5px;
			}

			&:hover, &.active {
				color:$blue;
			}
		}
	}

	.dark {
		.navbar {
			border-top:1px solid rgba(255,255,255,0.1);
			box-shadow:0 -20px 120px $darkshadow;

			background:$dark;
		}
	}


</style>
