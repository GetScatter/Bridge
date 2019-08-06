<template>
	<section class="app-login">
		<section class="content">
			<section class="app-details">
				<section class="logos">
					<figure class="logo">
						<!--<Scatter v-if="app.applink === 'Scatter'" />-->
						<img v-if="app.img" :src="app.img" />
						<span v-else>{{app.name}}</span>
					</figure>
				</section>

				<figure class="action">Login</figure>
				<figure class="app-name">via <b>{{app.name}}</b></figure>

				<figure class="text">By logging into this application you will be allowing it to interact with your Scatter, and see some of your personal information.</figure>
			</section>
		</section>

		<section class="buttons">
			<Button @click.native="closer" secondary="1" text="Deny" />
			<Button @click.native="login" primary="1" text="Login" />
		</section>
	</section>
</template>

<script>
	import {IdentityRequiredFields} from "@walletpack/core/models/Identity";
	import {mapState} from "vuex";
	import Network from "@walletpack/core/models/Network";

	export default {
		props:['popup', 'closer'],

		computed:{
			...mapState([
				'scatter',
			]),
			payload(){ return this.popup.payload(); },
			fields() { return IdentityRequiredFields.fromJson(this.payload.fields); },
			accountRequirements() { return this.fields.accounts || []; },
			requestedNetworks(){
				return this.accountRequirements.map(raw => {
					const n = Network.fromJson(raw);
					return this.scatter.settings.networks.find(x => x.unique() === n.unique());
				});
			},
			accounts(){
				const networks = this.requestedNetworks.map(x => x.unique());
				return this.scatter.keychain.accounts.filter(x => networks.includes(x.networkUnique))
			},
			app(){
				return this.popup.data.props.appData;
			},
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