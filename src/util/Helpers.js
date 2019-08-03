export default class Helpers {

	static fixTrailingZeroes(num){
		// If null or zero no need to fix
		if(!num) return num;
		num = num.toString();

		// If not a float no need to fix
		if(num.indexOf('.') === -1) return num;

		const [whole, float] = num.split('.');
		const decimalPlaces = float.split('');

		// Taking off last number because of rounding errors
		decimalPlaces.pop();


		let zeroCount = 0;
		let firstZeroIndex = null;
		for(let i = decimalPlaces.length-1; i > 0; i--){
			if(parseInt(decimalPlaces[i]) === 0) zeroCount++;
			else {
				firstZeroIndex = decimalPlaces.length - zeroCount;
				break;
			}
		}

		// If all zeroes but rounding error
		if(firstZeroIndex === null){
			return whole || 0;
		}

		return `${whole}.${decimalPlaces.slice(0, firstZeroIndex).join('')}`
	}

}