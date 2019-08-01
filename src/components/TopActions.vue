<template>
	<section class="top-actions" :style="{'color':topActionsColor}">
		<section class="balance">
			<span class="number">{{totalBalance.symbol}}<AnimatedNumber :number="totalBalance.amount" /></span>
			<span class="refresh"><i class="fas fa-sync-alt"></i> <span>Refresh</span></span>
		</section>
		<section>
			<figure class="icon" @click="changeTheme"><i class="fas fa-cog"></i></figure>
			<figure class="icon"><i class="far fa-bell"></i></figure>
		</section>
	</section>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import * as UIActions from "../store/ui_actions";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";

	export default {
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
		max-width:$maxwidth;
		margin:0 auto;
		position: relative;
		z-index:20;

		section {
			flex:0 0 auto;

			&:last-child {
				text-align:right;
				flex:1;
			}
		}

		.balance {
			font-size: 28px;
			font-weight: bold;
			height:30px;

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
				transition-property: top, opacity;
				cursor: pointer;
				display:flex;
				align-items: center;
				opacity:0;

				span {
					font-size: 18px;
					padding-left:10px;
				}
			}

			&:hover {
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

		.icon {
			cursor: pointer;
			float:right;
			margin-left:30px;
			font-size: 22px;

			&:hover {
				color:$blue;
			}
		}
	}


</style>
