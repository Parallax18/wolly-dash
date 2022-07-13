import type { Component } from "../../types/Util"
import Card, { CardBody, CardTitle } from "../Card"
import "./Sidebar.css"

import DashboardIcon from "../../svg/icons/dashboard-outline.svg"
import AccountIcon from "../../svg/icons/account-circle-outline.svg"
import SettingsIcon from "../../svg/icons/settings-outline.svg"
import LogoutIcon from "../../svg/icons/logout.svg"
import Button from "../Button"
import { Link, NavLink, useLocation } from "react-router-dom"
import { getURL, routeMatchesExact, useGetCurrentProject } from "../../util"
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"

import BuyIcon from "../../svg/icons/shopping-cart.svg"
import TransactionsIcon from "../../svg/icons/payments.svg"
import ReferralsIcon from "../../svg/icons/paid.svg"
import HomeIcon from "../../svg/icons/home.svg"

import { ProjectContext } from "../../context/ProjectContext"
import { StageContext } from "../../context/StageContext"

export interface DisabledArgs {
	presaleEnded: boolean
}

const navList = [
	{label: "Main Site", path: "%MAIN_URL%", icon: HomeIcon},
	{label: "Dashboard", path: "/", icon: DashboardIcon},
	{label: "Account", path: "/account", icon: AccountIcon},
	{label: "Buy", path: "/buy", icon: BuyIcon, disabled: ({ presaleEnded }: DisabledArgs) => presaleEnded},
	{label: "Referrals", path: "/referrals", icon: ReferralsIcon},
]

const bottomList = [
	{label: "Logout", onClick: ({ logout }: {logout: () => void;}) => {
		logout()
	}, icon: LogoutIcon},
]

const Sidebar: Component = () => {
	const { currentProject } = useContext(ProjectContext)
	const { presaleEnded } = useContext(StageContext)
	const authContext = useContext(AuthContext)

	const location = useLocation()

	console.log("ENDED", presaleEnded)

	return (
		<Card className="sidebar">
			<CardTitle center>
				Dashboard
			</CardTitle>
			<CardBody>
				<div className="nav-list list +md:flex-gap-y-2">
					{navList.map((navItem) => {
						const matches = () => routeMatchesExact(navItem.path, location.pathname)
						const path = navItem.path.replace("%MAIN_URL%", getURL(currentProject?.main_site_url || ""))
						return (
							<Button
								key={navItem.label}
								component={path.startsWith("http") ? "a" : NavLink}
								{...(path.startsWith("http") ? {href: path} : {to: path})}
								target={path.startsWith("http") ? "_blank" : undefined}
								textColor={matches() ? "default" : "secondary"}
								color={matches() ? "primary" : "transparent"}
								className="!justify-start"
								icon={navItem.icon}
								disabled={navItem.disabled !== undefined && navItem.disabled({ presaleEnded })}
							>
								{navItem.label}
							</Button>
						)
					})}
				</div>
				<div className="separator">
					<div className="divider" />
				</div>
				<div className="bottom-list list +md:flex-gap-y-2">
					{bottomList.map((navItem) => (
						<Button
							key={navItem.label}
							color="transparent"
							className="!justify-start"
							icon={navItem.icon}
							onClick={() => navItem.onClick?.({ logout: authContext.logout })}
						>
							{navItem.label}
						</Button>
					))}
				</div>
			</CardBody>
		</Card>
	)
}

export default Sidebar