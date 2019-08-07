<template>
	<figure class="symbol-ball" :style="{'background-color':colorHex(token)}" :class="{'base':!token, 'active':active, 'no-after':!!img}">
		<i v-if="symbol" :class="symbol"></i>
		<div class="img" v-if="img" :style="`background-image:url(${img})`" />
	</figure>
</template>

<script>
	import Hasher from "@walletpack/core/util/Hasher";

	export default {
		props:['token', 'symbol', 'active', 'img'],
		methods:{
			colorHex(){
				if(!this.token) return null;
				return '#'+Hasher.unsaltedQuickHash(this.token.unique()).slice(0,6);
			},
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.symbol-ball {
		width:46px;
		height:46px;
		border-radius:50%;
		background:$grey;
		display:flex;
		justify-content: center;
		align-items: center;
		text-align:center;
		position: relative;

		.img {
			width:46px;
			height:46px;
			border-radius:50%;
			background-position: center;
			background-size: cover;

		}

		&.base {
			background:rgba(0,0,0,0.06);
		}

		// Lots of tokens makes this slow on mobile :(
		//box-shadow:inset 0 -10px 20px rgba(0,0,0,0.2), inset 0 10px 20px rgba(255,255,255,0.2);

		&:not(.no-after){
			$moonwidth:4px;
			&:after {
				content:'';
				display:block;
				border-radius:50%;
				opacity:0;
				position:absolute;
				top:$moonwidth;
				left:$moonwidth;
				bottom:-$moonwidth;
				right:-$moonwidth;

				transition:$themetransition;
				transition-property: background, opacity;
			}
		}


		i {
			position: relative;
			z-index:2;
			font-size: 24px;
		}

		&.active {
			background:$blue;
			color:#fff;
		}
	}

	.blue-steel {
		.symbol-ball {
			&.base {
				background:rgba(255,255,255,0.06);
			}

			&:after {
				opacity:1;
				background:$dark;
			}
		}
	}

</style>