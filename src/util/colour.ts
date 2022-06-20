import { getStringMultiples } from "./data"

export interface RGBColour {
	r: number,
	g: number,
	b: number
}

export const isColourString = (str: string): boolean => {
	let rgbaRegex = /^rgba\s*\(\d+(.\d+)?\s*,\d+(.\d+)?\s*,\d+(.\d+)?\s*,\d+(.\d+)?\s*\)\s*$/
	let rgbRegex = /^rgb\s*\(\d+(.\d+)?\s*,\d+(.\d+)?\s*,\d+(.\d+)?\s*\)\s*$/
	let hexRegex = /^#((\d|[a-fA-F]){3}|(\d|[a-fA-F]){6})$/
	return rgbaRegex.test(str) || rgbRegex.test(str) || hexRegex.test(str)
}

export const getRGBFromColourString = (colour: string): RGBColour => {
	let colourArr: number[] = []
	if (colour.startsWith("rgb")) {
		colour = colour.replace(/^rgba?\(/, "")
		colour = colour.replace(/\s+/, "")
		colour = colour.replace(/\)$/, "")
		colourArr = colour.split(",").splice(0,3).map((strCol) => Number.parseFloat(strCol))
	} else if (colour.startsWith("#")) {
		colour = colour.replace(/^#/, "")
		if (colour.length === 3) {
			colourArr = colour.split("").map((str) => Number.parseInt(str, 16))
		} else if (colour.length === 6) {
			colourArr = getStringMultiples(colour, 2).map((str) => Number.parseInt(str, 16))
		}
	}

	return {
		r: colourArr[0],
		g: colourArr[1],
		b: colourArr[2],
	}
}

export const getContrastTextColour = (colour: string): string => {
	const rgbCol = getRGBFromColourString(colour);
	let yiqValue = ((rgbCol.r*299)+(rgbCol.g*587)+(rgbCol.b*114))/1000;
	return yiqValue >= 128 ? "#000" : "#fff"
}