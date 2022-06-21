import React, { useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Component } from "../../types/Util"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import website from "../../constants/website"

import "./Page.css"
import { removeTagsFromString } from "../../util"

export type PageProps = {
	path: string,
	title?: string,
	description?: string,
	keywords?: string[],
	userRestricted?: boolean,
	onlyLoggedOut?: boolean
}

const Page: Component<PageProps> = ({
	path, title, description,
	keywords, userRestricted, onlyLoggedOut,
	children
}) => {
	const authStore = useContext(AuthContext)
	const navigate = useNavigate()

	useEffect(() => {
		if (userRestricted && !authStore.loggedIn) return navigate("/login", {replace: true})
		if (onlyLoggedOut && authStore.loggedIn) return navigate("/", {replace: true})
	})

	const canShowContent = (!userRestricted || authStore.loggedIn) && (!onlyLoggedOut || !authStore.loggedIn)

	return (
		<>
			<Helmet>
				<link rel="canonical" href={import.meta.env.APP_HOST_URL + path} />
				<title>{title ? `${title} · ${website.title}` : website.title}</title>
				<meta name="description" content={description ? removeTagsFromString(description) : website.description} />
				<meta name="keywords" content={[...(keywords || []), ...website.keywords].join(",")} />
			</Helmet>
			{canShowContent && children}
		</>
	)
}

export default Page