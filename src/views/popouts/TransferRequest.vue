<template>
	<section class="re-link-app">
		<section class="content">
			<section class="app-details">
				<PopOutLogos :app="app" />

				<figure class="action">Transfer</figure>
				<figure class="app-name">via <u>{{app.name}}</u></figure>
				<figure class="app-name">to <b>{{to}}</b></figure>

				<section v-if="amount > 0">
					<section v-if="fiatAmount">
						<figure class="transfer-value">{{currency}}{{fiatAmount}}</figure>
						<figure class="transfer-value secondary">{{token.amount}} {{token.symbol}}</figure>
					</section>

					<section v-if="!fiatAmount">
						<figure class="transfer-value tokens">{{token.amount}} {{token.symbol}}</figure>
					</section>
				</section>

				<TransferHead v-else class="transfer" :token="token" v-on:amount="x => customAmount = x" />

				<section class="memo" v-if="memo">
					<label>memo</label>
					<figure class="text">{{memo}}</figure>
				</section>
			</section>
		</section>

		<section class="popout-buttons">
			<Button @click.native="closer" text="Deny" />
			<Button @click.native="send" primary="1" text="Send" />
		</section>
	</section>
</template>

<script>
	import {IdentityRequiredFields} from "@walletpack/core/models/Identity";
	import {mapState} from "vuex";
	import Token from "@walletpack/core/models/Token";
	import PriceService from "@walletpack/core/services/apis/PriceService";
	import Network from "@walletpack/core/models/Network";
	import TransferHead from "../../components/reusable/TransferHead";
	import TokenService from "@walletpack/core/services/utility/TokenService";
	import {Blockchains} from "@walletpack/core/models/Blockchains";
	import PopOutLogos from "../../components/popups/PopOutLogos";
	import SingularAccounts from "../../services/utility/SingularAccounts";

	export default {
		components: {PopOutLogos, TransferHead},
		props:['popup', 'closer'],
		data(){return {
			customAmount:0,
		}},
		created(){
			PriceService.setPrices();
		},
		computed:{
			...mapState([
				'scatter',
			]),
			app(){
				return this.popup.data.props.appData;
			},


			payload(){ return this.popup.payload(); },
			network(){ return this.scatter.settings.networks.find(x => x.unique() === Network.fromJson(this.payload.network).unique()); },
			blockchain(){ return this.network.blockchain; },
			to(){ return this.payload.to; },
			decimals(){ return this.options.decimals || PluginRepository.plugin(this.blockchain).defaultDecimals(); },
			amount(){ return parseFloat(this.payload.amount).toFixed(this.decimals); },
			options(){ return this.payload.options || {}; },
			memo(){ return this.payload.memo; },
			token(){
				return Token.fromJson({
					contract:this.payload.contract,
					blockchain:this.blockchain,
					symbol:this.payload.symbol,
					decimals:this.decimals,
					name:this.payload.symbol,
					amount:this.amount,
					chainId:this.network.chainId,
				})
			},
			fiatAmount(){
				return this.token.fiatPrice(false) * parseFloat(this.token.amount)
			},
			currency(){
				return PriceService.fiatSymbol()
			},
		},
		methods:{
			send(){
				let amount = this.amount > 0 ? this.amount : this.customAmount;
				if(parseFloat(amount) <= 0) return;
				amount = parseFloat(amount).toFixed(this.decimals);
				const account = SingularAccounts.accounts([this.network])[0];
				this.$emit('returned', { account, amount });
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.re-link-app {
		.content {


			.memo {
				margin-top:20px;

				label {
					font-size: $font-size-tiny;
					color:$grey;
				}

				.text {
					margin-top:2px;
					color:inherit;
					max-height:50px;
					overflow-y:auto;
				}
			}

			.transfer-head {
				margin-top:30px;
			}

		}
	}

</style>
