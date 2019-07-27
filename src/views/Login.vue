<template>
	<section class="login">
		<h1>Scatter Bridge</h1>

		<label>Registering?</label>
		<input style="transform:scale(2);" type="checkbox" v-model="registering" />

		<br>
		<br>
		<Button v-if="!working" text="Login" :click="go" />
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
	import SingletonService from "../services/SingletonService";
	import ScatterCore from "scatter-core";
	import Account from "scatter-core/models/Account";
	import StorageService from "../services/StorageService";
	import StoreService from "scatter-core/services/utility/StoreService";


	export default {
		data(){return {
			registering:false,
			working:false,
		}},
		mounted(){

		},
		methods:{

			// TODO: These live here right now purely for testing logic
			go(){
				if(this.registering) this.register();
				else this.login();
			},
			async register(){
				if(this.working) return;
				this.working = true;
				console.log('Logged in with fake oauth');

				const uuid = 'testingtestingtestingtestingtesting'
				const password = await BridgeWallet.shaPass('testingtestingtestingtestingtesting');
				const entropy = await BridgeWallet.createEntropy(1);
				await BridgeWallet.setLocalEntropy(entropy, password);
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
					// else {
					// 	const networks = scatter.settings.networks.filter(n => n.blockchain === kv.value);
					// 	networks.map(network => {
					// 		scatter.keychain.accounts.push(Account.fromJson({
					// 			keypairUnique:keypair.unique(),
					// 			networkUnique:network.unique(),
					// 			publicKey:keypair.publicKeys[0].key,
					// 			name:'ramdeathtest',
					// 			authority:'active'
					// 		}));
					// 	})
					// }

					return true;
				}));

				ScatterCore.services.secure.Seeder.setSeed(password);
				await this[Actions.SET_SCATTER](scatter);
				SingletonService.init();
				this.$router.push({name:this.RouteNames.Dashboard})
			},
			async login(){
				if(this.working) return;
				this.working = true;
				console.log('Logged in with fake oauth');

				const uuid = 'testingtestingtestingtestingtesting'
				const password = await BridgeWallet.shaPass('testingtestingtestingtestingtesting');
				const entropy = await BridgeWallet.getLocalEntropy(password);
				const seed = await BridgeWallet.makeSeed(uuid, entropy);

				const scatter = await BridgeWallet.getScatter(password);

				ScatterCore.services.secure.Seeder.setSeed(password);
				await this[Actions.HOLD_SCATTER](scatter);
				SingletonService.init();
				this.$router.push({name:this.RouteNames.Dashboard})
			},

			...mapActions([
				Actions.SET_SEED,
				Actions.SET_SCATTER,
				Actions.HOLD_SCATTER,
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

