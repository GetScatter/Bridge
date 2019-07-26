<template>
	<section class="login">
		<h1>Scatter Bridge</h1>

		<Button v-if="!working" text="Login" :click="login" />
		<div v-if="working">wait</div>
	</section>
</template>

<script>
	import {mapState, mapActions} from 'vuex';
	import * as Actions from 'scatter-core/store/constants';
	import Scatter from 'scatter-core/models/Scatter'
	import {BlockchainsArray} from 'scatter-core/models/Blockchains'
	import Keypair from 'scatter-core/models/Keypair'
	import BridgeWallet from "../services/BridgeWallet";
	import PluginRepository from "scatter-core/plugins/PluginRepository";
	import SingletonService from "scatter-core/services/utility/SingletonService";
	import ScatterCore from "scatter-core";
	import Account from "scatter-core/models/Account";


	export default {
		data(){return {
			working:false,
		}},
		methods:{
			async login(){
				if(this.working) return;
				this.working = true;
				console.log('Logged in with fake oauth');

				let registering = true;

				const uuid = 'testingtestingtestingtestingtesting'
				const password = 'testingtestingtestingtestingtesting';
				const entropy = await BridgeWallet.createEntropy(1);
				const seed = await BridgeWallet.makeSeed(uuid, entropy);
				console.log('seed', seed);

				const scatter = await Scatter.create();
				await Promise.all(BlockchainsArray.map(async kv => {
					const plugin = PluginRepository.plugin(kv.value);
					const p = await BridgeWallet.makeKey(seed, kv.value);
					const keypair = Keypair.fromJson({
						name:kv.value,
						privateKey:p,
						publicKeys:[{blockchain:kv.value, key:plugin.privateToPublic(p)}],
						blockchains:[kv.value],
					});
					scatter.keychain.keypairs.push(keypair);

					if(!plugin.accountsAreImported()){
						const networks = scatter.settings.networks.filter(n => n.blockchain === kv.value);
						networks.map(network => {
							scatter.keychain.accounts.push(Account.fromJson({
								keypairUnique:keypair.unique(),
								networkUnique:network.unique(),
								publicKey:keypair.publicKeys[0].key,
								name:kv.value
							}));
						})
					}

					// TODO: TESTING ONLY!
					else {
						const networks = scatter.settings.networks.filter(n => n.blockchain === kv.value);
						networks.map(network => {
							scatter.keychain.accounts.push(Account.fromJson({
								keypairUnique:keypair.unique(),
								networkUnique:network.unique(),
								publicKey:keypair.publicKeys[0].key,
								name:'ramdeathtest',
								authority:'active'
							}));
						})
					}

					return true;
				}));



				// this[Actions.SET_SEED](password);
				ScatterCore.services.secure.Seeder.setSeed(password);
				await this[Actions.SET_SCATTER](scatter);
				SingletonService.init();
				console.log('scatter', scatter);
				this.$router.push({name:this.RouteNames.Dashboard})
			},

			...mapActions([
				Actions.SET_SEED,
				Actions.SET_SCATTER,
			])
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.login {
		height:100vh;
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

</style>

