export default class SocketService {

	static async initialize(){
		return window.wallet.sockets.initialize();
	}

	static async close(){
		return window.wallet.sockets.close();
	}

	static async sendEvent(event, payload, origin){
		return window.wallet.sockets.sendEvent(event, payload, origin);
	}

	static async broadcastEvent(event, payload){
		return window.wallet.sockets.broadcastEvent(event, payload);
	}

	static async emit(origin, id, path, data){
		return window.wallet.sockets.emit(origin, id, path, data);
	}

	static async getNewKey(origin, id){
		return window.wallet.sockets.getNewKey(origin, id);
	}

}
