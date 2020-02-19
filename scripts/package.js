require('dotenv').config();
const packageJson = require('../package');
const fs = require('fs');
const archiver = require('archiver');
const ecc = require('eosjs-ecc');
const readline = require("readline");


const getKey = async () => {
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

getKey().then(key => {
	if(!key) {
		console.error('No key provided');
		return process.exit(0);
	}

	console.log('\r\nUsing public signing key:', ecc.privateToPublic(key));

	const output = fs.createWriteStream('./dist/dist.zip');
	const archive = archiver('zip', { zlib:{ level: 9 }});

	output.on('close', () => {
		const file = fs.readFileSync(`./dist/dist.zip`);
		const hash = ecc.sha256(file);
		console.log('Zip hash: ', hash);
		const signature = ecc.signHash(hash, key);
		ZIP_NAME = `Bridge.${packageJson.version.replace(/\./g, '-')}.${signature}.zip`;
		fs.renameSync('./dist/dist.zip', `./dist/${ZIP_NAME}`);
		console.log('Final name: ', ZIP_NAME);

		const filedata = {
			tag_name:packageJson.version,
			assets:[
				{name:ZIP_NAME, browser_download_url:`https://bridge.get-scatter.com/${ZIP_NAME}`}
			]
		};

		fs.writeFileSync('./dist/zip.json', JSON.stringify(filedata, null, 4));
	});

	archive.on('warning', (err) => {
		if (err.code === 'ENOENT') console.warn(err);
		else throw err;
	});

	archive.on('error', (err) => { throw err; });
	archive.pipe(output);

	const ALLOWED_FILES = ['.bundle.js', 'index.html', 'min.version', '.css']
	const files = fs.readdirSync('./dist').filter(x => ALLOWED_FILES.some(y => x.indexOf(y) > -1));
	files.map(filename => {
		const file = fs.readFileSync(`./dist/${filename}`);
		archive.append(file, {
			name: filename,
			// We are passing in a static fake date (filehash), otherwise
			// hashing will be different each time, and multi source
			// validation will not be possible.
			date:ecc.sha256(file)
		})
	});

	archive.finalize();


})




