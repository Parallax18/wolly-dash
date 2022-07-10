import { PaymentToken, Transaction } from "../types/Api";

export const defaultPaymentToken: PaymentToken = {
	chain: "",
	id: "",
	name: "",
	short_name: "",
	payment_provider_ids: {}
}

export const defaultTransaction: Transaction = {
	actual_purchase_amount_crypto: null,
	actual_purchase_amount_fiat: null,
	completed_date: null,
	id: "",
	initial_purchase_amount_crypto: 0,
	initial_purchase_amount_fiat: 0,
	payment_address: "",
	payment_id: "",
	payment_token: defaultPaymentToken,
	status: "completed",
	token_price: 0,
	tokens: {
		base: 0,
		bonuses: {},
		total: 0
	},
	user_id: "",
	type: "purchase"
}