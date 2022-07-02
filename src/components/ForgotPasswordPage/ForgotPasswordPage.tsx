import React, { useContext } from "react"
import { Component } from "../../types/Util"
import Form from "../Form"
import FormInput from "../FormInput"
import FormPage from "../FormPage"
import Page from "../Page"

import "./ForgotPasswordPage.css"

import EmailIcon from "../../svg/icons/email-outline.svg"
import Button from "../Button"
import { errorToString, useForgotPasswordRequest } from "../../util"
import { AlertContext } from "../../context/AlertContext"

import * as Yup from "yup"

const ForgotPasswordPage: Component = () => {
	const forgotPasswordRequest = useForgotPasswordRequest()
	const alertContext = useContext(AlertContext)

	const initialValues = {
		email: ""
	}

	const sendPasswordReset = (values: Record<string, any>) => {
		console.log("SUBMITTING")
		forgotPasswordRequest.sendRequest(values.email)
			.then(() => {
				alertContext.addAlert({
					type: "success",
					label: "Successfully sent password reset email",
					duration: 4000
				})
			})
			.catch((err) => {
				alertContext.addAlert({
					type: "error",
					label: errorToString(err, "Error sending password reset email"),
					duration: 4000
				})
			})
	}

	return (
		<Page path="/forgot-password" title="Forgot Password" onlyLoggedOut>
			<FormPage
				title="Forgot Password"
				background={"/image/background/hexagons.svg"}
				classes={{card: "w-100"}}
			>
				<Form
					onSubmit={sendPasswordReset}
					initialValues={initialValues}
					validationSchema={Yup.object().shape({email: Yup.string().required("Can't be empty").email("Invalid email")})}
				>
					<FormInput
						field="email"
						icon={EmailIcon}
						placeholder="Email"
						autoCapitalize="off"
						autoComplete="email"
					/>
					<Button
						type="submit"
						color="primary"
						className="mt-4"
						loading={forgotPasswordRequest.fetching}
					>
						Send Password Reminder
					</Button>
				</Form>
			</FormPage>
		</Page>
	)
}

export default ForgotPasswordPage