import lzjs from 'lz-string';

export default class Compressor {

	static compress(x){
		return lzjs.compressToUTF16(x);
	}

	static decompress(x){
		return lzjs.decompressFromUTF16(x);
	}

}