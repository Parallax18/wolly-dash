import { VitePluginConfig } from '@unocss/vite';
import { presetUno, escapeSelector, Variant, VariantHandler, RuleContext } from "unocss"
import baseTheme from "../src/styles/themes/baseTheme";
import transformDirective from "@unocss/transformer-directives";

const generateThemeObj = (keyArr: string[] | string, cssVariable: boolean = true): Record<string, string> => {
	let obj: Record<string, any> = {};
	let keys = Array.isArray(keyArr) ? keyArr : [keyArr];
	keys.forEach((parentKey: string) => {
		obj[parentKey] = {}
		Object.entries(baseTheme[parentKey]).forEach(([childKey, value]) => {
			obj[parentKey][childKey] = cssVariable ? `var(--theme-${parentKey}-${childKey}, ${value})` : value
		})
	})
	if (!Array.isArray(keyArr)) return obj[keyArr]
	return obj;
};

const handleVariants = (cssString: string, variantHandlers: VariantHandler[]): string => {
	let parent: string | null = null;
	variantHandlers.forEach((handler) => {
		if (handler.parent) {
			if (!parent) {
				parent = typeof(handler.parent) === "string" ? handler.parent : handler.parent[0]
			}
		}
	})
	if (parent) {
		return `${parent} {
			${cssString}
		}`
	} else return cssString
}

const generateMediaVariant = (key: string, mediaSizePx: number): Variant<{}> => {
	return (matcher: string) => {
		let greater = `+${key}:`
		let lesser = `<${key}:`
		
		let match = matcher.startsWith(greater) ? greater :
			matcher.startsWith(lesser) ? lesser : null
		if (match === null) return matcher;

		if (match === greater) {
			return {
				matcher: matcher.slice(match.length),
				parent: `@media (min-width: ${mediaSizePx+1}px)`
			}
		} else {
			return {
				matcher: matcher.slice(match.length),
				parent: `@media (max-width: ${mediaSizePx}px)`
			}
		}
	}
}

const unoConfig: VitePluginConfig = {
	transformers: [
		transformDirective()
	],
	presets: [
		presetUno(),
	],
	rules: [
		[/^flex-gap-x-(\d+(\.\d+)?)$/, ([_, gapSize]: RegExpMatchArray, { rawSelector, variantHandlers }: RuleContext ) => {
			return handleVariants(`
			
				.${escapeSelector(rawSelector)} > *:not(:last-child) {
					margin-right: ${Number.parseFloat(gapSize) / 4}rem;
				}
			`, variantHandlers)
		}],
		[/^flex-gap-y-(\d+(\.\d+)?)$/, ([_, gapSize]: RegExpMatchArray, { rawSelector, variantHandlers }: RuleContext) => {
			return handleVariants(`
				.${escapeSelector(rawSelector)} > *:not(:last-child) {
					margin-bottom: ${Number.parseFloat(gapSize) / 4}rem;
				}
			`, variantHandlers)
		}],
		[/^gap-(\d+(\.\d+)?)$/, ([_, gapSize]: RegExpMatchArray, {rawSelector, currentSelector, variantHandlers}: RuleContext) => {
			return handleVariants(`
				.${escapeSelector(rawSelector)} {
					margin: -${Number.parseFloat(gapSize) / 4 / 2}rem;
				}

				.${escapeSelector(rawSelector)} > * {
					margin: ${Number.parseFloat(gapSize) / 4 / 2}rem;
				}
			`, variantHandlers)
		}]
	],
	variants: [
		generateMediaVariant("xl", 1500),
		generateMediaVariant("lg", 1100),
		generateMediaVariant("md", 900),
		generateMediaVariant("sm", 700),
		generateMediaVariant("xs", 500),
		generateMediaVariant("2xs", 400),
	],
	theme: {
		colors: {
			...generateThemeObj([
				"background", "primary", "secondary", "text", "link", "success",
				"error", "info", "warning", "action", "border", "accent"
			]),
			divider: `var(--theme-divider, ${baseTheme.divider})`,
			favourite: baseTheme.favourite
		},
		boxShadow: {
			"stuff": ['var(--un-shadow-inset) 0 20px 25px -5px rgba(0,0,0,0.1)', 'var(--un-shadow-inset) 0 8px 10px -6px rgba(0,0,0,0.1)'],
			...generateThemeObj("shadows", false)
		},
		borderRadius: {
			...generateThemeObj("radius")
		},
		fontFamily: baseTheme.font,
		fontSize: {
			"button": ["1.25rem", "1em"],
			"2xs": ["0.625rem", "1.2em"],
			"3xs": ["0.55rem", "1.2em"],
			"card-title": ["1.25rem", "1em"]
		},
		transitionProperty: {
			"position": "top, left, bottom, right"
		}
	}
}

export default unoConfig;