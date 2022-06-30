export const minMax = (num: number, min: number, max: number) => {
	if (num < min) return min;
	if (num > max) return max;
	return num;
}

const minDecimalPlaces = 0
const maxDecimalPrecision = 6

export const removeTrailingZeros = (numStr: string | number, minDecimals: number = minDecimalPlaces): string => {
	numStr = numStr.toString()
	const numSplit = numStr.split(".")
	if (numSplit.length < 2) return numStr
	const integerStr = numSplit[0]
	const decimalStr = numSplit[1]
	if (decimalStr.length <= minDecimals) return ""
	const trailingZerosMatch = decimalStr.match(/0*$/)
	if (!trailingZerosMatch) return "";
	let trailingZerosStr = trailingZerosMatch[0]
	const precisionDecimalStr = decimalStr.substring(0, trailingZerosMatch.index)
	trailingZerosStr = trailingZerosStr.substring(0, minDecimals - (decimalStr.length - trailingZerosStr.length))
	return `${integerStr}.${precisionDecimalStr}${trailingZerosStr}`
}

export const formatPrecision = (num: number, minDecimals: number = minDecimalPlaces, maxPrecision: number = maxDecimalPrecision) => {
	num = Math.floor(num * Math.pow(10, maxDecimalPrecision) + 0.5) / Math.pow(10, maxDecimalPrecision)
	let numStr = num.toString()
	let decimals: number = 0
	if (numStr.includes(".")) {
		decimals = numStr.split(".")[1].length
	}
	if (decimals < minDecimals) {
		if (decimals === 0) numStr = numStr + "."
		for (var i = decimals; i < minDecimals; i++) {
			numStr = numStr + "0"
		}
	}
	if (decimals > 0) {
		const numSplit = numStr.split(".")
		const integerStr = numSplit[0]
		const decimalStr = numSplit[1]
		let nonZeroDecimals = (decimalStr.match(/[1-9][0-9]*/) || [""])[0]
		const nonZeroDecimalCount = nonZeroDecimals.length
		let zeroDecimals = (decimalStr.match(/0*/) || [""])[0]
		let decimals = zeroDecimals + nonZeroDecimals
		if (integerStr !== "0" && decimals.length > maxPrecision) {
			decimals = decimals.substring(0, maxPrecision)
			numStr = `${integerStr}.${removeTrailingZeros(decimals, minDecimals)}`
		} else if (nonZeroDecimalCount > maxPrecision) {
			nonZeroDecimals = nonZeroDecimals.substring(0, maxPrecision)
			numStr = `${integerStr}.${zeroDecimals}${removeTrailingZeros(nonZeroDecimals, minDecimals)}`
		}
	}

	return numStr
}

export const numberWithCommas = (x: number | string): string => {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export const formatNumber = (num: number, minDP?: number, maxDP?: number): string => {

	return numberWithCommas(formatPrecision(num, minDP, maxDP))
}

export const formatNumberWithSign = (num: number): string => {
	let numStr = formatNumber(num)
	if (numStr.substring(0, 1) == "-") return numStr;
	else return `+${numStr}`
}

export const zeroPad = (num: number, zeros: number): string => {
	let numStr = num.toString()
	for (let i = 0; i < zeros - numStr.length; i++) {
		numStr = `0${numStr}`
	}
	return numStr
}

export const formatTime = (date: string): string => {
	date = date.replace(/-/g, "/") + " +0000"
	let newDate = new Date(date);
	var hours = newDate.getHours()
	var mins = newDate.getMinutes()

	return zeroPad(hours, 2) + ":" + zeroPad(mins, 2)
}

export const randomNum = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export const roundToNearest = (num: number, roundNum: number) => {
	return Math.floor((num + (roundNum / 2)) / roundNum) * roundNum
}

export const getDecimalPlaces = (num: number): number => {
	let decimalStr = num.toString().split(".")[1]
	if (!decimalStr) return 0
	return decimalStr.length
}

export const roundToDP = (num: number, maxDecimals: number): string => {
	let numStr = num.toString()
	let numSplit = numStr.split(".")
	let decimalStr = numStr.split(".")[1]
	if (!decimalStr) {
		return numStr;
	}
	let newNumStr = numSplit[0] + "." + decimalStr.substring(0, maxDecimals)
	return newNumStr;
}