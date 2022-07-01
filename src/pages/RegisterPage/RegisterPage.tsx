import type { Component } from "../../types/Util"
import { Link, useNavigate } from "react-router-dom"

import FormPage from "../../components/FormPage"
import Page from "../../components/Page"

import Button from "../../components/Button"

import "./RegisterPage.css"

import EmailIcon from "../../svg/icons/email-outline.svg"
import PasswordIcon from "../../svg/icons/lock-outline.svg"
import NameIcon from "../../svg/icons/account-circle-outline.svg"

import { useRegisterRequest, UserArgs, registerSchema, pick, getDialCodeFromCountryCode, errorToString, tokenList } from "../../util"
import NationalityInput from "../../components/NationalityInput"
import Form, { FormRender } from "../../components/Form"
import FormInput from "../../components/FormInput"

import * as Yup from "yup"
import { AuthContext } from "../../context/AuthContext"
import { AlertContext } from "../../context/AlertContext"
import { User } from "../../types/Api"
import PhoneInput from "../../components/PhoneInput"
import { useContext, useState } from "react"
import FormCheckbox from "../../components/FormCheckbox"
import TokenSelect from "../../components/TokenSelect"
import FormNumberInput from "../../components/FormNumberInput"
import { SelectModalWrapper } from "../../components/SelectModal"
import TokenSelectModal, { FormTokenSelectModal, TokenSelectItem } from "../../components/TokenSelectModal"

import _DropdownIcon from "../../svg/icons/down-chevron.svg"
import { CurrencyItemDisplay } from "../../components/BuyPage"
import { StageContext } from "../../context/StageContext"

const DropdownIcon = _DropdownIcon as unknown as Component<any>

const RegisterPage: Component = () => {
	const navigate = useNavigate()
	const authContext = useContext(AuthContext)
	const alertContext = useContext(AlertContext)
	const { activeStage } = useContext(StageContext)

	const registerRequest = useRegisterRequest()

	const [ tokenModalOpen, setTokenModalOpen ] = useState(false)

	const initialValues = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		nationality: "",
		phone_number: "",
		country_code: "GB",
		terms_accepted: false,
		token: tokenList[0],
		usd_amount: 0
	}

	const onSubmit = (vals: Record<string, any>) => {
		const dialCode = getDialCodeFromCountryCode(vals.country_code)
		let mobile: string | undefined = `${dialCode} ${vals.phone_number}`
		if (!vals.phone_number) mobile = undefined;

		registerRequest.sendRequest({
			...pick(vals, ["first_name", "last_name", "email", "nationality", "password"]),
			mobile
		} as UserArgs).then((res) => {
			authContext.login(res.data.user, res.data.tokens)
			navigate(`/buy?usd_amount=${vals.usd_amount}&token_id=${vals.token.id}`, {replace: true})
			alertContext.addAlert({
				type: "success",
				label: "Successfully registered"
			})
		}).catch((err) => {
			alertContext.addAlert({
				type: "error",
				label: errorToString(err, "Error while registering")
			})
		})
	}

	return (
		<Page path="/register" title="Register" onlyLoggedOut>
			<Form
				className="register-page flex-1"
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={registerSchema}
			>
				<FormPage
					title="Register an account"
					background={"/image/background/hexagons.svg"}
					classes={{body: "flex flex-col flex-gap-y-4", wrapper: "relative"}}
					outsideElement={(
						<SelectModalWrapper open={tokenModalOpen}>
							<FormTokenSelectModal
								field="token"
								open={tokenModalOpen}
								onClose={() => setTokenModalOpen(false)}
								bonuses={activeStage?.bonuses.payment_tokens}
							/>
						</SelectModalWrapper>
					)}
				>
					<div className="flex flex-gap-x-2">
						<FormInput
							field="first_name"
							icon={NameIcon}
							placeholder="First Name"
							autoComplete="given-name"
							autoCapitalize="words"
							className="flex-[1.3]"
						/>
						<FormInput
							field="last_name"
							placeholder="Last Name"
							autoComplete="family-name"
							autoCapitalize="words"
							className="flex-1"
						/>
					</div>
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
					<div className="flex flex-col flex-gap-y-4">
						<h2 className="text-lg">Purchase Details</h2>
						<FormRender>
							{(formContext) => (
								<CurrencyItemDisplay
									component={Button}
									className="py-3 !justify-start w-full group"
									color="bg-contrast"
									type="button"
									onClick={() => setTokenModalOpen(true)}
									currencyItem={formContext.values.token}
									bonuses={activeStage?.bonuses.payment_tokens}
									classes={{bonusChip: "bg-background-paperLight group-hover:bg-background-paperHighlight transition-background-color"}}
								>
									<DropdownIcon className="h-3 w-3 ml-auto text-action-unselected group-hover:text-text-primary transition-color" />
								</CurrencyItemDisplay>
							)}
						</FormRender>
						<FormNumberInput
							field="usd_amount"
							placeholder="Purchase Amount $"
							autoCapitalize="off"
						/>
					</div>
					<div className="flex items-center">
						<FormCheckbox
							field="terms_accepted"
							className="inline-block"
						/>
						<span className="ml-3">I agree to the Terms and Conditions and Privacy Policy</span>
					</div>
					<div className="login-footer flex-gap-y-4 flex flex-col mt-2 <xs:mt-2">
						<Button color="primary" loading={registerRequest.fetching}>
							Create Account
						</Button>
						<span className="text-center">
							Already have account? <Link to="/login">Sign in</Link>
						</span>
					</div>
				</FormPage>
			</Form>
		</Page>
	)
}

export default RegisterPage