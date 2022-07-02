import { Primitive } from "../types/Util";

export const toDisplayCase = (str: string): string => {
	return str.split("_")
		.map(
			(str) =>
				str.substring(0, 1).toUpperCase() +
				str.substring(1).toLowerCase()
		)
		.join(" ")
}

export const scoreToStars = (score: number | null | undefined): string => {
	if (!score) return "0.00"
	return (score / 20).toFixed(2)
}

export const chars: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz *&-%/!?*+=()";
export const randString = (keyLength: number): string => {
	let randomString: string = "";

	for (var i = 0; i < keyLength; i++) {
		let rNum: number = Math.floor(Math.random() * chars.length);
		randomString += chars.substring(rNum, rNum + 1);
	}
	return randomString;
}

export const getNumberAtPos = (str: string, pos: number): number | null => {
	let count = 0
	for (let i = 0; i < str.length-1; i++) {
		let current = str.charAt(i)
		if (!Number.isNaN(Number.parseInt(current))) {
			count += 1
			if (count === pos) {
				return Number.parseInt(current)
			}
		}
	}
	return null;
}

export const capitalize = (str: string): string => {
	if (["TV", "ONA", "OVA"].includes(str)) return str.toUpperCase()
	return str.split(/\s+|\_/).map((str) => str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()).join(" ")
}

export const getComponentsFromPath = (path: string): string[] => {
	let components = path.split("/");
	if (components[0] === "") components.shift()
	if (components[components.length - 1] === "") components.pop()

	return components;
}

export const getCountdownUntil = (targetDate: Date): string => {
	let diff = targetDate.getTime() - Date.now()

	let msInDay = (24 * 60 * 60 * 1000)
	const days = Math.floor(diff / msInDay)
	diff = diff - days * msInDay

	let msInHour = (60*60*1000)
	const hours = Math.floor(diff / msInHour)
	diff = diff - hours * msInHour

	const msInMin = 60*1000
	const mins = Math.floor(diff / msInMin)
	diff = diff - mins * msInMin

	let countdownString = ""
	if (days > 0) countdownString = `${days}d `
	if (hours > 0 || (mins > 0 && days > 0)) countdownString = `${countdownString}${hours}h `
	if (mins > 0) countdownString = `${countdownString}${mins}m `

	return countdownString.trim()
}

export const serialize = (value: any): string => {
	if (Array.isArray(value)) return `[${value.map((val: any) => serialize(val)).join("|")}]`
	if (typeof(value) === "object") {
		let str = ""
		Object.entries(value as Record<string, any>).map(([key, val]) => {
			if (str !== "") str = str + "&"
			str = `${str}${key}=${serialize(val)}`
		})
		return str
	}
	if (value === undefined) return "undefined";
	if (value === null) return "null"
	return value.toString()
}

export const isNumber = (str: string): boolean => {
	return str !== "" && str.replace(/-?[0-9]+(\.[0-9]+)?/, "") === ""
}

export const deserialize = (str: string): any => {
	if (str === "false") return false;
	if (str === "true") return true;
	if (str === "undefined") return undefined;
	if (str === "null") return null;
	if (str.startsWith("[") && str.endsWith("]")) {
		return str.substring(1, str.length - 1).split("|").map((value) => {
			let des = deserialize(value)
			if (value === "") return "VALUE_IS_NOT_SET"
			return des
		}).filter((value) => value !== "VALUE_IS_NOT_SET")
	}
	if (isNumber(str)) return Number.parseFloat(str)
	return str;
}

export const serializeObjToQuery = (value: Record<string, Primitive | Primitive[]>) => {
	let str = ""
	Object.entries(value).map(([key, value]) => {
		if (str !== "") str = str + "&"
		str = `${str}${key}=${serialize(value)}`
	})
	return str;
}

export const deserializeObjFromQuery = (queryParams: URLSearchParams, objKeys: string[]) => {
	let obj: Record<string, Primitive | Primitive[]> = {}
	objKeys.forEach((key) => {
		if (queryParams.has(key)) {
			obj[key] = deserialize(queryParams.get(key) || "")
		}
	})
	return obj
}

export const downloadString = (text: string, fileType: string, fileName: string) => {
	let blob = new Blob([text], { type: fileType });

	let a = document.createElement('a');
	a.download = fileName;
	a.href = URL.createObjectURL(blob);
	a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
	a.style.display = "none";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}


export const toDisplayString = (str: string): string => {
	return str.split("_").map((str) => capitalize(str)).join(" ")
}

export const errorToString = (err: any, defaultString: string): string => {
	if (!err || !err.code || !err.message) return defaultString;
	return err.message;
}