require('dotenv').config();

if(process.env.VUE_APP_NO_WALLET){
	console.error('VUE_APP_NO_WALLET is ENABLED!');
	return process.exit(1);
}

if(!process.env.VUE_APP_MIN_CONTAINER_VERSION){
	console.error('VUE_APP_MIN_CONTAINER_VERSION is not defined!');
	return process.exit(1);
}

if(process.env.VUE_APP_SHOW_MOBILE_CONSOLE){
	console.error('VUE_APP_SHOW_MOBILE_CONSOLE is ENABLED!');
	return process.exit(1);
}

process.exit(0);




