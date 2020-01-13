<template>
	<section class="cta-apps">

		<figure class="promoted">Promoted</figure>

		<!-- Fallback image for when video isn't loaded -->
		<img class="promo" src="https://cryptolegends.io/assets/use-images/bg_special.png">

		<!-- Video promotion -->
		<video class="promo" data-v-1b6b9b64="" data-v-3b6b0f2a="" loop="loop" muted="muted" autoplay="autoplay">
			<source data-v-1b6b9b64="" data-v-3b6b0f2a="" src="https://cryptolegends.io/assets/video/crypto-03.mp4" type="video/mp4">
		</video>

		<div class="description">

			<!-- Top left logo -->
			<img class="logo" src="https://cryptolegends.io/assets/use-images/logo_crypto.png">

			<div class="premium-content">
				<span class="premium-name">Crypto Legends</span>
				<span class="premium-description">
                    Get ready for the battle of your lifetime.<br>
                    Win with strategy by changing your decks according to your opponent and fight to become globally adorned a Crypto Legend.
                </span>
			</div>
			<Button primary="1" text="Play Crypto Legends" @click.native="openInBrowser('https://cryptolegends.io/home?ref=scatterrefer')" />
		</div>
	</section>
</template>

<script>
	import AppsService from "@walletpack/core/services/apps/AppsService";
	import {mapActions, mapState} from "vuex";
	import * as UIActions from "../../store/ui_actions";

	export default {
		data(){return {

		}},
		computed:{
			...mapState([
				'isMobile',
				'showRestricted',
			]),
		},
		mounted(){

		},
		destroyed(){

		},
		methods:{
			...mapActions([

			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.cta-apps {
		position: relative;
		width:100%;
		height:100%;
		overflow: hidden;

		&:after {
			position:absolute;
			top:0;
			left:0;
			right:0;
			content:'';
			height:120px;
			z-index:2;
			background:$falloff-gradient;

		}

		.promoted {
			position:absolute;
			top:10px;
			right:10px;
			padding:5px 10px;
			border-radius:8px;
			color:white;
			background:rgba(0,0,0,0.8);
			font-size: $font-size-small;
			z-index:3;
		}



		.promo {
			position:absolute;
			top:0;
			bottom:0;
			left:0;
			right:0;
			z-index:-1;
			height: 100%;
			width: 100%;
			object-fit: cover;
		}

		.description {
			display:block;
			padding:50px 50px 50px;
			position:absolute;
			bottom:-10px;
			left:-1px;
			right:-1px;
			text-align:left;

			margin:0 auto;
			transition:max-width 0.12s ease-in-out;
			max-width:1280px;

			.logo {
				position:absolute;
				top:-60px;
				left:50px;
				width:150px;
			}

			&:before {
				content:'';
				display:block;
				position: absolute;
				left:0;
				right:0;
				top:20px;
				background:rgba(0,0,0,0.9);
				height:150%;
				transform: skewY(10deg);
				border-radius:10px;
				z-index:-1;
			}

			button {
				place-self: start;
				margin-top:10px;
			}

			div.premium-content {
				margin-right:20px;
				display:flex;
				flex-direction:column;
				text-align:left;
				align-content:center;
				position: relative;

				.premium-name {
					font-size: $font-size-large;
					font-family: 'Poppins', sans-serif;
					font-weight: bold;
					color:white;
					white-space:nowrap;
					overflow:hidden;
					text-overflow:ellipsis;
					margin-bottom:8px;
				}

				.premium-description {
					color:white;
					opacity:0.9;
					font-size: $font-size-standard;
					line-height:1.1rem;
					margin-bottom:10px;
					max-width:400px;

					@media (max-width: 1120px) {
						font-size: $font-size-small;
						line-height:1rem;
					}
				}

			}

		}
	}

	.mobile {
		.cta-apps {
			height:480px;
		}
	}

</style>
