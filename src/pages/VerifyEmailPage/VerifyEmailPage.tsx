import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router";
import Page from "../../components/Page";
import Spinner from "../../components/Spinner";
import { AlertContext } from "../../context/AlertContext";
import { AuthContext } from "../../context/AuthContext";
import { Component } from "../../types/Util"
import { errorToString, useVerifyEmailRequest } from "../../util";

import "./VerifyEmailPage.css"

const VerifyEmailPage: Component = () => {
	const alertContext = useContext(AlertContext)
	const authContext = useContext(AuthContext)
	const navigate = useNavigate()
	const verifyEmailRequest = useVerifyEmailRequest()

	const verify = () => {

		const params = new URLSearchParams(location.search);
		const token = params.get("token");

		if (!token) {
			alertContext.addAlert({type: "error", label: "No token provided", duration: 4000})
			navigate("/", {replace: true})
			return;
		}

		verifyEmailRequest.sendRequest(token)
			.then(() => {
				alertContext.addAlert({type: "success", label: "Successfully verified user"})
				authContext.updateUser({is_email_verified: true})
			})
			.catch((err) => {
				alertContext.addAlert({type: "error", label: errorToString(err, "Error verifying email")})
			})
			.finally(() => navigate("/", {replace: true}))
	}

	useEffect(() => {
		verify()
	}, [])
	return (
		<Page path="/verify-email" title="Verify Email">
			<div className="verify-page">
				<Spinner size={20} />
			</div>
		</Page>
	)
}

export default VerifyEmailPage