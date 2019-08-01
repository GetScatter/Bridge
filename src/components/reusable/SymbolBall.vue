<template>
	<figure class="symbol-ball" :style="{'background-color':colorHex(token)}" :class="{'base':!token, 'active':active}">
		<i v-if="symbol" :class="symbol"></i>
	</figure>
</template>

<script>
	import Hasher from "@walletpack/core/util/Hasher";

	export default {
		props:['token', 'symbol', 'active'],
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

		&.base {
			background:rgba(0,0,0,0.06);
		}

		// Lots of tokens makes this slow on mobile :(
		//box-shadow:inset 0 -10px 20px rgba(0,0,0,0.2), inset 0 10px 20px rgba(255,255,255,0.2);

		&:after {
			content:'';
			display:block;
			width:46px;
			height:46px;
			border-radius:50%;
			opacity:0;
			position:absolute;
			top:2px;
			left:2px;

			transition:all 1s ease;
			transition-property: background, opacity;
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