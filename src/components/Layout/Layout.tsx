import React, { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import CSSBaseline from "../../styles/CSSBaseline"
import { Component } from "../../types/Util"
import Alerts from "../Alerts"
import Sidebar from "../Sidebar"

import clsx from "clsx"

import "./Layout.css"
import { StageContext } from "../../context/StageContext"
import { getTimeLeftLimitedSignupBonus, getTimeString, limitedSignupBonusValid } from "../../util"
import Banner from "../Banner"

const Layout: Component = ({ children }) => {
	const { loggedIn, user } = useContext(AuthContext)
	const { activeStage } = useContext(StageContext)

	let bannerText = "";
	let signupLimitedBonus = activeStage?.bonuses.signup?.limited_time
	let limitedBonus = activeStage?.bonuses.limited_time
	let limitedDiff = new Date(limitedBonus?.end_date || "").getTime() - Date.now()
	
	if (signupLimitedBonus && limitedSignupBonusValid(user?.signup_date, signupLimitedBonus)) bannerText = `Limited signup bonus available. +${signupLimitedBonus.percentage}% bonus if you purchase within ${getTimeString(getTimeLeftLimitedSignupBonus(user?.signup_date, signupLimitedBonus))}`
	else if (limitedDiff && limitedDiff > 0) bannerText = `Limited time bonus available. +${limitedBonus?.percentage}% bonus if you purchase within ${getTimeString(limitedDiff)}`

	return (
		<>
			<CSSBaseline />
			<Alerts />
			{loggedIn && (
				<Sidebar />
			)}
			{bannerText && <Banner>{bannerText}</Banner>}
			<div className={clsx("page-container", {"logged-in": loggedIn})}>
				{children}
			</div>
		</>
	)
}

export default Layout