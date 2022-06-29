import { countries } from "country-flags-svg"

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
		imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
		chain: "ERC20"		
	},
	{
		name: "Tether",
		symbol: "USDT",
		imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
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
	let isDuplicate = !!list.find((currItem) => currItem.symbol === item.symbol && currItem !== item)
	if (isDuplicate) return `${item.name} (${item.chain})`
	return `${item.name}`
}