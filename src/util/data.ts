import { zeroPad } from "./number";

export const updateURLParameters = (params: string) => {
	if (history.pushState !== undefined) {
		const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + params;
		window.history.replaceState({path: newUrl},'',newUrl);
	}
}

export const omitKeys = <T>(obj: Record<string, T>, keysToOmit: string[]): Record<string, T> => {
	let newObj: Record<string, T> = {}
	Object.entries(obj).map(([key, value]) => {
		if (keysToOmit.includes(key)) return;
		newObj[key] = value 
	})
	return newObj;
}

export const getStringMultiples = (str: string, multiples: number): string[] => {
	let charArr = str.split("")
	let endArr: string[] = []
	charArr.forEach((char, i) => {
		let currIndex = Math.floor((i || 1) / multiples)
		if (!endArr[currIndex]) endArr[currIndex] = ""
		endArr[currIndex] = `${endArr[currIndex]}${char}`
	})

	return endArr
}

export const formatMarkup = (str: string): string => {
	if (!str) return ""
	str = str.replace(/<br>/g, "\n")
	return str
}

export interface DefaultStructured {
	breadcrumbs?: {
		name: string,
		items: {
			url: string,
			name: string,
			image?: string,
			position?: number
		}[]
	},
	mainEntity?: Record<string, any>
}

export const removeTagsFromString = (htmlStr: string): string => {
	return htmlStr.replace(/(<[a-zA-Z]+?>)|(<[a-zA-Z]+?\/>)/g, "")
}

export const isValidEmail = (email: string): boolean => {
	return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
}

export const fillObj = <T>(obj: Record<string, any>, replaceValue: T): Record<string, T> => {
	let newObj: Record<string, T> = {}
	Object.keys(obj).forEach((key) => {
		newObj[key] = replaceValue
	})
	return newObj;
}

export const pick = (obj: Record<string, any>, keys: string[]): Record<string, any> => {
	let newObj: Record<string, any> = {}
	Object.entries(obj).forEach(([key, value]) => {
		if (!keys.includes(key)) return;
		newObj[key] = value;
	})

	return newObj;
}

export const serializeValue = (value: any): string => {
	if (typeof(value) === "number") return JSON.stringify({
		__serialized: true,
		__type: "number",
		value
	})
	if (typeof(value) === "string") return JSON.stringify({
		__serialized: true,
		__type: "string",
		value
	})
	if (typeof(value) === "boolean") return JSON.stringify({
		__serialized: true,
		__type: "bool",
		value
	})
	return JSON.stringify(value)
}

export const deserializeValue = (serializedValue: string): any => {
	let parsed = JSON.parse(serializedValue)
	if (!parsed) return null
	if (parsed.__serialized === true) {
		if (parsed.__type === "number") return Number.parseFloat(parsed.value)
		if (parsed.__type === "bool") return parsed.value
		return parsed.value.toString()
	}
	return parsed
}

export const isDuplicate = <T>(value: T, list: T[], matchFunction = ((item: T) => item === value)): boolean => {
	return !!list.find((currItem) => matchFunction(currItem) && currItem !== value)
}

export const getTimeString = (ms: number) => {
	let map: Record<string, number> = {
		"ms": 1,
		"seconds": 1000,
		"minutes": 60 * 1000,
		"hours": 60 * 60 * 1000,
		"days": 24 * 60 * 60 * 1000
	}

	let timeLabel = ""
	let entries = Object.entries(map)
	entries.forEach(([label, divisor], i) => {
		if (label) return;
		if (ms / divisor < 1) {
			if (i-1 < 0) timeLabel = entries[0][0];
			else timeLabel = entries[i-1][0];
		}
	})

	if (!timeLabel) timeLabel = entries[entries.length - 1][0];
	return `${Math.floor(ms / map[timeLabel])} ${timeLabel}`
}

export const getURL = (urlStr: string): string => {
	if (urlStr.startsWith("http")) return urlStr
	if (urlStr.startsWith("/")) return urlStr
	return `http://${urlStr}`
}

export const generateShareLink = (site: "facebook" | "twitter" | "telegram", message: string, url: string): string => {
	if (site === "facebook") {
		return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
	} else if (site === "twitter") {
		return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`
	} else if (site === "telegram") {
		return `https://telegram.me/share/url?url=${encodeURI(url)}&text=${encodeURIComponent(message)}`
	}
	return "";
}