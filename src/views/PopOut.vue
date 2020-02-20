<template>
	<section>
		<section v-if="popOut">
			<PopOutHead v-on:closed="returnResult"  />

			<AppLogin class="popout" v-if="popupType === apiActions.LOGIN || popupType === apiActions.LOGIN_ALL" :popup="popup" :closer="() => returnResult(null)" v-on:returned="returnResult" />
			<Signature class="popout" v-if="popupType === apiActions.SIGN || popupType === apiActions.SIGN_ARBITRARY" :popup="popup" :closer="() => returnResult(null)" v-on:returned="returnResult" />
			<GetPublicKey class="popout" v-if="popupType === apiActions.GET_PUBLIC_KEY" :popup="popup" :closer="() => returnResult(null)" v-on:returned="returnResult" />
			<TransferRequest class="popout" v-if="popupType === apiActions.TRANSFER" :popup="popup" :closer="() => returnResult(null)" v-on:returned="returnResult" />
			<UpdateIdentity class="popout" v-if="popupType === apiActions.UPDATE_IDENTITY" :popup="popup" :closer="() => returnResult(null)" v-on:returned="returnResult" />
			<LinkApp class="popout" :popup="popup" v-if="popupType === 'linkApp'" :closer="() => returnResult(null)" v-on:returned="returnResult" />

			<WidgetMoonpay class="popout" :popup="popup" v-if="popupType === 'moonpay'" :closer="() => returnResult(null)" v-on:returned="returnResult" />
			<WidgetKYC class="popout" :popup="popup" v-if="popupType === 'kyc'" :closer="() => returnResult(null)" v-on:returned="returnResult" />

		</section>
	</section>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import * as Actions from '@walletpack/core/store/constants';
	import Scatter from '@walletpack/core/models/Scatter';
	import * as ApiActions from '@walletpack/core/models/api/ApiActions';
	import {Popup} from "../models/popups/Popup";
	import * as UIActions from "../store/ui_actions";
	import PasswordHelpers from "../services/utility/PasswordHelpers";
	import PopOutHead from "../components/popouts/PopOutHead";

	export default {
		data () {return {
			apiActions:ApiActions,
			pinning:false,
			isExtension:false,
			isNativeMobile:false,
		}},
		components:{
			AppLogin:() => import('./popouts/AppLogin'),
			Signature:() => import('./popouts/Signature'),
			GetPublicKey:() => import('./popouts/GetPublicKey'),
			TransferRequest:() => import('./popouts/TransferRequest'),
			LinkApp:() => import('./popouts/LinkApp'),
			UpdateIdentity:() => import('./popouts/UpdateIdentity'),
			PopOutHead,

			WidgetMoonpay:() => import('./popouts/widgets/Moonpay'),
			WidgetKYC:() => import('./popouts/widgets/KYC'),
		},
		async created(){

			// Bridge
			if(window.hasOwnProperty('getData')){
				const data = window.getData();
				const {popup, scatter} = data.data;
				this[UIActions.SET_POPOUT](popup);
				this[Actions.HOLD_SCATTER](Scatter.fromJson(scatter));
			}

			// Injected wallet
			else {


				this.isExtension = this.$route.query.extension;
				this.isNativeMobile = !!window.PopOutWebView;

				if(!!this.isExtension || !!this.isNativeMobile){

					const {popout, scatter} = this.isExtension
						? await window.wallet.utility.getPopOut(this.$route.query.extension)
						: JSON.parse(await window.PopOutWebView.getPopOut());

					this[UIActions.SET_POPOUT](popout);
					this[Actions.HOLD_SCATTER](Scatter.fromJson(scatter));
					window.onbeforeunload = () => {
						this.returnResult();
						return undefined;
					}
				}
			}



			this.setup();
		},
		computed:{
			...mapState([
				'scatter',
				'popOut',
			]),
			popup(){ return this.popOut ? Popup.fromJson(this.popOut) : null },
			appData(){ return this.popOut ? this.popOut.data.props.appData : null; },
			payload(){ return this.popOut ? this.popOut.data.props.payload : null },
			popupType(){ return this.popOut ? this.popOut.data.type : null },
		},
		methods: {
			async returnResult(result){
				// window.respond(result);
				// window.close();
				// if(!window.closed) window.destroy();

				const formattedResult = {original:this.popOut, result};
				this.isNativeMobile
					? await window.PopOutWebView.popoutResponse(JSON.stringify(formattedResult))    // Only needed for native mobile wallets
					: await window.wallet.utility.popoutResponse(formattedResult);                  // Only needed for native mobile wallets


				if(this.isExtension)        window.close();
				if(this.isNativeMobile)     window.PopOutWebView.close();
				else                        window.wallet.utility.closeWindow(window.wallet.windowId);

			},
			async checkAppReputation(){
				// this[UIActions.SET_APP_REP](await RIDLService.checkApp(this.appData.applink));
			},
			async setup(){
				if(!this.popOut) return;

				// Should never happen on mobile or extension,
				// no need for handling.
				if(!this.scatter) {
					// This window opens before-hand and hangs around in memory waiting to be
					// displayed. This means that the scatter reference on its store is from the past
					// We need to re-generate the Scatter data for it to be up-to-date.
					let scatter = await window.wallet.storage.getWalletData();
					if (!scatter) this.returnResult(null);
					scatter = Scatter.fromJson(scatter);
					this[Actions.HOLD_SCATTER](scatter);
				}



				this.checkAppReputation();

				const needsPIN = [
					ApiActions.SIGN_ARBITRARY,
					ApiActions.SIGN,
					ApiActions.TRANSFER
				];

				setTimeout(async () => {
					if(this.scatter.pinForAll && needsPIN.includes(this.popup.data.type)){
						this.pinning = true;
						if(! await PasswordHelpers.verifyPIN()){
							this.returnResult(null);
						}
						this.pinning = false;
					}
				})
			},
			...mapActions([
				Actions.HOLD_SCATTER,
				UIActions.SET_POPOUT,
			])
		},
		watch:{
			['popOut'](a,b){
				if(b === null){
					this.setup();
				}
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	@import "../styles/variables";

	.popout {
		display:flex;
		width:100%;
		height:calc(100vh - 40px);
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

			border-left:1px solid $borderlight;
			border-right:1px solid $borderlight;

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
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					&.secondary {
						margin-top:5px;
						font-size: $font-size-standard;
						color:$grey;
					}

					&.tokens {
						font-size: 28px;
					}

					&.more-transfers {
						font-size: $font-size-tiny;
						margin-top:5px;

						span {
							display: block;
							margin-top:5px;
							color:$grey;
							font-size: 9px;
						}
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

					&.transfer-details {
						font-size: $font-size-tiny;
						color:$grey;
						padding:5px 10px;
						border-radius:4px;
						display:table;
						margin:10px auto 0;
						background:rgba(0,0,0,0.02);

						b {
							text-decoration: none;
						}
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

			border-left:1px solid darken($softblue, 5);
			border-right:1px solid darken($softblue, 5);
			border-bottom:1px solid darken($softblue, 5);

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

				border-left:1px solid $borderdark;
				border-right:1px solid $borderdark;


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

				border-left:1px solid $dark;
				border-right:1px solid $dark;
				border-bottom:1px solid $dark;
			}
		}
	}

</style>
