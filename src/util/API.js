import ecc from 'eosjs-ecc';
import IdGenerator from "@walletpack/core/util/IdGenerator";
const HOST = 'http://localhost:6546/v1/';
const PROOF_KEY = 'EOS7uWSDvdgs8xeEq4XDGyajT89bMhmjZhesAvNPeLWiFJW7dAz4o';

let sessionToken;
const getHeaders = () => {
	const proof = IdGenerator.text(64);
	return [proof, {
		'X-Auth-Token':sessionToken,
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		proof,
	}]
}

// All API requests must come back signed with the known
// public key associated with the Scatter API
const validate = (proof, res) => {
	try {
		const signedProof = res.headers.get('proof');
		if(!signedProof) throw 'Invalid API Request';
		if(ecc.recover(signedProof, proof) !== PROOF_KEY) throw 'Invalid API Request';
		return res.json();
	} catch(e){
		throw "Invalid API Request";
	}
};

export const GET = route => {
	const [proof, headers] = getHeaders();
	return fetch(HOST+route, {
		method:"GET",
		headers
	}).then(res => validate(proof,res))
}

export const POST = (route, body) => {
	const [proof, headers] = getHeaders();
	return fetch(HOST+route, {
		method:"POST",
		headers,
		body:JSON.stringify(body),
	}).then(res => validate(proof,res))
}

export default class API {

	static setSessionToken(token){
		sessionToken = token;
	}

}