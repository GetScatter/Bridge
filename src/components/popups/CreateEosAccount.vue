<template>
	<section class="create-eos-account transfer">

		<section class="popup-content" v-if="state === STATES.BUY">
			<figure class="title">Creating <span>Account</span></figure>
			<figure class="sub-title">
				{{network.name}} accounts cost a small fee to create. You can use a credit card to make
				this initial purchase.
			</figure>
			<br>
			<br>
			<figure class="line"></figure>
			<br>
			<br>
			<span>
				Creation will cost <b>{{currency}}{{token.fiatPrice(false) * 0.5}}</b>, however our partners have a {{currency}}20 minumum for credit card purchases, the remainder will be forwarded to your new account.
			</span>
		</section>

		<section class="popup-content" v-if="state === STATES.DONE">
			<figure class="title">Creation <span>Success!</span></figure>
			<figure class="sub-title">
				You now have an account on the {{network.name}}.
			</figure>
		</section>

		<section class="popup-buttons" v-if="state === STATES.BUY">
			<Button :disabled="creating" @click.native="() => closer(null)" text="Cancel" />
			<Button :loading="creating" primary="1" @click.native="buyAccount" icon="fas fa-credit-card" text="Pay with Card" />
		</section>

		<section class="popup-buttons" v-if="state === STATES.DONE">
			<Button @click.native="() => closer(null)" primary="1" text="Done" />
		</section>

	</section>
</template>

<script>

	import Popups from "../../util/Popups";
	import PopupService from "../../services/utility/PopupService";
	import {mapState} from "vuex";
	import Keypair from '@walletpack/core/models/Keypair'
	import KeyPairService from '@walletpack/core/services/secure/KeyPairService'
	import EosioHelpers from "../../services/special/EosioHelpers";
	import {Blockchains} from '@walletpack/core/models/Blockchains'
	import AccountCreator from "../../services/utility/AccountCreator";
	import PriceService from "@walletpack/core/services/apis/PriceService";

	const STATES = {
		BUY:'buy',
		DONE:'done',
	};

	export default {
		props:['popin', 'closer'],
		data(){return {
			STATES,
			state:STATES.BUY,

			creating:false,
			price:0,
			currency:PriceService.fiatSymbol(),
		}},
		computed:{
			...mapState([
				'scatter',
			]),
			network(){
				return this.popin.data.props.network;
			},
			token(){
				return this.network.systemToken();
			},
		},
		mounted(){

		},
		methods:{
			async buyAccount(){
				// PopupService.push(Popups.buyTokens(this.network.systemToken(), 0.5));

				// Get or create a keypair
				let keypair = this.scatter.keychain.keypairs.find(x => x.blockchains[0] === Blockchains.EOSIO);
				if(!keypair){
					keypair = Keypair.placeholder();
					keypair.blockchains = [this.network.blockchain];
					await KeyPairService.generateKeyPair(keypair);
					await KeyPairService.makePublicKeys(keypair);
					keypair.setName();
					await KeyPairService.saveKeyPair(keypair);
				}

				this.creating = true;
				const created = await AccountCreator.createAccount(keypair, this.network, 20);
				this.creating = false;
				if(created) this.state = STATES.DONE;
			}
		},

	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.create-eos-account {
		max-width:400px;
		width:100%;

		.sub-title {
			margin-top:-20px;
			font-size: $font-size-standard;
		}
	}

</style>
