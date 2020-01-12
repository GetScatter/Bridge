<template>
	<section class="app-login">
		<section class="content">
			<section class="app-details">
				<PopOutLogos :app="app" />

				<figure class="action">Login</figure>
				<figure class="app-name">via <b>{{app.name}}</b></figure>

				<figure class="text">By logging into this application you will be allowing it to interact with your Scatter<b v-if="identityFields.length">, and see some of your personal information</b>.</figure>
				<!--<figure class="fields" v-if="identityFields.length">{{app.name}} will be able to see your: {{identityFields.join(', ')}}</figure>-->
			</section>
		</section>

		<section class="popout-buttons">
			<Button @click.native="closer" text="Deny" />
			<Button @click.native="login" primary="1" text="Login" />
		</section>
	</section>
</template>

<script>
	import {IdentityRequiredFields} from "@walletpack/core/models/Identity";
	import {mapState} from "vuex";
	import Network from "@walletpack/core/models/Network";
	import PopOutLogos from "../../components/popups/PopOutLogos";
	import SingularAccounts from "../../services/utility/SingularAccounts";

	export default {
		components: {PopOutLogos},
		props:['popup', 'closer'],
		computed:{
			...mapState([
				'scatter',
			]),
			payload(){ return this.popup.payload(); },
			fields() { return IdentityRequiredFields.fromJson(this.payload.fields); },
			identityFields(){ return this.fields.personal.concat(this.fields.location) },
			accountRequirements() { return this.fields.accounts || []; },
			requestedNetworks(){
				return this.accountRequirements.map(raw => {
					const n = Network.fromJson(raw);
					return this.scatter.settings.networks.find(x => x.unique() === n.unique());
				});
			},
			accounts(){
				return SingularAccounts.accounts(this.requestedNetworks).filter(x => !!x);
			},
			app(){
				return this.popup.data.props.appData;
			},
		},
		mounted(){
			if(!this.accounts.length && this.requestedNetworks.length) return this.closer(null);
		},
		methods:{
			login(){
				this.$emit('returned', {
					identity:this.scatter.keychain.identities[0],
					location:this.scatter.keychain.locations[0],
					accounts:this.accounts,
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../styles/variables";

	.app-login {
		.content {

		}
	}

</style>
