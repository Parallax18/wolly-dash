import React, { useContext, useState } from "react"
import Card, { CardBody, CardTitle } from "../../components/Card"
import Form from "../../components/Form"
import FormInput from "../../components/FormInput"
import Page from "../../components/Page"
import { AlertContext } from "../../context/AlertContext"
import { AuthContext } from "../../context/AuthContext"
import { Component } from "../../types/Util"
import { getCountryCodeFromDialCode, getDialCodeFromCountryCode, pick, splitPhoneNumber, useEditUserRequest, userUpdateSchema } from "../../util"

import "./AccountPage.css"

import EmailIcon from "../../svg/icons/email-outline.svg"
import NameIcon from "../../svg/icons/account-circle-outline.svg"
import Input from "../../components/Input"
import NationalityInput from "../../components/NationalityInput"
import Button from "../../components/Button"
import PhoneInput from "../../components/PhoneInput"

const AccountPage: Component = () => {
	const authContext = useContext(AuthContext)
	const alertContext = useContext(AlertContext)
	const [ changed, setChanged ] = useState(false)

	const editUserRequest = useEditUserRequest()

	const phoneNumberSplit = splitPhoneNumber(authContext.user?.mobile || "")

	const initialValues = {
		...pick(authContext.user || {}, [
			"first_name",
			"last_name",
			"nationality",
		]),
		phone_number: phoneNumberSplit.number,
		country_code: getCountryCodeFromDialCode(phoneNumberSplit.dial_code)
	}

	const onSubmit = (values: Record<string, any>) => {
		if (!authContext.user) return;
		
		const dialCode = getDialCodeFromCountryCode(values.country_code)
		const mobile = `${dialCode} ${values.phone_number}`
		
		editUserRequest.sendRequest(authContext.user.id, {
			first_name: values.first_name,
			last_name: values.last_name,
			nationality: values.nationality,
			mobile
		})
			.then((res) => {
				authContext.updateUser(res.data)
				alertContext.addAlert({
					type: "success", label: "Successfully updated user"
				})
			})
			.catch((err) => {
				alertContext.addAlert({
					type: "error", label: "Error updating user" + (err.message ? `: ${err.message}` : "")
				})
			})
	}
	
	return (
		<Page path="/account" userRestricted>
			<div className="account-page gap-4">
				<Card className="max-w-150 flex-[2]">
					<CardTitle>
						Your Profile
					</CardTitle>
					<CardBody className="flex flex-col">
						<Form
							initialValues={initialValues}
							validationSchema={userUpdateSchema}
							onSubmit={onSubmit}
							onUpdate={() => !changed && setChanged(true)}
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
							<Input
								disabled
								icon={EmailIcon}
								value={authContext.user?.email}
								placeholder="Email"
								autoCapitalize="off"
								autoComplete="email"
							/>
							<PhoneInput
								numberField="phone_number"
								codeField="country_code"
							/>
							<NationalityInput field="nationality" />
							<Button
								color="primary"
								className="mt-4"
								disabled={!changed}
								loading={editUserRequest.fetching}
							>
								Save Changes
							</Button>
						</Form>
						<Button
							color="primary"
							buttonStyle="outlined"
							className="mt-8"
						>
							Logout
						</Button>
					</CardBody>
				</Card>
			</div>
		</Page>
	)
}

export default AccountPage