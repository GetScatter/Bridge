<template>
	<section>
		<section v-if="windowMessage">
			<section>

				<AppLogin class="popout" v-if="popupType === apiActions.LOGIN || popupType === apiActions.LOGIN_ALL" :popup="popup" :closer="() => returnResult(null)" v-on:returned="returnResult" />
				<Signature class="popout" v-if="popupType === apiActions.SIGN || popupType === apiActions.SIGN_ARBITRARY" :popup="popup" :closer="() => returnResult(null)" v-on:returned="returnResult" />
				<GetPublicKey class="popout" v-if="popupType === apiActions.GET_PUBLIC_KEY" :popup="popup" :closer="() => returnResult(null)" v-on:returned="returnResult" />
				<TransferRequest class="popout" v-if="popupType === apiActions.TRANSFER" :popup="popup" :closer="() => returnResult(null)" v-on:returned="returnResult" />
				<UpdateIdentity class="popout" v-if="popupType === apiActions.UPDATE_IDENTITY" :popup="popup" :closer="() => returnResult(null)" v-on:returned="returnResult" />
				<LinkApp class="popout" :popup="popup" v-if="popupType === 'linkApp'" :closer="() => returnResult(null)" v-on:returned="returnResult" />

			</section>

		</section>
	</section>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import * as Actions from '@walletpack/core/store/constants';
	import Scatter from '@walletpack/core/models/Scatter';
	import * as ApiActions from '@walletpack/core/models/api/ApiActions';
	import {Popup} from "../models/popups/Popup";
	import Token from "@walletpack/core/models/Token";
	import BalanceService from "@walletpack/core/services/blockchain/BalanceService";
	import PriceService from "@walletpack/core/services/apis/PriceService";

	export default {
		data () {return {
			apiActions:ApiActions,
			windowMessage:null,
			pinning:false,
		}},
		components:{
			AppLogin:() => import('./popouts/AppLogin'),
			Signature:() => import('./popouts/Signature'),
			GetPublicKey:() => import('./popouts/GetPublicKey'),
			TransferRequest:() => import('./popouts/TransferRequest'),
			LinkApp:() => import('./popouts/LinkApp'),
			UpdateIdentity:() => import('./popouts/UpdateIdentity'),
		},
		created(){
			const setWindowMessage = wm => {
				this.windowMessage = wm;
				this[Actions.HOLD_SCATTER](Scatter.fromJson(this.windowMessage.data.scatter));
			}

			setWindowMessage(window.getData());
		},
		computed:{
			...mapState([
				'scatter',
			]),
			popup(){ return Popup.fromJson(this.windowMessage.data.popup) },
			appData(){ return this.windowMessage.data.popup.data.props.appData; },
			payload(){ return this.windowMessage.data.popup.data.props.payload },
			popupType(){ return this.windowMessage.data.popup.data.type },
		},
		methods: {
			async returnResult(result){
				window.respond(result);
				window.close();
				if(!window.closed) window.destroy();
			},
			...mapActions([
				Actions.HOLD_SCATTER,
			])
		},
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	@import "../styles/variables";

	.popout {
		display:flex;
		width:100%;
		height:100vh;
		flex-direction: column;
		overflow:hidden;


		.switcher {
			border-top:0;
			height: 45px;
			line-height: 44px;

			.type {
				flex:1;
				text-align:center;
				margin:0;
			}
		}

		.content {
			flex:1;
			padding:40px;
			position: relative;
			display:flex;
			justify-content: center;
			align-items: center;
			overflow-y:auto;

			&.no-flex {
				display:block;
			}



			.app-details {
				text-align:center;
				width:100%;

				.logos {
					display:flex;
					justify-content: space-evenly;
					align-items: center;
					position: relative;
					width:100%;

					&:after {
						content:'';
						position: absolute;
						display:block;
						top:50%;
						left:-40px;
						right:-40px;
						height:1px;
						background:$borderlight;
						z-index:-1;
					}
				}

				.logo {
					background:$light;
					position: relative;
					width:100px;
					height:100px;
					display:flex;
					justify-content: center;
					align-items: center;
					border-radius:20px;
					font-weight: bold;

					img {
						width:100px;
						height:100px;
						overflow: hidden;
						border-radius:20px;
					}
				}

				.action {
					font-size: $font-size-large;
					font-weight: bold;
					color:$blue;
					margin-top:30px;
				}

				.actions {
					font-size: $font-size-small;
					margin:2px 0 20px;
				}

				.transfer-value {
					font-size: $font-size-huge;
					font-weight: bold;
					text-align:center;
					margin-top:30px;

					&.secondary {
						margin-top:5px;
						font-size: $font-size-standard;
						color:$grey;
					}

					&.tokens {
						font-size: 28px;
					}
				}

				.app-name {
					font-weight: bold;
					margin-top:5px;
					font-size: $font-size-standard;

					b {
						text-decoration: underline;
						color:$blue;

					}
				}

				.text {
					font-size: $font-size-small;
					color:$grey;
					margin-top:30px;
				}
			}



		}

		.popout-buttons {
			display:flex;
			flex:0 0 auto;
			background:$softblue;
			padding:20px;

			button {
				flex:1;

				&:last-child {
					margin-left:10px;
				}
			}
		}

	}



	.blue-steel {
		.popout {
			.content {
				.app-details {
					.logo {
						background:$dark;

						&:after {
							background:$borderdark;
						}
					}
				}
			}

			.popout-buttons {
				background:lighten($dark, 3%);
			}
		}
	}

</style>
