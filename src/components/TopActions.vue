<template>
	<section class="top-actions" :class="{'active':loadingBalanaces}" :style="{'color':topActionsColor}">
		<section class="balance">
			<span class="number">{{totalBalance.symbol}}<AnimatedNumber :number="totalBalance.amount" /></span>
			<span class="refresh" :class="{'loading':loadingBalanaces}" @click="refreshBalances">
				<i class="fad fa-sync-alt" :class="{'animate-spin':loadingBalanaces}"></i>
				<span v-if="!loadingBalanaces">Refresh</span>
				<span v-if="loadingBalanaces">Refreshing</span>
			</span>
		</section>
		<section>
			<figure class="icon" @click="changeTheme"><i class="fad fa-user-cog"></i></figure>
			<figure class="icon"><i class="fad fa-bell"></i></figure>
		</section>
	</section>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import * as UIActions from "../store/ui_actions";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";

	export default {
		data(){return {
			loadingBalanaces:false,
		}},
		computed:{
			...mapState([
				'topActionsColor'
			]),
			totalBalance(){
				return PriceService.getTotal(BalanceService.totalBalances(false).totals);
			},
		},
		mounted(){

		},
		methods:{
			changeTheme(){
				const theme = this.theme === this.THEMES.BLUE_STEEL
					? this.THEMES.FLUORESCENT
					: this.THEMES.BLUE_STEEL
				this[UIActions.SET_THEME](theme);
			},
			async refreshBalances(){
				if(this.loadingBalanaces) return;
				this.loadingBalanaces = true;
				await BalanceService.loadAllBalances(true);
				this.loadingBalanaces = false;
			},

			...mapActions([
				UIActions.SET_THEME
			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.top-actions {
		height:$topactions;
		padding:30px;
		display:flex;
		margin:0 auto;
		position: relative;
		z-index:20;
		transition:max-width 0.12s ease-in-out;

		max-width:$maxwidth-default;

	    @media (min-width:$breakpoint-large-desktop){
	        max-width:$maxwidth-large-desktop;
	    }

	    @media (max-width:$breakpoint-tablet){
	        max-width:$maxwidth-tablet;
	    }

		section {
			flex:0 0 auto;

			&:last-child {
				text-align:right;
				flex:1;
			}
		}

		.balance {
			font-size: $font-size-large;
			font-weight: bold;
			height:30px;
			font-family: 'Poppins', sans-serif;

			.number {
				position: absolute;
				top:30px;
				height:50px;
				transition: all 0.5s ease;
				transition-property: top, opacity;
				opacity:1;
			}
			.refresh {
				position: absolute;
				top:-20px;
				height:50px;
				transition: all 0.5s ease;
				transition-property: top, opacity, color;
				cursor: pointer;
				display:flex;
				align-items: center;
				opacity:0;

				span {
					font-size: $font-size-big;
					padding-left:10px;
				}

				&.loading {
					color:$grey;
				}
			}
		}

		.icon {
			cursor: pointer;
			float:right;
			margin-left:30px;
			font-size: $font-size-large;

			&:hover {
				color:$blue;
			}
		}

		&:hover, &.active {
			.balance {
				.number {
					top:-20px;
					opacity:0;
				}
				.refresh {
					top:20px;
					opacity:1;
				}
			}
		}
	}


</style>
