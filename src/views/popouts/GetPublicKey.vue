<template>
	<section class="get-public-key">
		<section class="content">
			<section class="app-details">
				<PopOutLogos :app="app" />

				<figure class="action">View Public Key</figure>
				<figure class="app-name">via <b>{{app.name}}</b></figure>

				<figure class="text">Your public keys are safe for others to see.</figure>
			</section>
		</section>

		<section class="popout-buttons">
			<Button @click.native="closer" secondary="1" text="Deny" />
			<Button @click.native="accept" primary="1" text="Allow" />
		</section>
	</section>
</template>

<script>
	import {IdentityRequiredFields} from "@walletpack/core/models/Identity";
	import {mapState} from "vuex";
	import PopOutLogos from "../../components/popups/PopOutLogos";

	export default {
		components: {PopOutLogos},
		props:['popup', 'closer'],

		computed:{
			...mapState([
				'scatter',
			]),
			payload(){ return this.popup.payload(); },
			blockchain(){ return this.payload.blockchain; },
			app(){
				return this.popup.data.props.appData;
			},
		},
		methods:{
			accept(){
				const keypair = this.scatter.keychain.keypairs.find(x => x.blockchains.includes(this.blockchain));
				this.$emit('returned', {keypair, isNew:false});
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.get-public-key {
		.content {


		}
	}

</style>