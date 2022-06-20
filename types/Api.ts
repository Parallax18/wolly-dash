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
	access: Token,
	refresh: Token
}

export interface LoginResponse {
	user: User,
	tokens: Tokens
}