<template>
	<section class="top-actions">
		<section class="visible-bar" :class="{'active':loadingBalanaces}" :style="{'color':topActionsColor}">
			<section class="balance">
				<span class="number">{{totalBalance.symbol}}<AnimatedNumber :number="totalBalance.amount" /></span>
				<span class="refresh" :class="{'loading':loadingBalanaces}" @click="refreshBalances">
				<i class="fad fa-sync-alt" :class="{'animate-spin':loadingBalanaces}"></i>
				<span v-if="!loadingBalanaces">Refresh</span>
				<span v-if="loadingBalanaces">Refreshing</span>
			</span>
			</section>
			<section>
				<router-link :to="{name:RouteNames.Settings}" class="icon"><i class="fas fa-cog"></i></router-link>
				<figure class="icon" @click="showingNotifications = !showingNotifications"><i class="fas fa-bell">
					<span class="bubble" v-if="notifications.length">{{notifications.length}}</span>
				</i></figure>
				<figure class="icon" @click="scanQr"><i class="fas fa-qrcode"></i></figure>
			</section>
		</section>


		<section class="notifications" v-if="showingNotifications">
			<section class="notification-list">
				<section class="notification" v-for="notification in notifications">
					<figure class="image">
						<v-lazy-image :src="notification.img" />
					</figure>
					<figure class="text">{{notification.text}}</figure>
					<figure class="actions">
						<i class="far fa-trash"></i>
						<i class="far fa-eye"></i>
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

	export default {
		data(){return {
			loadingBalanaces:false,
			showingNotifications:false,
			notifications:[],
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
			this.loadNotifications();
		},
		methods:{
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
				if(this.loadingBalanaces) return;
				this.loadingBalanaces = true;
				await BalanceService.loadAllBalances(true);
				this.loadingBalanaces = false;
			},

			async test(){
				// TODO: Tests login popup
				console.log(await ApiService.handler({
					type:'getOrRequestIdentity',
					payload:{
						fields:{
							accounts:this.scatter.settings.networks.filter(x => x.blockchain === 'eos')
						},
						origin:'bloks.io'
					}
				}))

				// TODO: Tests signature popup for transfer only
				console.log(await ApiService.handler({
					"type":"requestSignature",
					"payload":{"origin":"bloks.io", "transaction":{"expiration":"2019-08-06T14:36:08","ref_block_num":73,"ref_block_prefix":1734201210,"max_net_usage_words":0,"max_cpu_usage_ms":0,"delay_sec":0,"context_free_actions":[],"actions":[{"account":"eosio.token","name":"transfer","authorization":[{"actor":"ramdeathtest","permission":"active"}],"data":"90b1ca2d1b95a4b970d5c2d3dcac96c1010000000000000004454f53000000000c72616d646561746874657374"}],"transaction_extensions":[]},"buf":{"type":"Buffer","data":[172,163,118,242,6,184,252,37,166,237,68,219,220,102,84,124,54,198,195,62,58,17,159,251,234,239,148,54,66,240,233,6,88,144,73,93,73,0,122,207,93,103,0,0,0,0,1,0,166,130,52,3,234,48,85,0,0,0,87,45,60,205,205,1,144,177,202,45,27,149,164,185,0,0,0,0,168,237,50,50,45,144,177,202,45,27,149,164,185,112,213,194,211,220,172,150,193,1,0,0,0,0,0,0,0,4,69,79,83,0,0,0,0,12,114,97,109,100,101,97,116,104,116,101,115,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"blockchain":"eos","network":{"name":"","protocol":"https","host":"nodes.get-scatter.com","port":443,"blockchain":"eos","chainId":"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906","token":null},"requiredFields":{}}
				}))

				// TODO: Tests signature popup for non-transfer only
				console.log(await ApiService.handler({
					"type":"requestSignature",
					"payload":{"origin":"bloks.io", "transaction":{"expiration":"2019-08-06T20:14:48","ref_block_num":40702,"ref_block_prefix":3980264335,"max_net_usage_words":0,"max_cpu_usage_ms":0,"delay_sec":0,"context_free_actions":[],"actions":[{"account":"wizardstoken","name":"createwizard","authorization":[{"actor":"ramdeathtest","permission":"active"}],"data":""}],"transaction_extensions":[]},"buf":{"type":"Buffer","data":[172,163,118,242,6,184,252,37,166,237,68,219,220,102,84,124,54,198,195,62,58,17,159,251,234,239,148,54,66,240,233,6,184,223,73,93,254,158,143,3,62,237,0,0,0,0,1,48,21,164,25,167,107,190,227,144,174,249,142,171,108,212,69,1,144,177,202,45,27,149,164,185,0,0,0,0,168,237,50,50,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"blockchain":"eos","network":{"name":"","protocol":"https","host":"nodes.get-scatter.com","port":443,"blockchain":"eos","chainId":"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906","token":null},"requiredFields":{}}
				}))

				// TODO: Tests signature popup for transfer + actions
				console.log(await ApiService.handler({
					"type":"requestSignature",
					"payload":{"origin":"bloks.io", "transaction":{"expiration":"2019-08-06T20:21:52","ref_block_num":41539,"ref_block_prefix":258496420,"max_net_usage_words":0,"max_cpu_usage_ms":0,"delay_sec":0,"context_free_actions":[],"actions":[{"account":"eosio","name":"newaccount","authorization":[{"actor":"ramdeathtest","permission":"active"}],"data":"90b1ca2d1b95a4b90000000000ea3055010000000100037f18eaa1ad1b436c128cd0293bf323d6b7f18f8c23cdd6a5cf8715b634df929c01000000010000000100037f18eaa1ad1b436c128cd0293bf323d6b7f18f8c23cdd6a5cf8715b634df929c01000000"},{"account":"eosio","name":"delegatebw","authorization":[{"actor":"ramdeathtest","permission":"active"}],"data":"90b1ca2d1b95a4b990b1ca2d1b95a4b9102700000000000004454f5300000000102700000000000004454f530000000000"},{"account":"eosio.token","name":"transfer","authorization":[{"actor":"ramdeathtest","permission":"active"}],"data":"90b1ca2d1b95a4b90000000000ea3055102700000000000004454f530000000000"}],"transaction_extensions":[]},"buf":{"type":"Buffer","data":[172,163,118,242,6,184,252,37,166,237,68,219,220,102,84,124,54,198,195,62,58,17,159,251,234,239,148,54,66,240,233,6,96,225,73,93,67,162,164,87,104,15,0,0,0,0,3,0,0,0,0,0,234,48,85,0,64,158,154,34,100,184,154,1,144,177,202,45,27,149,164,185,0,0,0,0,168,237,50,50,102,144,177,202,45,27,149,164,185,0,0,0,0,0,234,48,85,1,0,0,0,1,0,3,127,24,234,161,173,27,67,108,18,140,208,41,59,243,35,214,183,241,143,140,35,205,214,165,207,135,21,182,52,223,146,156,1,0,0,0,1,0,0,0,1,0,3,127,24,234,161,173,27,67,108,18,140,208,41,59,243,35,214,183,241,143,140,35,205,214,165,207,135,21,182,52,223,146,156,1,0,0,0,0,0,0,0,0,234,48,85,0,0,63,42,27,166,162,74,1,144,177,202,45,27,149,164,185,0,0,0,0,168,237,50,50,49,144,177,202,45,27,149,164,185,144,177,202,45,27,149,164,185,16,39,0,0,0,0,0,0,4,69,79,83,0,0,0,0,16,39,0,0,0,0,0,0,4,69,79,83,0,0,0,0,0,0,166,130,52,3,234,48,85,0,0,0,87,45,60,205,205,1,144,177,202,45,27,149,164,185,0,0,0,0,168,237,50,50,33,144,177,202,45,27,149,164,185,0,0,0,0,0,234,48,85,16,39,0,0,0,0,0,0,4,69,79,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"blockchain":"eos","network":{"name":"","protocol":"https","host":"nodes.get-scatter.com","port":443,"blockchain":"eos","chainId":"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906","token":null},"requiredFields":{}}
				}))




				// TODO: Allow enabling 2fa from settings
				// PopupService.push(Popups.twoFactorAuth(code => {
				//
				// }, true))
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
