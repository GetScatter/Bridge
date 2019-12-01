const fs = require('fs');
require('dotenv').config();
const ecc = require('eosjs-ecc');

if(!fs.existsSync('./dist')) return;

// --------------------------------------------------------------------------------------------------------
// These will not be pushed live, they are only for local testing
if(process.env.NODE_ENV === 'production'){
	const files = fs.readdirSync('./dist').filter(x => x !== 'static');
	fs.writeFileSync('./dist/files.json', JSON.stringify(files));
	fs.mkdirSync('./dist/hashes');

	files.map(filename => {
		const hash = ecc.sha256(fs.readFileSync(`./dist/${filename}`, 'utf8'));
		const sig = 'SIG_K1_KiWzMFtwyvHMws46ZbhPN1bh8pUwWAfDb4usuGUUAEvweFLGeeq3BnFRQNCEAtZhJL9ZjPT7KPnYEMbNc48RBsf2jAxmA2';
		fs.writeFileSync(`./dist/hashes/${filename}.hash`, `${hash}|${sig}`);
	});
}
// --------------------------------------------------------------------------------------------------------

const jsFiles = fs.readdirSync('./dist').filter(x => x.indexOf('.js') === x.length-3);

let scriptInjections = ``;
let indexhtml = fs.readFileSync('./dist/index.html', {encoding:'utf8'});
jsFiles.map(filename => {
	indexhtml = indexhtml.replace(new RegExp(`/static/${filename}`,"g"), filename);
	indexhtml = indexhtml.replace(/src=\//g, 'src=');
	indexhtml = indexhtml.replace(/link=\//g, 'link=');
	indexhtml = indexhtml.replace(/href=\//g, 'href=');

	if(filename !== 'app.bundle.js' && filename !== 'chunk-vendors.bundle.js') {
		scriptInjections += `<script type="text/javascript" src="${filename}"></script>`
	}

	let jsfile = fs.readFileSync(`./dist/${filename}`, {encoding:'utf8'});
	jsfile = jsfile.replace(new RegExp(`static/static`,"g"), `static`)
	jsFiles.filter(x => x !== filename).map(js => {
		jsfile = jsfile.replace(new RegExp(`/static/${js}`,"g"), js);
	})
	fs.writeFileSync(`./dist/${filename}`, jsfile);
})

indexhtml = indexhtml.replace('<div id=scatter>', scriptInjections+'<div id=scatter>');

fs.writeFileSync(`./dist/index.html`, indexhtml);
fs.writeFileSync(`./dist/min.version`, process.env.VUE_APP_MIN_CONTAINER_VERSION);

