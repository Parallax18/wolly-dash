import { countries } from "country-flags-svg"
import { PaymentToken, Transaction } from "../types/Api"
import { isDuplicate } from "./data"

export interface CurrencyItem {
	id?: string,
	name: string,
	symbol: string,
	imageUrl: string,
	chain?: string
}

export const tokenImageMap: {[symble: string]: string} = {
	ETH: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzYyN0VFQSIvPjxnIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbC1vcGFjaXR5PSIuNjAyIiBkPSJNMTYuNDk4IDR2OC44N2w3LjQ5NyAzLjM1eiIvPjxwYXRoIGQ9Ik0xNi40OTggNEw5IDE2LjIybDcuNDk4LTMuMzV6Ii8+PHBhdGggZmlsbC1vcGFjaXR5PSIuNjAyIiBkPSJNMTYuNDk4IDIxLjk2OHY2LjAyN0wyNCAxNy42MTZ6Ii8+PHBhdGggZD0iTTE2LjQ5OCAyNy45OTV2LTYuMDI4TDkgMTcuNjE2eiIvPjxwYXRoIGZpbGwtb3BhY2l0eT0iLjIiIGQ9Ik0xNi40OTggMjAuNTczbDcuNDk3LTQuMzUzLTcuNDk3LTMuMzQ4eiIvPjxwYXRoIGZpbGwtb3BhY2l0eT0iLjYwMiIgZD0iTTkgMTYuMjJsNy40OTggNC4zNTN2LTcuNzAxeiIvPjwvZz48L2c+PC9zdmc+",
	BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
	BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
	USDT: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0%0D%0APSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIg%0D%0AY3k9IjE2IiByPSIxNiIgZmlsbD0iIzI2QTE3QiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xNy45%0D%0AMjIgMTcuMzgzdi0uMDAyYy0uMTEuMDA4LS42NzcuMDQyLTEuOTQyLjA0Mi0xLjAxIDAtMS43MjEt%0D%0ALjAzLTEuOTcxLS4wNDJ2LjAwM2MtMy44ODgtLjE3MS02Ljc5LS44NDgtNi43OS0xLjY1OCAwLS44%0D%0AMDkgMi45MDItMS40ODYgNi43OS0xLjY2djIuNjQ0Yy4yNTQuMDE4Ljk4Mi4wNjEgMS45ODguMDYx%0D%0AIDEuMjA3IDAgMS44MTItLjA1IDEuOTI1LS4wNnYtMi42NDNjMy44OC4xNzMgNi43NzUuODUgNi43%0D%0ANzUgMS42NTggMCAuODEtMi44OTUgMS40ODUtNi43NzUgMS42NTdtMC0zLjU5di0yLjM2Nmg1LjQx%0D%0ANFY3LjgxOUg4LjU5NXYzLjYwOGg1LjQxNHYyLjM2NWMtNC40LjIwMi03LjcwOSAxLjA3NC03Ljcw%0D%0AOSAyLjExOCAwIDEuMDQ0IDMuMzA5IDEuOTE1IDcuNzA5IDIuMTE4djcuNTgyaDMuOTEzdi03LjU4%0D%0ANGM0LjM5My0uMjAyIDcuNjk0LTEuMDczIDcuNjk0LTIuMTE2IDAtMS4wNDMtMy4zMDEtMS45MTQt%0D%0ANy42OTQtMi4xMTciLz48L2c+PC9zdmc+",
	LTC: "https://assets.coingecko.com/coins/images/2/small/litecoin.png",
	DOGE: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
	MATIC: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png"
}

const tokenChainMap: Record<string, string[]> = {
	"ERC20": ["ERC-20", "ERC20", "ETH", "ETHEREUM"],
	"BSC": ["BSC", "BINANCE SMART CHAIN", "BEP20", "BEP-20"],
	"BTC": ["BTC", "BITCOIN"]
}

export const getWalletQRValue = (payment_token: PaymentToken, address: string): string => {
	let chain = payment_token.chain.toLowerCase() === "bitcoin" ? "bitcoin" : "ethereum";
	return `${chain}:${address}`
}

const tokenChainMapEntries = Object.entries(tokenChainMap)

export const getChainDisplayName = (chain: string | undefined): string | undefined => {
	if (!chain) return "ERC20"
	for (let i = 0; i < tokenChainMapEntries.length; i++) {
		const [name, aliases] = tokenChainMapEntries[i]
		if (aliases.includes(chain.toUpperCase())) {
			return name;
		}
	}
	return chain;
}

export const apiToCurrency = (apiToken: PaymentToken) => {
	return {
		id: apiToken.id,
		name: apiToken.name,
		symbol: apiToken.short_name,
		imageUrl: tokenImageMap[apiToken.short_name] || "",
		chain: getChainDisplayName(apiToken.chain)
	} as CurrencyItem
}

export const apiListToCurrencyList = (tokens: PaymentToken[]) => {
	return (tokens || [])
		.map((apiToken) => apiToCurrency(apiToken))
		.filter((token) => token !== undefined)
}

export const fiatList: CurrencyItem[] = [
	{
		name: "Dollar",
		symbol: "USD",
		imageUrl: countries.find((country) => country.iso3 === "USA")?.flag || ""
	}
]

export const dollarItem = fiatList[0]

export const getTokenLabelString = (list: CurrencyItem[], item: CurrencyItem) => {
	let duplicate = isDuplicate(item, list, (currItem: CurrencyItem) => currItem.symbol === item.symbol)
	if (duplicate || item.chain !== "ERC20") return `${item.name} (${item.chain})`
	return `${item.name}`
}