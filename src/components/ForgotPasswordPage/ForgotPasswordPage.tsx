import React, { useContext, useEffect, useState } from "react"
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
import { Link } from "react-router-dom"

const ForgotPasswordPage: Component = () => {
	const forgotPasswordRequest = useForgotPasswordRequest()
	const alertContext = useContext(AlertContext)
	const [ timeLeft, setTimeLeft ] = useState(0)

	useEffect(() => {
		if (!forgotPasswordRequest.fetchedAt) return;
		setTimeLeft(60)
		let interval = setInterval(() => {
			if (timeLeft - 1 === 0) clearInterval(interval)
			setTimeLeft((timeLeft) => Math.max(timeLeft - 1, 0))
		}, 1000)
		return () => clearInterval(interval)
	}, [forgotPasswordRequest.fetchedAt])

	const initialValues = {
		email: ""
	}

	const sendPasswordReset = (values: Record<string, any>) => {
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
					<Link to="/login" className="inline-block mb-4 text-right">Back to login</Link>
					<Button
						type="submit"
						color="primary"
						className="mt-4"
						loading={forgotPasswordRequest.fetching}
						disabled={timeLeft > 0}
					>
						Send Password Reminder{timeLeft > 0 && ` (${timeLeft})`}
					</Button>
				</Form>
			</FormPage>
		</Page>
	)
}

export default ForgotPasswordPage