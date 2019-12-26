import "mocha"
import { assert } from "chai"
import EveripediaAPI from "../src/services/special/EveripediaAPI";
import "isomorphic-fetch"

describe("Everipedia", () => {

	it('should be able to get trending wikis', async () => {
		const trending = await EveripediaAPI.getTrending();
		console.log('trending', trending);
	});



});
