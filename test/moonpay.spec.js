import "mocha"
import { assert } from "chai"
import Moonpay from "../src/services/credit/Moonpay";
import Token from '@walletpack/core/models/Token';
import "isomorphic-fetch"
require('dotenv').config();



const token = Token.fromJson({
	blockchain:'eos',
	contract:'eosio.token',
	symbol:'EOS',
	name:'EOS',
	decimals:4,
	amount:0,
	chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
})

describe("Moonpay", () => {

	it('should be able to get a token\'s price', async () => {
		const price = await Moonpay.getTokenPrice(token);
		console.log('price', price);
	});

	it('should be able check if an IP can use moonpay', async () => {
		const available = await Moonpay.isAvailable();
		console.log('available', available);
	});



});
