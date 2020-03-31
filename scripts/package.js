require('dotenv').config();
const packageJson = require('../package');
const fs = require('fs');
const ecc = require('eosjs-ecc');
const readline = require("readline");
const path = require('path');
const JSZip = require("jszip");



const getKey = async () => {
	if(process.env.CI_BUILD_KEY) return process.env.CI_BUILD_KEY;

	return new Promise(r => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		setTimeout(() => rl.stdoutMuted = true, 2);
		rl._writeToOutput = function _writeToOutput(stringToWrite) {
			if (rl.stdoutMuted) rl.output.write("*");
			else rl.output.write(stringToWrite);
		};

		rl.question("Please enter the signing key: ", (key) => {
			rl.stdoutMuted = false;
			r(key);
			rl.close();
		});

		rl.on("close", function() {
			rl.stdoutMuted = false;
			r(null);
			rl.close();
		});
	})
};

let ZIP_NAME = null;

getKey().then(async key => {
	let dummy = false;
	if(!key) {
		dummy = true;
		key = await ecc.PrivateKey.unsafeRandomKey();
		console.warn('----------------------------------');
		console.warn('Using dummy key!');
		console.warn('----------------------------------');
	}

	console.log('\r\nUsing public signing key:', ecc.privateToPublic(key));

	if(!fs.existsSync('./releases')){
		fs.mkdirSync('./releases');
	}

	// delete old zip files if exists
	fs.readdirSync('./releases').filter(x => x.indexOf(packageJson.version.replace(/\./g, '-')) > -1).map(filename => {
		fs.unlinkSync(`./releases/${filename}`);
	});

	const signZip = () => {
		try { fs.mkdirSync('./releases') } catch(e){}
		const file = fs.readFileSync(`./releases/release.zip`);
		const hash = ecc.sha256(file);
		const signature = ecc.signHash(hash, key);
		ZIP_NAME = `Bridge.${packageJson.version.replace(/\./g, '-')}.${signature}${dummy ? '.DUMMYKEY' : ''}.zip`;
		fs.renameSync('./releases/release.zip', `./releases/${ZIP_NAME}`);
		console.log('Created zipfile: ', ZIP_NAME);
	};

	const zip = new JSZip();

	const appendFiles = (dir) => {
		const files = fs.readdirSync(dir);
		files.map(filename => {

			// dir, recurse
			if(filename.indexOf('.') === -1){
				appendFiles(`${dir}/${filename}`)
			}

			// file
			else {
				const file = fs.readFileSync(`${dir}/${filename}`);
				let filepath = `${dir.replace('./dist', '')}/${filename}`;
				if(filepath.indexOf('/') === 0) filepath = filepath.substr(1, filepath.length);
				zip.file(filepath, file);
			}
		});
	};

	appendFiles('./dist');

	await zip.generateAsync({
		type:"nodebuffer",
		compression: "DEFLATE",
		compressionOptions: {
			level: 9
		}
	})
		.then(buf => fs.writeFileSync('./releases/release.zip', buf));

	return signZip();



})




