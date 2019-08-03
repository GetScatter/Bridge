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
	import * as Actions from '@walletpack/core/store/constants';
	import Scatter from '@walletpack/core/models/Scatter'
	import {Blockchains, BlockchainsArray} from '@walletpack/core/models/Blockchains'
	import Keypair from '@walletpack/core/models/Keypair'
	import BridgeWallet from "../services/BridgeWallet";
	import PluginRepository from "@walletpack/core/plugins/PluginRepository";
	import SingletonService from "../services/SingletonService";
	import ScatterCore from "@walletpack/core";
	import Account from "@walletpack/core/models/Account";
	import StorageService from "../services/StorageService";
	import StoreService from "@walletpack/core/services/utility/StoreService";
	import HistoricTransfer from "@walletpack/core/models/histories/HistoricTransfer";
	import HistoricExchange from "@walletpack/core/models/histories/HistoricExchange";


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

				let acc;
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
					else {
						const networks = scatter.settings.networks.filter(n => n.blockchain === kv.value);
						networks.map(async network => {
							acc = Account.fromJson({
								keypairUnique:keypair.unique(),
								networkUnique:network.unique(),
								publicKey:keypair.publicKeys[0].key,
								name:'ramdeathtest',
								authority:'active'
							});
							scatter.keychain.accounts.push(acc);
						})
					}

					return true;
				}));

				ScatterCore.services.secure.Seeder.setSeed(password);
				await this[Actions.SET_SCATTER](scatter);

				const eosToken = PluginRepository.plugin(Blockchains.EOSIO).getEndorsedNetwork().systemToken();
				eosToken.amount = '1.0000';
				const btcToken = PluginRepository.plugin(Blockchains.BTC).getEndorsedNetwork().systemToken();
				btcToken.amount = parseFloat('1.2').toFixed(btcToken.decimals);
				const transfer = new HistoricTransfer(acc, 'someaccount', eosToken, '1.0000', 'this is a memo', '0xhashashashashash');
				const transfer2 = new HistoricTransfer(acc, 'someaccount', eosToken, '1.0000', 'this is a memo', '0xhashashashashash1');
				const transfer3 = new HistoricTransfer(acc, 'someaccount', eosToken, '1.0000', 'this is a memo', '0xhashashashashash2');
				const exchange = new HistoricExchange(acc, 'someaccount', eosToken, btcToken, {});
				await this[Actions.DELTA_HISTORY](transfer);
				await this[Actions.DELTA_HISTORY](transfer2);
				await this[Actions.DELTA_HISTORY](transfer3);
				await this[Actions.DELTA_HISTORY](exchange);





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
				Actions.DELTA_HISTORY,
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

