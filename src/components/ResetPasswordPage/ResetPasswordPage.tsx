import React, { useContext } from "react"
import { useNavigate } from "react-router"
import { AlertContext } from "../../context/AlertContext"
import { Component } from "../../types/Util"
import { errorToString, passwordSchema, useResetPasswordRequest } from "../../util"
import Form from "../Form"
import Page from "../Page"

import "./ResetPasswordPage.css"

import * as Yup from "yup"
import FormPage from "../FormPage"
import FormInput from "../FormInput"
import Button from "../Button"

import PasswordIcon from "../../svg/icons/lock-outline.svg"

const ResetPasswordPage: Component = () => {
	const resetPasswordRequest = useResetPasswordRequest()
	const navigate = useNavigate()
	const alertContext = useContext(AlertContext)

	const initialValues = {
		newPassword: ""
	}

	const resetPassword = (values: Record<string, any>) => {
		const params = new URLSearchParams(location.search);
		const token = params.get("token");

		if (!token) {
			alertContext.addAlert({type: "error", label: "No token provided", duration: 4000})
			return;
		}
		resetPasswordRequest.sendRequest(token, values.newPassword)
			.then(() => {
				alertContext.addAlert({type: "success", label: "Successfully reset password"})
				navigate("/login", { replace: true })
			})
			.catch((err) => alertContext.addAlert({type: "error", label: errorToString(err, "Error resetting password")}))
	}

	return (
		<Page path="/reset-password" title="Reset Password" onlyLoggedOut>
			<FormPage
				title="Reset Password"
				background={"/image/background/hexagons.svg"}
				classes={{card: "w-100"}}
			>
				<Form
					onSubmit={resetPassword}
					initialValues={initialValues}
					validationSchema={Yup.object().shape({newPassword: passwordSchema})}
				>
					<FormInput
						field="newPassword"
						icon={PasswordIcon}
						visibilityToggle
						placeholder="New Password"
						autoCapitalize="off"
						autoComplete="new-password"
					/>
					<Button
						type="submit"
						color="primary"
						className="mt-4"
						loading={resetPasswordRequest.fetching}
					>
						Reset Password
					</Button>
				</Form>
			</FormPage>
		</Page>
	)
}

export default ResetPasswordPage