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
			<figure class="icon" @click="changeTheme"><i class="fas fa-cog"></i></figure>
			<figure class="icon" @click="test"><i class="fas fa-bell">
				<span class="bubble">4</span>
			</i></figure>
			<figure class="icon" @click="scanQr"><i class="fas fa-qrcode"></i></figure>
		</section>
	</section>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import * as UIActions from "../store/ui_actions";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import PopupService from "../services/PopupService";
	import Popups from "../util/Popups";

	export default {
		data(){return {
			loadingBalanaces:false,
		}},
		computed:{
			...mapState([
				'scatter',
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

			test(){
				PopupService.push(Popups.twoFactorAuth(code => {

				}, true))
			},

			scanQr(){
				PopupService.push(Popups.scanQR(data => {
					console.log('data', data);
					// if(data.indexOf('|') > -1){
					// 	const [blockchain, chainId, account] = data.split("|");
					// }

					if(data){
						const account = this.scatter.keychain.accounts[0];
						PopupService.push(Popups.transfer(account, account.network().systemToken(), () => {

						}, 'forcedrecipient'))
					}

				}, true))
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

			i {
				position: relative;

				.bubble {
					padding:4px 8px;
					position: absolute;
					font-size: 13px;
					font-weight: 800;
					background:$blue;
					color:#fff;
					top:-8px;
					left:10px;
					border-radius:10px;
				}
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

	.mobile {
		.top-actions {
			height:60px;
			padding:20px;

			.icon {
				font-size:$font-size-big;
				margin-top:4px;
			}

			.balance {
				font-size: $font-size-big;
				font-weight: bold;
				height:10px;
				font-family: 'Poppins', sans-serif;

				.number {
					position: absolute;
					top:20px;
					height:30px;
				}
				
			}
		}
	}


</style>
