import type { Component } from "../../types/Util"
import { Link } from "react-router-dom"

import FormPage from "../../components/FormPage"
import Page from "../../components/Page"

import Button from "../../components/Button"

import "./RegisterPage.css"

import EmailIcon from "../../svg/icons/email-outline.svg"
import PasswordIcon from "../../svg/icons/lock-outline.svg"
import NameIcon from "../../svg/icons/account-circle-outline.svg"

import { useRegisterRequest, UserArgs, userSchema, pick, getDialCodeFromCountryCode } from "../../util"
import NationalityInput from "../../components/NationalityInput"
import Form from "../../components/Form"
import FormInput from "../../components/FormInput"

import * as Yup from "yup"
import { AuthContext } from "../../context/AuthContext"
import { AlertContext } from "../../context/AlertContext"
import { User } from "../../types/Api"
import PhoneInput from "../../components/PhoneInput"
import { useContext } from "react"

const RegisterPage: Component = () => {
	const authContext = useContext(AuthContext)
	const alertContext = useContext(AlertContext)

	const registerRequest = useRegisterRequest()

	const initialValues = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		nationality: "",
		phone_number: "",
		country_code: "GB",
	}

	const onSubmit = (vals: Record<string, any>) => {
		const dialCode = getDialCodeFromCountryCode(vals.country_code)
		const mobile = `${dialCode} ${vals.phone_number}`

		registerRequest.sendRequest({
			...pick(vals, ["first_name", "last_name", "email", "nationality", "password"]),
			mobile
		} as UserArgs).then((res) => {
			authContext.login(res.data.user, res.data.tokens)

			alertContext.addAlert({
				type: "success",
				label: "Successfully registered"
			})
		}).catch((err) => {
			alertContext.addAlert({
				type: "error",
				label: "Error while registering"
			})
		})
	}

	return (
		<Page path="/register" title="Register" onlyLoggedOut>
			<FormPage title="Register an account" background={"/image/background/hexagons.svg"}>
				<Form
					className="flex flex-col flex-gap-y-4"
					initialValues={initialValues}
					onSubmit={onSubmit}
					validationSchema={userSchema}
				>
					<FormInput
						field="first_name"
						icon={NameIcon}
						placeholder="First Name"
						autoComplete="given-name"
						autoCapitalize="words"
					/>
					<FormInput
						field="last_name"
						icon={NameIcon}
						placeholder="Last Name"
						autoComplete="family-name"
						autoCapitalize="words"
					/>
					<FormInput
						field="email"
						icon={EmailIcon}
						placeholder="Email"
						autoComplete="email"
						autoCapitalize="off"
					/>
					<FormInput
						field="password"
						icon={PasswordIcon}
						placeholder="Password"
						autoCapitalize="off"
						visibilityToggle
					/>
					<PhoneInput
						numberField="phone_number"
						codeField="country_code"
					/>
					<NationalityInput field="nationality" />
					<div className="login-footer flex-gap-y-4 flex flex-col mt-10 <xs:mt-8">
						<Button color="primary" loading={registerRequest.fetching}>
							Create Account
						</Button>
						<span className="text-center">
							Already have account? <Link to="/login">Sign in</Link>
						</span>
					</div>
				</Form>
			</FormPage>
		</Page>
	)
}

export default RegisterPage