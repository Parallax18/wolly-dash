import React, { useContext, useEffect, useState } from "react"
import Card, { CardBody, CardTitle } from "../../components/Card"
import Form from "../../components/Form"
import FormInput from "../../components/FormInput"
import Page from "../../components/Page"
import { AlertContext } from "../../context/AlertContext"
import { AuthContext } from "../../context/AuthContext"
import { Component } from "../../types/Util"
import { errorToString, getCountryCodeFromDialCode, getDialCodeFromCountryCode, pick, splitPhoneNumber, useEditUserRequest, userUpdateSchema, useSendVerificationEmailRequest, walletAddressSchema } from "../../util"

import * as Yup from "yup"

import "./AccountPage.css"

import EmailIcon from "../../svg/icons/email-outline.svg"
import NameIcon from "../../svg/icons/account-circle-outline.svg"
import Input from "../../components/Input"
import NationalityInput from "../../components/NationalityInput"
import Button from "../../components/Button"
import PhoneInput from "../../components/PhoneInput"

import VerifiedIcon from "../../svg/icons/verified.svg"
import UnverifiedIcon from "../../svg/icons/unverified.svg"
import WalletIcon from "../../svg/icons/payments.svg"
import { ProjectContext } from "../../context/ProjectContext"
import { Loadable, Loader } from "../../components/Loader"

const AccountPage: Component = () => {
	
	return (
		<Page path="/account" userRestricted>
			<div className="account-page">
				<div className="gap-wrapper gap-4 !m-0">
					<ProfileCard />
					<div>
						<WalletCard />
						<MailVerificationCard />
					</div>
				</div>
			</div>
		</Page>
	)
}

export const MailVerificationCard: Component = () => {
	const authContext = useContext(AuthContext)
	const sendVerificationEmailRequest = useSendVerificationEmailRequest()
	const [ timeLeft, setTimeLeft ] = useState(0)
	const alertContext = useContext(AlertContext)

	return(
		<Card className="wallet-card mt-10">
		{authContext.user?.is_email_verified === false && (
					<Button
						color="primary"
						className="mt-4 rounded-md w-[100%]"
						loading={sendVerificationEmailRequest.fetching}
						disabled={timeLeft > 0}
						style={{background: '#158FFF', color: 'white'}}
						onClick={
							() => sendVerificationEmailRequest.sendRequest()
								.then(() => alertContext.addAlert({type: "success", label: "Successfully sent verification email"}))
								.catch((err) => alertContext.addAlert({type: "error", label: errorToString(err, "Error sending verification email")}))
						}
					>
						Resend Verification Email{timeLeft > 0 && ` (${timeLeft})`}
					</Button>
				)}
				<Button
					buttonStyle="transparent"
					className="mt-4 w-[100%]"
					onClick={() => authContext.logout()}
				>
					Logout
				</Button>
		</Card>
	)
}

export const WalletCard: Component = () => {
	const [ changed, setChanged ] = useState(false)
	const authContext = useContext(AuthContext)
	const alertContext = useContext(AlertContext)

	const { currentProject, currProjectRequest } = useContext(ProjectContext)

	const editUserRequest = useEditUserRequest()

	const initialValues = {
		wallet: authContext.user?.wallet || ""
	}

	const onSubmit = (values: any) => {
		if (!authContext.user) return;
		editUserRequest.sendRequest(authContext.user?.id, {wallet: values.wallet})
			.then(() => alertContext.addAlert({type: "success", label: "Successfully saved wallet address"}))
			.catch((err) => alertContext.addAlert({type: "error", label: errorToString(err, "Error saving wallet address")}))
	}

	return (
		<Card className="wallet-card">
			<CardTitle>
				Wallet Address
			</CardTitle>
			<CardBody className="flex flex-col">
				<Loader loading={currProjectRequest.fetching}>
					<Loadable component="p" className="mb-2" style={{color: '#333'}}>
						Make sure you use an <span className="font-semibold">{currentProject?.wallet?.type}</span> wallet address.
					</Loadable>
				</Loader>
				<Form
					initialValues={initialValues}
					validationSchema={Yup.object().shape({wallet: walletAddressSchema})}
					onSubmit={onSubmit}
					onUpdate={() => !changed && setChanged(true)}
				>
					<FormInput
						field="wallet"
						icon={WalletIcon}
						placeholder="Wallet Address"
						autoCapitalize="off"
					/>
					<Button
						color="primary"
						className="mt-4 rounded-md"
						disabled={!changed || currProjectRequest.fetching}
						loading={editUserRequest.fetching}
						style={{background: '#158FFF', color: 'white'}}
					>
						Save Changes
					</Button>
				</Form>
			</CardBody>
		</Card>
	)
}


export const ProfileCard: Component = () => {
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
				setChanged(false)
			})
			.catch((err) => {
				alertContext.addAlert({
					type: "error", label: errorToString(err, "Error updating user")
				})
			})
	}

	const sendVerificationEmailRequest = useSendVerificationEmailRequest()
	
	const [ timeLeft, setTimeLeft ] = useState(0)

	useEffect(() => {
		if (!sendVerificationEmailRequest.fetchedAt) return;
		setTimeLeft(60)
		let interval = setInterval(() => {
			if (timeLeft - 1 === 0) clearInterval(interval)
			setTimeLeft((timeLeft) => Math.max(timeLeft - 1, 0))
		}, 1000)
		return () => clearInterval(interval)
	}, [sendVerificationEmailRequest.fetchedAt])

	return (
		<Card className="profile-card">
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
					<Input
						disabled
						icon={authContext.user?.is_email_verified === false ? UnverifiedIcon : VerifiedIcon}
						value={authContext.user?.is_email_verified === false ? "Email not verified" : "Email is verified"}
						placeholder="Verified"
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
						className="mt-4 rounded-md"
						disabled={!changed}
						loading={editUserRequest.fetching}
						
						style={{background: '#158FFF', color: 'white'}}
					>
						Updated Profile
					</Button>
				</Form>
				
			</CardBody>
		</Card>
	)
}

export default AccountPage