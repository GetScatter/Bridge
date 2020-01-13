<template>
	<section class="receive">

		<section class="popup-content">
			<section v-if="!token">
				<figure class="title">Receivable <span>accounts</span></figure>
				<figure class="sub-title">Each <b>network</b> accepts different types of tokens. Make sure you are selecting the appropriate network.</figure>
			</section>

			<section v-if="token">
				<figure class="title">Receive <span>{{token.symbol}}</span></figure>
				<figure class="sub-title">You can receive {{token.symbol}} to the account listed below.</figure>
			</section>

			<section class="scroller">
				<section class="accounts" v-if="!token">
					<section class="account" v-for="account in accounts">

						<section class="qr" v-if="qrs[account.unique()]">
							<img :src="qrs[account.unique()]" />
						</section>

						<section class="info">
							<figure class="network">{{account.network().name}}</figure>
							<figure class="name" :class="{'bigger':account.sendable().length < 15}">{{account.sendable()}}</figure>
						</section>

						<section class="actions">
							<Button :primary="copied === account.sendable()"
							        :icon="copied === account.sendable() ? 'far fa-check' : 'far fa-copy'"
							        @click.native="copy(account)" />
						</section>
					</section>
				</section>

				<section class="accounts single" v-if="token">
					<section class="account">

						<section class="qr" v-if="qr">
							<img :src="qr" />
						</section>

						<section class="info">
							<figure class="network">{{forcedAccount.network().name}}</figure>
							<figure class="name" :class="{'bigger':forcedAccount.sendable().length < 15}">{{forcedAccount.sendable()}}</figure>
						</section>

						<section class="actions">
							<Button :primary="copied === forcedAccount.sendable()"
							        :icon="copied === forcedAccount.sendable() ? 'far fa-check' : 'far fa-copy'"
							        @click.native="copy(forcedAccount)" />
						</section>
					</section>
				</section>
			</section>
		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Done" primary="1" />
		</section>

	</section>
</template>

<script>
	import Vue from 'vue';
	import "../../styles/transfers.scss";
	import {mapActions, mapState} from "vuex";
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import * as UIActions from '../../store/ui_actions';
	import QRService from "../../services/utility/QRService";

	export default {
		props:['popin', 'closer'],
		data(){return {
			copied:null,
			lastPopup:null,
			qr:null,
			qrs:{},
		}},
		computed:{
			...mapState([
				'scatter',
			]),
			accounts(){
				return SingularAccounts.accounts();
			},
			token(){
				return this.popin.data.props.token;
			},
			forcedAccount(){
				if(!this.token) return;
				return this.accounts.find(x => x.networkUnique === this.token.network().unique());
			}
		},
		mounted(){
			if(this.forcedAccount){
				QRService.createQR(this.forcedAccount.sendable()).then(x => this.qr = x);
			} else {
				this.accounts.map(account => {
					QRService.createQR(account.sendable()).then(x => Vue.set(this.qrs, account.unique(), x));
					this.$forceUpdate();
				})
			}
		},
		methods:{
			copy(account){
				const text = account.sendable();
				this.copied = text;
				window.wallet.utility.copy(text);

				const popup = Popups.snackbar(`Copied ${account.network().name} account to clipboard.`);
				if(this.lastPopup) this[UIActions.RELEASE_POPUP](this.lastPopup);
				this.lastPopup = popup;
				PopupService.push(popup);
			},
			...mapActions([
				UIActions.RELEASE_POPUP
			])
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.receive {
		max-width:400px;
		width:calc(100% - 80px);
		margin:0 auto;
		position: relative;

		.sub-title {
			margin-top:-20px;
			font-size: $font-size-standard;
			color:$blue;
		}

		.scroller {
			margin-top:20px;
			max-height:250px;
			overflow-y: auto;

		}

		.accounts {
			.account {
				text-align:left;
				padding:10px;
				border:1px solid $borderlight;
				border-radius:4px;
				display:flex;
				align-items: center;

				&.singular {
					display:block;
				}

				&:not(:first-child){
					margin-top:10px;
				}

				$qr:80px;
				.qr {
					border-radius:4px;
					overflow: hidden;
					width:$qr;
					height:$qr;
					margin-right:15px;
					flex:0 0 auto;

					img {
						width:$qr;
						height:$qr;
						object-fit: cover;
					}
				}

				.info {
					flex:1;
					padding-right:15px;

					.name {
						font-size: $font-size-small;
						font-weight: bold;
						word-break: break-word;

						&.bigger {
							font-size: $font-size-standard;
						}
					}

					.network {
						font-size: $font-size-small;
						color:$grey;
					}
				}

				.actions {
					flex:0 0 auto;

					button {
						padding:10px;
						height:auto;
						margin-left:5px;
						width:50px;
					}
				}
			}
		}
	}

	.blue-steel {
		.receive {

		}
	}

</style>
