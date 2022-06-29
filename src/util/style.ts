import baseTheme from "../styles/themes/baseTheme"
import updateObj from "object-deep-update"

export const createTheme = (themeObj: Record<string, any>): Record<string, any> => {
	return updateObj({...baseTheme}, {...themeObj})
}

export const getValueStr = (key: string, val: any) => {
	if (key.includes("zindex") && typeof(val) === "number") return val.toString()
	if (typeof(val) === "number") return `${val}${key.includes("ani") ? "ms" : "px"}`
	return val
}

export const addKeyStr = (key: string, str: string) => {
	let suffix = (typeof(str) === "string" && str.endsWith(";")) ? "" : ";"
	return `--${key}: ${getValueStr(key, str)}${suffix}`
}

export const getStyleString = (key: string, val: any) => {
	if (Array.isArray(val)) {
		let newStr = ""
		val.forEach((v, i) => {
			newStr = newStr + `--${key}-${i}: ${getValueStr(key, v)};\n`
		})
		return newStr
	} else if (typeof(val) === "object") {
		let newStr = ""
		Object.entries(val).forEach((entry, i) => {
			const [ k, v ] = entry
			newStr = newStr + getStyleString(`${key}-${k}`, v)
		})
		return newStr
	}
	return addKeyStr(key, val) + "\n";
}

export const getThemeStyleCSS = (themeObj: Record<string, any>) => {
	let str = `:root {\n${getStyleString("theme", themeObj)}}`
	return str
}

export const getTextLengthPixels = (string: string, fontSize: string) => {
	const element = document.createElement('p');
	element.innerHTML = string;
	element.style.fontSize = fontSize;
	element.style.display = 'inline-block';
	document.body.appendChild(element);
	const { width } = element.getBoundingClientRect();
	document.body.removeChild(element);
	return width;
};

export const getMediaQueryFromBreakpoint = (breakpoint: string | number, max: boolean = false) => {
	let value: string
	if (typeof breakpoint === "number") value = `${breakpoint}px`
	else value = breakpoint

	let str = `(${max ? "max" : "min"}-width: ${value})`
	return str
}

export const getCurrentBreakpoint = (): string | null => {
	let breakpoint: string | null = null;
	Object.entries(baseTheme.breakpoints).reverse().forEach(([breakpointStr, themeBreakpoint]: [string, any]) => {
		if (breakpoint !== null) return
		let max: boolean = false
		let breakpointValue: string | number = "";
		if (typeof(themeBreakpoint) == "object") {
			if (themeBreakpoint.max) {
				max = true
				breakpointValue = themeBreakpoint.max
			} else if (themeBreakpoint.value) {
				breakpointValue = themeBreakpoint.value
			}
		} else breakpointValue = themeBreakpoint
		let query = getMediaQueryFromBreakpoint(breakpointValue, max)
		if (window.matchMedia(query).matches) breakpoint = breakpointStr
	})

	return breakpoint
}