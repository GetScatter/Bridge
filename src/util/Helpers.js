export default class Helpers {

	static fixTrailingZeroes(num){
		// If null or zero no need to fix
		if(!num) return num;
		num = num.toString();

		// If not a float no need to fix
		if(num.indexOf('.') === -1) return num;

		const arr = num.split('.')[1].split('');
		console.log('arr', arr);

		// Taking off last number because of rounding errors
		arr.pop();


		let zeroCount = 0;
		let firstZeroIndex;
		for(let i = arr.length-1; i > 0; i--){
			if(parseInt(arr[i]) === 0) zeroCount++;
			else {
				firstZeroIndex = arr.length - zeroCount;
				break;
			}
		}

		console.log(zeroCount, firstZeroIndex);
	}

}