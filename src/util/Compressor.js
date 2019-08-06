import lzjs from 'lz-string';

export default class Compressor {

	static compress(x){
		return lzjs.compress(x);
	}

	static decompress(x){
		return lzjs.decompress(x);
	}

}