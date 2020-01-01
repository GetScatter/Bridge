<template>
	<section class="receive">

		<section class="popup-content">
			<figure class="title">Your receivable accounts</figure>
			<figure class="sub-title">Make sure you are receiving to the <b>correct network</b>.</figure>

			<section class="scroller">
				<section class="accounts">
					<section class="account" v-for="account in accounts">
						<section class="info">
							<figure class="network">{{account.network().name}}</figure>
							<figure class="name" :class="{'bigger':account.sendable().length < 15}">{{account.sendable()}}</figure>
						</section>

						<section class="actions">
							<Button :primary="copied === account.sendable()"
							        :icon="copied === account.sendable() ? 'far fa-check' : 'far fa-copy'"
							        @click.native="copy(account.sendable())" />
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
	import "../../styles/transfers.scss";
	import {mapActions, mapState} from "vuex";
	import SingularAccounts from "../../services/utility/SingularAccounts";
	import PopupService from "../../services/utility/PopupService";
	import Popups from "../../util/Popups";
	import * as UIActions from '../../store/ui_actions';

	export default {
		props:['popin', 'closer'],
		data(){return {
			copied:null,
			lastPopup:null,
		}},
		computed:{
			...mapState([
				'scatter',
			]),
			accounts(){
				return SingularAccounts.accounts();
			}
		},
		methods:{
			copy(text){
				this.copied = text;
				window.wallet.utility.copy(text);

				const popup = Popups.snackbar(`Copied ${text}`);
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

				&:not(:first-child){
					margin-top:10px;
				}

				.info {
					flex:1;

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
