export interface TokenItem {
	name: string,
	symbol: string,
	imageUrl: string
}

export const tokenList: TokenItem[] = [
	{
		name: "Ethereum",
		symbol: "ETH",
		imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png"
	},
	{
		name: "Bitcoin",
		symbol: "BTC",
		imageUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
	},
	{
		name: "Tether - ERC20",
		symbol: "USDTERC20",
		imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png"
	},
	{
		name: "Tether - TRC20",
		symbol: "USDTTRC20",
		imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png"
	},
	{
		name: "Litecoin",
		symbol: "LTC",
		imageUrl: "https://assets.coingecko.com/coins/images/2/small/litecoin.png"
	}
]