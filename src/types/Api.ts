export interface APIError {
	code: number,
	message: string
}

export interface User {
	id: string,
	first_name: string,
	last_name: string,
	email: string,
	mobile: string | null,
	nationality: string,
	role: "user" | "admin"
}

export interface Token {
	token: string,
	expires: string
}

export interface Tokens {
	access?: Token,
	refresh?: Token
}

export interface LoginResponse {
	user: User,
	tokens: Tokens
}

export interface Stage {
	id: string,
	project_id: string,
	name: string,
	type: "string",
	token_price: number,
	liquidity: number,
	start_date: string,
	end_date: string,
	total_tokens: number,
	sold_tokens: number,
	disabled: boolean,
	min_fiat_amount: number | null,
	max_fiat_amount: number | null
}