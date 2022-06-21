import React, { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import CSSBaseline from "../../styles/CSSBaseline"
import { Component } from "../../types/Util"
import Alerts from "../Alerts"
import Sidebar from "../Sidebar"

import clsx from "clsx"

import "./Layout.css"

const Layout: Component = ({ children }) => {
	const authContext = useContext(AuthContext)
	return (
		<>
			<CSSBaseline />
			<Alerts />
			{authContext.loggedIn && (
				<Sidebar />
			)}
			<div className={clsx("page-container", {"logged-in": authContext.loggedIn})}>
				{children}
			</div>
		</>
	)
}

export default Layout