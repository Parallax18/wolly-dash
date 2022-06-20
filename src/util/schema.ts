import * as Yup from "yup"

export const userSchema =  Yup.object().shape({
	first_name: Yup.string().required("Can't be empty"),
	last_name: Yup.string().required("Can't be empty"),
	email: Yup.string().email("Email is invalid").required("Can't be empty"),
	password: Yup.string()
		.matches(/([a-zA-Z]\d)|(\d[a-zA-Z])/, "Must have at least 1 number and 1 letter")
		.max(32, "Maximum 32 character")
		.min(8, "Minimum 8 character"),
	nationality: Yup.string().required("Can't be empty")
})

export const userUpdateSchema =  Yup.object().shape({
	first_name: Yup.string().required("Can't be empty"),
	last_name: Yup.string().required("Can't be empty"),
	nationality: Yup.string().required("Can't be empty")
})