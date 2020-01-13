<template>
	<section class="top-actions">
		<section class="visible-bar" :class="{'active':loadingBalances}" :style="{'color':topActionsColor}">
			<section class="balance">
				<span class="number">{{currency}}<AnimatedNumber :number="totalBalance" /></span>
				<span class="refresh" :class="{'loading':loadingBalances}" @click="refreshBalances">
				<i class="fad fa-sync-alt" :class="{'animate-spin':loadingBalances}"></i>
				<span v-if="!loadingBalances">Refresh Balances</span>
				<span v-if="loadingBalances">Refreshing</span>
			</span>
			</section>
			<section>
				<figure @click="toggleSettings" class="icon"><i class="fas" :class="{'fa-cog':!isSettings, 'fa-times':isSettings}"></i></figure>
				<!--<figure class="icon button"><Button @click.native="transfer" text="Send Money" primary="1" icon="fas fa-paper-plane" /></figure>-->
				<!--<figure @click="transfer" class="icon"><i class="fas fa-paper-plane"></i></figure>-->

				<!-- NOTIFICATIONS, DO NOT REMOVE -->
				<!--<figure class="icon" @click="toggleNotifications"><i class="fas fa-bell">-->
					<!--<span class="bubble" v-if="notifications.length">{{notifications.length}}</span>-->
				<!--</i></figure>-->

				<!-- QR CODE SCANNING -- DO NOT REMOVE -->
				<!--<figure class="icon" @click="scanQr"><i class="fas fa-qrcode"></i></figure>-->
			</section>
		</section>


		<!-- NOTIFICATIONS, DO NOT REMOVE -->
		<section id="notifications" class="notifications" v-if="showingNotifications">
			<section class="notification-list">
				<section class="notification" v-for="notification in notifications">
					<figure class="image">
						<v-lazy-image :src="notification.img" />
					</figure>
					<figure class="text">{{notification.text}}</figure>
					<figure class="actions">
						<i class="far fa-trash"></i>
						<i class="far fa-eye" @click="handleNotification(notification)"></i>
					</figure>
				</section>
			</section>

			<!--<figure class="view-all">-->
				<!--View all notifications-->
			<!--</figure>-->
		</section>
	</section>

</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import * as UIActions from "../store/ui_actions";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import PopupService from "../services/utility/PopupService";
	import Popups from "../util/Popups";
	import ApiService from "@walletpack/core/services/apis/ApiService";
	import BalanceHelpers from "../services/utility/BalanceHelpers";
	import {RouteNames} from "../vue/Routing";
	import SingularAccounts from "../services/utility/SingularAccounts";
	import PluginRepository from '@walletpack/core/plugins/PluginRepository'
	import {STABLE_COINS} from "../services/special/Stabilizer";
	import SingletonService from "../services/utility/SingletonService";

	export default {
		data(){return {
			loadingBalances:false,
			showingNotifications:false,
			notifications:[],
			currency:PriceService.fiatSymbol(),
		}},
		computed:{
			...mapState([
				'scatter',
				'topActionsColor',
				'currencies',
			]),
			totalBalance(){
				if(this.loadingBalances) return 0;
				const stableValue = this.stableCoins.reduce((acc, x) => {
					if(!this.currencies[this.scatter.settings.displayCurrency]) return acc;
					return acc + (parseFloat(x.amount) * this.currencies[this.scatter.settings.displayCurrency]);
				}, 0);
				return parseFloat(parseFloat(BalanceHelpers.fiatTotalFor(this.systemTokens)) + parseFloat(stableValue)).toFixed(2);
			},
			stableCoins(){
				return this.tokens.filter(x => x.amount > 0 && this.isStableCoin(x));
			},
			systemTokens(){
				return this.tokens.filter(x => x.network().systemToken().unique() === x.unique()).filter(x => x.fiatBalance(false) > 0);
			},
			tokens(){
				return BalanceHelpers.tokens()
			},
			isSettings(){
				return this.$route.name === RouteNames.Settings
			}
		},
		mounted(){
			this.loadNotifications();
			document.removeEventListener('click', this.checkIfClosingNotifications);

			if(!SingletonService.isInit()) SingletonService.init();
		},
		methods:{
			transfer(){
				// TODO: Fix for special transfer of MONEY
				// const network = PluginRepository.plugin('eos').getEndorsedNetwork();
				// const account = SingularAccounts.accounts([network])[0];
				// const token = STABLE_COINS[network.blockchain];
				PopupService.push(Popups.transferStable(() => {

				}))
			},
			toggleSettings(){
				if(this.isSettings) this.$router.back();
				else this.$router.push({name:RouteNames.Settings})
			},
			isStableCoin:BalanceHelpers.isStableCoin,
			isSystemToken:BalanceHelpers.isSystemToken,
			loadNotifications(){
				const notification = (text, type = 'announcement') => ({
					text,
					img:'https://images.unsplash.com/photo-1532798369041-b33eb576ef16?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=701&q=80',
					type,
				});
				this.notifications = [
					notification('New Arrival - Enemy Metal'),
					notification(`You've been upgraded to Premium!`),
					notification('Have you enabled Two Factor Authentication yet?', 'enable_2fa'),
					notification('Test out some Scatter Bridge popups', 'test_popups'),
				]
			},
			async refreshBalances(){
				if(this.loadingBalances) return;
				this.loadingBalances = true;
				await BalanceHelpers.loadBalances();
				this.loadingBalances = false;
			},

			checkIfClosingNotifications(event){
				const isNotificationsPopup = function (elem) {
					for ( ; elem && elem !== document; elem = elem.parentNode ) {
						if(elem.id === 'notifications'){
							return true;
						}
					}
					return false;
				};

				if (!isNotificationsPopup(event.target)) {
					this.showingNotifications = false;
					document.removeEventListener('click', this.checkIfClosingNotifications);
				}
			},
			toggleNotifications(){
				this.showingNotifications = !this.showingNotifications;
				if(!this.showingNotifications) document.removeEventListener('click', this.checkIfClosingNotifications);
				else setTimeout(() => document.addEventListener('click', this.checkIfClosingNotifications), 100);
			},

			handleNotification(notification){
				if(notification.type === 'enable_2fa'){

				}

				if(notification.type === 'test_popups'){

				}
			},

			scanQr(){
				PopupService.push(Popups.scanQR(data => {
					console.log('data', data);
					// if(data.indexOf('|') > -1){
					// 	const [blockchain, chainId, account] = data.split("|");
					// }

					// TODO: testing only
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
		margin:0 auto;
		position: relative;
		z-index:20;
		transition:max-width 0.12s ease-in-out;

		max-width:$maxwidth-default;

		.visible-bar {
			display:flex;
			color:#fff;

			section {
				flex:0 0 auto;

				&:last-child {
					text-align:right;
					flex:1;
				}
			}

			.refresh {
				position: absolute;
				top: -20px;
				height: 50px;
				transition: all 0.5s ease;
				transition-property: top, opacity, color;
				cursor: pointer;
				display: flex;
				align-items: center;
				opacity: 0;
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
						font-size: $font-size-small;
						padding-left:10px;
					}

					i {

						font-size: 18px;
					}

					&.loading {
						opacity:0.1;
					}
				}
			}

			.icon {
				cursor: pointer;
				float:right;
				margin-left:30px;
				font-size: $font-size-large;

				&.button {
					margin-top:-8px;
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

	.notifications {
		position:absolute;
		top:$topactions;
		right:50px;
		width:400px;
		max-height:300px;
		padding:10px;
		background:$light;
		z-index:99;
		box-shadow: 0 5px 24px 0 rgba(7,153,255,0.18);
		border-radius:10px;

		transition:all 0.2s ease;
		transition-property: width, left, right;

		.notification-list {
			max-height:200px;
			overflow-y: auto;
			padding-right:10px;

			.notification {
				display:flex;
				align-items: center;
				padding:10px;
				cursor: pointer;

				&:not(:last-child){
					border-bottom:1px solid $borderlight;
				}


				.image {
					height:40px;
					width:40px;
					overflow: hidden;
					border-radius:4px;
					margin-right:10px;
					flex:0 0 auto;

					img {
						width:100%;
						height:100%;
						object-fit: cover;
					}
				}

				.text {
					flex:1;
					font-size: $font-size-standard;
				}

				.actions {
					flex:0 0 auto;
					padding-left:40px;
					font-size: 14px;
					color:$blue;

					i {
						padding:5px 8px;

						&:hover {
							background:$blue;
							color:#fff;
							border-radius:4px;
						}
					}
				}
			}
		}

		.view-all {
			cursor: pointer;
			margin-top:20px;
			padding:20px 10px 10px;
			font-size: $font-size-small;
			font-weight: bold;
			border-top:1px solid $borderlight;
			color:$blue;
			text-transform: uppercase;
		}

	}

	.mobile {
		.notifications {
			width:calc(100% - 40px);
			left:20px;
			right:20px;
		}
	}

	.blue-steel {
		.notifications {
			background:lighten($dark, 5%);
			box-shadow: 0 5px 24px 0 rgba(0,0,0,0.4);

			.notification-list {
				.notification {

					&:not(:last-child){
						border-bottom:1px solid $borderdark;
					}


				}
			}

			.view-all {
				border-top:1px solid $borderdark;
			}

		}
	}


</style>
