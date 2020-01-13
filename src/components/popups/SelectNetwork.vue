<template>
	<section class="select-network">

		<section class="popup-content">
			<figure class="title">Select a <span>Network</span></figure>
			<figure class="sub-title">Keys are associated with networks, please select one to continue.</figure>

			<section class="scroller">
				<section class="accounts">
					<section class="account" v-for="network in networks">
						<section class="info">
							<figure class="network">{{blockchainName(network.blockchain)}}</figure>
							<figure class="name">{{network.name}}</figure>
						</section>

						<section class="actions">
							<Button text="Select" primary="1" @click.native="closer(network)" />
						</section>
					</section>
				</section>
			</section>
		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" primary="1" />
		</section>

	</section>
</template>

<script>
	import "../../styles/transfers.scss";
	import {mapActions, mapState} from "vuex";
	import * as UIActions from '../../store/ui_actions';
	import {blockchainName} from '@walletpack/core/models/Blockchains'

	export default {
		props:['popin', 'closer'],
		data(){return {
			copied:null,
			lastPopup:null,
			blockchainName
		}},
		computed:{
			...mapState([
				'scatter',
			]),
			networks(){
				return this.scatter.settings.networks;
			},
		},
		methods:{

			...mapActions([
				UIActions.RELEASE_POPUP
			])
		},
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.select-network {
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
					}

					.network {
						font-size: $font-size-tiny;
						color:$grey;
					}
				}

				.actions {
					flex:0 0 auto;

					button {
						padding:10px;
						height:auto;
						margin-left:5px;
					}
				}
			}
		}
	}

	.blue-steel {
		.select-network {

		}
	}

</style>
