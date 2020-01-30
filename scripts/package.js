require('dotenv').config();
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

		setTimeout(() => rl.stdoutMuted = true, 500);
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
}

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
		fs.renameSync('./dist/dist.zip', `./dist/Bridge.${signature}.zip`);
		console.log('Final name: ', `Bridge.${signature}.zip`);
	});

	archive.on('warning', (err) => {
		if (err.code === 'ENOENT') console.warn(err);
		else throw err;
	});

	archive.on('error', (err) => { throw err; });
	archive.pipe(output);

	const files = fs.readdirSync('./dist').filter(x => x.indexOf('.zip') === -1).filter(x => x.indexOf('.') > -1);
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




