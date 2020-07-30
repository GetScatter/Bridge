<template>
	<section class="app-login">
		<section class="content">
			<section class="app-details">
				<PopOutLogos :app="app" />

				<figure class="action">Login</figure>
				<figure class="app-name">via <b>{{app.name}}</b></figure>

				<section v-if="accountRequirements.length === 1" style="display:block;">
					<br />
					<Select :selected="selectedAccount"
					        :options="[null].concat(allAccounts)"
					        :parser="x => x ? `${x.sendable()}${x.authority ? '@'+x.authority : ''}` : 'None'"
					        v-on:selected="x => selectedAccount = x" />
				</section>

				<figure class="text">By logging into this application you will be allowing it to interact with your Scatter<b v-if="identityFields.length">, and see some of your personal information</b>.</figure>
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
	import Account from "@walletpack/core/models/Account";
	import Network from "@walletpack/core/models/Network";
	import PopOutLogos from "../../components/popups/PopOutLogos";
	import SingularAccounts from "../../services/utility/SingularAccounts";

	export default {
		components: {PopOutLogos},
		props:['popup', 'closer'],
		data(){return {
			selectedAccount:null,
		}},
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
			allAccounts(){
				return this.scatter.keychain.accounts.filter(x => this.requestedNetworks.find(n => n.unique() === x.network().unique()));
			},
			app(){
				return this.popup.data.props.appData;
			},
			hintAccount(){
				if(this.accountRequirements.length !== 1) return null;
				// Only works for EOSIO chains
				if(this.accountRequirements[0].blockchain !== 'eos') return null;
				if(!this.accountRequirements[0].hasOwnProperty('account')) return null;
				return this.accountRequirements[0].account.toLowerCase().trim();
			},
		},
		async mounted(){
			if(this.requestedNetworks.length && !this.accounts.length && !this.hintAccount) return this.closer(null);
			this.selectedAccount = this.accounts[0];

			if(this.hintAccount){
				const plugin = PluginRepository.plugin('eos');
				let [account_name, account_permission] = this.hintAccount.split('@');
				if(!account_permission || account_permission.trim().toLowerCase() === 'owner') account_permission = 'active';

				const accountData = await plugin.accountData(null, this.requestedNetworks[0], account_name);
				if(!accountData) this.closer(null);
				const keys = accountData.permissions.filter(x => x.perm_name !== 'owner').reduce((acc, x) => {
					x.required_auth.keys.map(({key}) => acc.push(key));
					return acc;
				}, []);
				const found = this.scatter.keychain.keypairs.find(x => keys.includes(x.publicKeys.find(k => k.blockchain === 'eos').key));
				if(found){
					this.selectedAccount = Account.fromJson({
						keypairUnique:found.unique(),
						networkUnique:this.requestedNetworks[0].unique(),
						publicKey:found.publicKeys.find(x => x.blockchain === 'eos').key,
						name:account_name,
						authority:account_permission,
						fromOrigin:this.app.applink
					});
				}
			}
		},
		methods:{
			async login(){
				let accounts = this.accounts;
				if(this.accountRequirements.length === 1) accounts = [this.selectedAccount];

				this.$emit('returned', {
					identity:this.scatter.keychain.identities[0],
					location:this.scatter.keychain.locations[0],
					accounts,
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
