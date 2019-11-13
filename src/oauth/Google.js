
const JS_URL = 'https://apis.google.com/js/api.js'

const PROMPT = 'select_account';
const CONFIG = {
	clientId: '663744530151-8t2jaivpdh277lns05gtr17usp0p2dvh.apps.googleusercontent.com',
	scope: 'profile email',
	discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
	prompt:PROMPT,
	// redirect_uri:'http://localhost:6547/v1/oauth/google'
};


export class Google {

	static async init(){

		const setScript = () => new Promise((resolve) => {
			const script = document.createElement('script')
			script.src = JS_URL
			script.onreadystatechange = script.onload = function () {
				if (!script.readyState || /loaded|complete/.test(script.readyState)) {
					setTimeout(function () {
						resolve()
					}, 500)
				}
			}
			document.getElementsByTagName('head')[0].appendChild(script)
		})

		const setup = () => new Promise((resolve) => {
			window.gapi.load('auth2', () => {
				window.gapi.auth2.init(CONFIG)
					.then(() => {
						resolve(window.gapi)
					}).catch(() => resolve(null))
			})
		})

		await setScript();
		return setup();
	}

}

export default class GoogleAuth {

	constructor(){
		this.GoogleAuth = null /* window.gapi.auth2.getAuthInstance() */
		this.isAuthorized = false
	}

	init(){
		return Google.init()
			.then((gapi) => {
				this.GoogleAuth = gapi.auth2.getAuthInstance()
				this.isAuthorized = this.GoogleAuth.isSignedIn.get()
			}).catch(() => null)
	}

	getAuthCode(){
		return new Promise((resolve, reject) => {
			if (!this.GoogleAuth) return reject(false);

			this.GoogleAuth.grantOfflineAccess({ prompt:PROMPT })
				.then(x => resolve(x.code))
				.catch(err => resolve(null))
		})
	}

}