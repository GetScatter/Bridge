const fs = require('fs');
require('dotenv').config();

console.log('done building')

if(!fs.existsSync('./dist')) return;

const jsFiles = fs.readdirSync('./dist').filter(x => x.indexOf('.js') === x.length-3);

let indexhtml = fs.readFileSync('./dist/index.html', {encoding:'utf8'});
jsFiles.map(filename => {
	indexhtml = indexhtml.replace(new RegExp(`static/${filename}`,"g"), filename);

	let jsfile = fs.readFileSync(`./dist/${filename}`, {encoding:'utf8'});
	jsfile = jsfile.replace(new RegExp(`static/static`,"g"), `static`)
	jsFiles.filter(x => x !== filename).map(js => {
		jsfile = jsfile.replace(new RegExp(`static/${js}`,"g"), js);
	})
	fs.writeFileSync(`./dist/${filename}`, jsfile);
})

fs.writeFileSync(`./dist/index.html`, indexhtml);
fs.writeFileSync(`./dist/min.version`, process.env.VUE_APP_MIN_CONTAINER_VERSION);

