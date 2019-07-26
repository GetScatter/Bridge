import "mocha"
import { assert } from "chai"
import BridgeWallet from "../src/services/BridgeWallet";
import PluginRepository from "scatter-core/plugins/PluginRepository";

PluginRepository.loadPlugins([
	require('scatter-core/plugins/defaults/eos').default,
	require('scatter-core/plugins/defaults/trx').default,
	require('scatter-core/plugins/defaults/btc').default,
])

let entropy;
let uuid = 'testing-testing-testing-testing-testing-testing-testing-testing-testing-testing'
describe("EOSIO plugin", () => {

	it('should be able to gather entropy', async () => {
		entropy = await BridgeWallet.createEntropy(8);
		assert(entropy && entropy.length === 64, "Entropy was not created.");
		console.log('entropy', entropy);
	});

	it('should be able to generate seeds', async () => {
		const seed = await BridgeWallet.makeSeed(uuid, entropy);
		console.log(await BridgeWallet.makeKey(seed, 'eos'));
		console.log(await BridgeWallet.makeKey(seed, 'trx'));
		console.log(await BridgeWallet.makeKey(seed, 'btc'));
	});



});