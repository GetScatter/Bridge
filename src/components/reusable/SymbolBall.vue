<template>
	<figure class="symbol-ball" :style="{'background-color':tokenLogo ? null : colorHex, color:colorHex ? 'white' : 'inherit'}" :class="{'base':!token, 'active':active}">
		<div v-if="token" class="has-token">
			<figure     class="symbol-holder as-class"    v-if="token.symbolClass() || stableClass" :class="token.symbolClass() || stableClass"></figure>
			<img        class="symbol-holder as-image"    v-else-if="tokenLogo" :src="tokenLogo" />
			<figure     class="symbol-holder as-text"     v-else>{{token.symbol[0]}}</figure>
		</div>
		<div v-else>
			<i v-if="symbol" :class="symbol"></i>
			<div class="img" v-if="img" :style="`background-image:url(${img})`" />
		</div>
	</figure>
</template>

<script>
	import Hasher from "@walletpack/core/util/Hasher";
	import {mapState} from "vuex";
	import BalanceHelpers from "../../services/utility/BalanceHelpers";

	export default {
		props:['token', 'symbol', 'active', 'img'],
		computed:{
			tokenLogo(){
				if(!this.tokenMetas) return;
				if(!this.token) return;
				return this.tokenMetas[this.token.uniqueWithChain()]
			},
			stableClass(){
				if(!this.token) return;
				if(this.tokenLogo) return;
				if(BalanceHelpers.isStableCoin(this.token)) return 'fas fa-donate';
				return false;
			},
			colorHex(){
				if(!this.token) return null;
				if(!this.token.symbolClass() && this.tokenLogo) return null;
				return '#'+Hasher.unsaltedQuickHash(this.token.unique()).slice(0,6);
			},
			...mapState([
				'tokenMetas',
			])
		},
		methods:{

		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.symbol-ball {
		width:46px;
		height:46px;
		border-radius:50%;
		display:flex;
		justify-content: center;
		align-items: center;
		text-align:center;
		position: relative;
		overflow: hidden;

		.has-token {
			border-radius: 50%;
			overflow: hidden;
		}

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



		i {
			position: relative;
			z-index:2;
			font-size: 24px;
		}

		&.active {
			background:$blue !important;
			color:#fff !important;
		}

		.symbol-holder {
			width: 44px;
			height: 44px;
			text-align: center;
			font-size: 32px;
			display:flex;
			align-items: center;
			justify-content: center;
			color:white;
		}
	}

	.blue-steel {
		.symbol-ball {
			&.base {
				background:rgba(255,255,255,0.06);
			}
		}
	}

</style>
