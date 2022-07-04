import * as Yup from "yup"

export const passwordSchema = Yup.string()
	.matches(/([a-zA-Z]\d)|(\d[a-zA-Z])/, "Must have at least 1 number and 1 letter")
	.max(32, "Maximum 32 character")
	.min(8, "Minimum 8 character")

export const registerSchema =  Yup.object().shape({
	first_name: Yup.string().required("Can't be empty"),
	last_name: Yup.string().required("Can't be empty"),
	email: Yup.string().email("Email is invalid").required("Can't be empty"),
	password: passwordSchema,
	nationality: Yup.string().required("Can't be empty"),
	phone_number: Yup.string(),
	country_code: Yup.string(),
	terms_accepted: Yup.bool()
		.required("Must accept terms and conditions")
		.oneOf([true], "Must accept terms and conditions"),
	token: Yup.object().shape({
		name: Yup.string().required(),
		symbol: Yup.string().required(),
		imageUrl: Yup.string(),
		chain: Yup.string()
	}),
	usd_amount: Yup.number()
		.required("Can't be empty")
		.min(0.01, "Must be more than 0.01")
})

export const userUpdateSchema = Yup.object().shape({
	first_name: Yup.string().required("Can't be empty"),
	last_name: Yup.string().required("Can't be empty"),
	nationality: Yup.string().required("Can't be empty")
})

const walletAddressRegex = /^0x[0-9a-f]{40}$/i

export const walletAddressSchema = Yup.string()
	.matches(walletAddressRegex, "Invalid wallet address")