import { countries } from "country-flags-svg"
import { isDuplicate } from "./data"

export interface CurrencyItem {
	name: string,
	symbol: string,
	imageUrl: string,
	chain?: "ERC20" | "BEP20" | "TRC20"
}

export const tokenList: CurrencyItem[] = [
	{
		name: "Ethereum",
		symbol: "ETH",
		imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
		chain: "ERC20"
	},
	{
		name: "Bitcoin",
		symbol: "BTC",
		imageUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
		chain: "ERC20"
	},
	{
		name: "Tether",
		symbol: "USDT",
		imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0%0D%0APSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIg%0D%0AY3k9IjE2IiByPSIxNiIgZmlsbD0iIzI2QTE3QiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xNy45%0D%0AMjIgMTcuMzgzdi0uMDAyYy0uMTEuMDA4LS42NzcuMDQyLTEuOTQyLjA0Mi0xLjAxIDAtMS43MjEt%0D%0ALjAzLTEuOTcxLS4wNDJ2LjAwM2MtMy44ODgtLjE3MS02Ljc5LS44NDgtNi43OS0xLjY1OCAwLS44%0D%0AMDkgMi45MDItMS40ODYgNi43OS0xLjY2djIuNjQ0Yy4yNTQuMDE4Ljk4Mi4wNjEgMS45ODguMDYx%0D%0AIDEuMjA3IDAgMS44MTItLjA1IDEuOTI1LS4wNnYtMi42NDNjMy44OC4xNzMgNi43NzUuODUgNi43%0D%0ANzUgMS42NTggMCAuODEtMi44OTUgMS40ODUtNi43NzUgMS42NTdtMC0zLjU5di0yLjM2Nmg1LjQx%0D%0ANFY3LjgxOUg4LjU5NXYzLjYwOGg1LjQxNHYyLjM2NWMtNC40LjIwMi03LjcwOSAxLjA3NC03Ljcw%0D%0AOSAyLjExOCAwIDEuMDQ0IDMuMzA5IDEuOTE1IDcuNzA5IDIuMTE4djcuNTgyaDMuOTEzdi03LjU4%0D%0ANGM0LjM5My0uMjAyIDcuNjk0LTEuMDczIDcuNjk0LTIuMTE2IDAtMS4wNDMtMy4zMDEtMS45MTQt%0D%0ANy42OTQtMi4xMTciLz48L2c+PC9zdmc+",
		chain: "ERC20"		
	},
	{
		name: "Tether",
		symbol: "USDT",
		imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0%0D%0APSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIg%0D%0AY3k9IjE2IiByPSIxNiIgZmlsbD0iIzI2QTE3QiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xNy45%0D%0AMjIgMTcuMzgzdi0uMDAyYy0uMTEuMDA4LS42NzcuMDQyLTEuOTQyLjA0Mi0xLjAxIDAtMS43MjEt%0D%0ALjAzLTEuOTcxLS4wNDJ2LjAwM2MtMy44ODgtLjE3MS02Ljc5LS44NDgtNi43OS0xLjY1OCAwLS44%0D%0AMDkgMi45MDItMS40ODYgNi43OS0xLjY2djIuNjQ0Yy4yNTQuMDE4Ljk4Mi4wNjEgMS45ODguMDYx%0D%0AIDEuMjA3IDAgMS44MTItLjA1IDEuOTI1LS4wNnYtMi42NDNjMy44OC4xNzMgNi43NzUuODUgNi43%0D%0ANzUgMS42NTggMCAuODEtMi44OTUgMS40ODUtNi43NzUgMS42NTdtMC0zLjU5di0yLjM2Nmg1LjQx%0D%0ANFY3LjgxOUg4LjU5NXYzLjYwOGg1LjQxNHYyLjM2NWMtNC40LjIwMi03LjcwOSAxLjA3NC03Ljcw%0D%0AOSAyLjExOCAwIDEuMDQ0IDMuMzA5IDEuOTE1IDcuNzA5IDIuMTE4djcuNTgyaDMuOTEzdi03LjU4%0D%0ANGM0LjM5My0uMjAyIDcuNjk0LTEuMDczIDcuNjk0LTIuMTE2IDAtMS4wNDMtMy4zMDEtMS45MTQt%0D%0ANy42OTQtMi4xMTciLz48L2c+PC9zdmc+",
		chain: "TRC20"
	},
	{
		name: "Litecoin",
		symbol: "LTC",
		imageUrl: "https://assets.coingecko.com/coins/images/2/small/litecoin.png",
		chain: "ERC20"
	},
	{
		name: "Dogecoin",
		symbol: "DOGE",
		imageUrl: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
		chain: "ERC20"
	},
	{
		name: "Polygon",
		symbol: "MATIC",
		imageUrl: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
		chain: "ERC20"
	}
]



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
	if (duplicate) return `${item.name} (${item.chain})`
	return `${item.name}`
}