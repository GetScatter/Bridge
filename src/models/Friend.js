import IdGenerator from '@walletpack/core/util/IdGenerator'

export class FriendAccount {

}

export default class Friend {

	constructor(name = '', identity = '', accounts = []){
		this.id = IdGenerator.text(24);
		this.name = name;
		this.identity = identity;
		this.accounts = accounts; // {recipient, blockchain, chainId}
	}

	static placeholder(){ return new Friend(); }
	static fromJson(json){ return Object.assign(this.placeholder(), json); }

	clone(){ return Friend.fromJson(JSON.parse(JSON.stringify(this))) }

}
