<template>
	<section class="navbar">
		<router-link :to="{name:RouteNames.Dashboard}" class="item"><i class="fal fa-drafting-compass"></i> <span>Explore</span></router-link>
		<router-link :to="{name:RouteNames.Wallet, query:{type:'assets'}}" class="item"><i class="fal fa-wallet"></i> <span>Wallet</span></router-link>
		<router-link :to="{name:RouteNames.Identity}" class="item"><i class="fal fa-id-badge"></i> <span>Identity</span></router-link>
		<router-link :to="{name:RouteNames.Apps}" class="item"><i class="fal fa-rocket"></i> <span>Apps</span></router-link>
		<!--<router-link :to="{name:RouteNames.Socialize}" class="item"><i class="fal fa-comments"></i> <span>Socialize</span></router-link>-->
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
		box-shadow: 0 2px 10px 0 rgba(7,153,255,0.08), 0 8px 60px 0 rgba(7,153,255,0.25);
		border-left:1px solid $borderlight;
		border-right:1px solid $borderlight;
		border-bottom:1px solid $borderlight;

		transition: $themetransition;
		transition-property: background, border, box-shadow;

		display:flex;
		justify-content: center;
		align-items: center;

		background:$light;

		.item {
			display:flex;
			flex-direction: column;
			align-items: center;
			padding:25px 0;
			width:100px;

			span {
				opacity:0.7;
				font-size: 9px;
				font-weight: bold;
				font-family: 'Poppins', sans-serif;
			}

			i {
				font-size: 20px;
				margin-bottom:6px;
			}

			&:hover, &.active {
				color:$blue;
			}
		}
	}

	.blue-steel {
		.navbar {
			box-shadow:0 -20px 120px $darkshadow;
			background:$dark;

			border-left:1px solid $borderdark;
			border-right:1px solid $borderdark;
			border-bottom:1px solid $borderdark;
		}
	}

	.mobile {

		.navbar {
			height:$mobilenavbarheight;
			display:flex;
			width:100%;
			flex-direction:row;

			.item {
				height:$mobilenavbarheight;
				padding:0;
				display:flex;
				flex-direction:column;
				align-items:center;
				width:100vw;
				transition:all 0.12s ease-in-out;
				font-size:9px;

				i {
					margin-top: 14px;
				}

				&.active {
					color:$blue;
					background:rgba($blue, 0.12);
				}
			}
		}

		&.blue-steel {
			.item {
				color:white;

				&.active,
				&:hover {
					background:rgba($blue,0.1);
					color:$blue;
				}
			}
		}
	}


</style>
