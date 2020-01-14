import PluginRepository from '@walletpack/core/plugins/PluginRepository';
import IdGenerator from '@walletpack/core/util/IdGenerator';
import {Blockchains} from "@walletpack/core/models/Blockchains";
import Account from '@walletpack/core/models/Account';

const PAYER_API_URL = `https://payer.get-scatter.com`;
// const PAYER_API_URL = `http://localhost:9797`;

export default class EosioHelpers {

	static async getRandomName(network = null){
		if(!network) network = PluginRepository.plugin('eos').getEndorsedNetwork();

		let randomName = '';
		while(!PluginRepository.plugin('eos').isValidRecipient(randomName)){
			randomName = IdGenerator.text(256).replace(/[0,6-9]/g, '').slice(0,12).toLowerCase();
		}

		const exists = await fetch(`${network.fullhost()}/v1/chain/get_account`, {
			method:"POST",
			body:JSON.stringify({account_name:randomName})
		}).then(x => x.json()).then(res => !res.hasOwnProperty('code')).catch(() => false);
		if(exists) return EosioHelpers.getRandomName(network);

		return randomName;
	}

	/***
	 * This overwrites the walletpack eosio transfer method to add an
	 * API payer for transfers which allow it.
	 */
	static async apiPayingEosio(){
		const eosio = PluginRepository.plugin(Blockchains.EOSIO);

		const POST = (route, data) => fetch(`${PAYER_API_URL}/v1/${route}`, {
			method:"POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body:JSON.stringify(data)
		}).then(x => x.json());

		const apiSigProvider = (accounts, reject) => {
			return {
				getAvailableKeys:async () => {
					const userKeys = accounts instanceof Account ? [accounts.publicKey] : accounts.map(x => x.publicKey);
					const apiKeys = await fetch(`${PAYER_API_URL}/v1/public-keys`).then(x => x.json()).catch(() => []);
					return apiKeys.concat(userKeys);
				},
				sign:async (transaction) => eosio.signerWithPopup({ transaction }, accounts, reject).then(async signatures => {
					const serializedTransaction = transaction.serializedTransaction;
					transaction.serializedTransaction = Buffer.from(serializedTransaction).toString('hex');
					const apiSignatures = await POST('sign', transaction).catch(() => []);
					return {signatures:signatures.concat(apiSignatures), serializedTransaction}
				})
			}
		};

		eosio.transfer = async ({account, to, amount, token, memo, promptForSignature = true}) => {
			if(!eosio.isValidRecipient(to)) return {error:'Invalid recipient account name'};
			amount = parseFloat(amount).toFixed(token.decimals);
			const {contract, symbol} = token;
			const amountWithSymbol = amount.indexOf(symbol) > -1 ? amount : `${amount} ${symbol}`;

			let isApiPaying = false;
			if(eosio.isEndorsedNetwork(account.network())){
				const notRateLimited = await Promise.race([
					new Promise(r => setTimeout(() => r(false), 2000)),
					POST('can-sign', [account.name]).catch(() => false),
				]);

				const blacklisted = await Promise.race([
					new Promise(r => setTimeout(() => r(false), 2000)),
					fetch(`${PAYER_API_URL}/v1/blacklisted/${to}`).then(x => x.json()).catch(() => true),
				]);

				isApiPaying = notRateLimited && !blacklisted;
			}

			const authorization = [{ actor: account.sendable(), permission: account.authority, }];
			if(isApiPaying) authorization.unshift({ actor: 'freeresource', permission: 'active', });

			const parseErrorMessage = (result) => {
				let error;
				try { error = JSON.parse(error).error.details[0].message }
				catch(e){ error = result; }

				if(error && error.toString().indexOf('assertion failure with message') > -1){
					error = error.toString().replace('assertion failure with message:', '').trim()
				}

				return error;
			}

			return new Promise(async (resolve, reject) => {
				const apiSigner = isApiPaying ? apiSigProvider(account, reject) : null;
				const eos = eosio.getSignableEosjs(account, reject, promptForSignature, apiSigner);

				const result = await eos.transact({
					// max_cpu_usage_ms:10,
					actions:[{
						account: contract,
						name:'transfer',
						authorization,
						data:{
							from: account.name,
							to,
							quantity:amountWithSymbol,
							memo,
						},
					}]
				}, {
					blocksBehind: 3,
					expireSeconds: 30,
				})
					.catch(res => resolve({error:parseErrorMessage(res)}))
					.then(result => resolve(result))
			})
		}
	}

}
