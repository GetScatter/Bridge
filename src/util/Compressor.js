import lzjs from 'lz-string';

export default class Compressor {

	static compress(x){
		console.log('before', x.length);
		console.log('after', lzjs.compress(x).length);
		return lzjs.compress(x);
	}

	static decompress(x){
		return lzjs.decompress(x);
	}

}