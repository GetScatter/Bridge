<template>
	<section class="cta-apps">

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
			<Button primary="1" text="Open Crypto Legends" @click.native="openInBrowser('https://cryptolegends.io/home?ref=scatterrefer')" />
		</div>

		<!--<section class="apps-list">-->
			<!--<section class="app" @click="openInBrowser(app.url)" v-for="app in filteredApps.slice(0,3)">-->
				<!--<figure class="name">{{app.name}}</figure>-->
				<!--<figure class="image">-->
					<!--<img :src="app.img" />-->
				<!--</figure>-->
			<!--</section>-->
		<!--</section>-->
		<!--<figure class="description">Promoted Apps</figure>-->

		<!--<section class="more" v-if="isMobile">-->
			<!--View more great apps <i class="fas fa-chevron-right"></i>-->
		<!--</section>-->
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
				'featuredApps',
				'isMobile',
				'showRestricted',
			]),
			filteredApps(){
				return this.featuredApps.filter(x => this.showRestricted || x.type.toLowerCase() !== 'gambling');
			}
		},
		mounted(){
			if(!this.featuredApps.length) AppsService.getFeaturedApps().then(x => {
				x.map((y,i) => y.index = i);
				this[UIActions.SET_FEATURED_APPS](x)
			});
		},
		destroyed(){

		},
		methods:{
			...mapActions([
				UIActions.SET_FEATURED_APPS,
				UIActions.SET_TOP_ACTIONS_COLOR,
			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.cta-apps {
		position: relative;
		height: 480px;
		width: 100vw;
		overflow: hidden;
		margin-top: -80px;

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



		.promo {
			position:absolute;
			top:0;
			bottom:0;
			left:0;
			right:0;
			z-index:-1;
		}

		.description {
			display:block;
			padding:50px 50px 30px;
			position:absolute;
			bottom:50px;
			left:0;
			right:0;
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
				background:rgba(0,0,0,0.9);
				height:100%;
				transform: skewY(10deg);
				border-radius:10px;
				z-index:-1;
			}

			button {
				max-height: 42px;
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

</style>
