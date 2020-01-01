<template>
	<section class="create-eos-account transfer">

		<section class="popup-content">
			<figure class="title">Creating new <span>account</span></figure>
			<figure class="sub-title">
				{{network.name}} accounts require various resources in order to use.
				Because of this, you will have to pay a small fee to create your account.
				<br>
				<br>
				<figure class="line"></figure>
				<br>
				<br>
				<b>Creation will cost 0.5 {{network.systemToken().symbol}}</b>
			</figure>
		</section>

		<section class="popup-buttons">
			<Button @click.native="() => closer(null)" text="Cancel" />
			<Button primary="1" @click.native="buyAccount" icon="fas fa-credit-card" text="Pay with Card" />
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

	export default {
		props:['popin', 'closer'],
		data(){return {

		}},
		computed:{
			...mapState([
				'scatter',
			]),
			network(){
				return this.popin.data.props.network;
			},
		},
		methods:{
			async buyAccount(){
				// PopupService.push(Popups.buyTokens(this.network.systemToken(), 0.5));

				// Get or create a keypair
				let keypair = this.scatter.keychain.keypairs.find(x => x.blockchain === Blockchains.EOSIO);
				if(!keypair){
					keypair = Keypair.placeholder();
					keypair.blockchains = [this.network.blockchain];
					await KeyPairService.generateKeyPair(keypair);
					await KeyPairService.makePublicKeys(keypair);
					keypair.setName();
					await KeyPairService.saveKeyPair(keypair);
				}

				const publicKey = keypair.publicKeys.find(x => x.blockchain === this.network.blockchain).key;
				const random = await EosioHelpers.getRandomName();
				const email = this.scatter.keychain.identities[0].personal.email;
				const bought = await PopupService.push(Popups.moonpay(this.network.systemToken(), 5,'makeaccounts', `${publicKey},${random}`, email))

				// TODO: Need to wait for account creation, and then auto-refresh/find account internally.
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
