import type { Component } from "../../types/Util"
import Card, { CardBody, CardTitle } from "../Card"
import "./Sidebar.css"

import DashboardIcon from "../../svg/icons/dashboard-outline.svg"
import AccountIcon from "../../svg/icons/account-circle-outline.svg"
import SettingsIcon from "../../svg/icons/settings-outline.svg"
import LogoutIcon from "../../svg/icons/logout.svg"
import Button from "../Button"
import { Link, NavLink, useLocation } from "react-router-dom"
import { routeMatchesExact } from "../../util"
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"

import BuyIcon from "../../svg/icons/shopping-cart.svg"
import TransactionsIcon from "../../svg/icons/payments.svg"

const navList = [
	{label: "Dashboard", path: "/", icon: DashboardIcon},
	{label: "Account", path: "/account", icon: AccountIcon},
	{label: "Buy", path: "/buy", icon: BuyIcon},
]

const bottomList = [
	{label: "Logout", onClick: ({ logout }: {logout: () => void;}) => {
		logout()
	}, icon: LogoutIcon},
]

const Sidebar: Component = () => {
	const authContext = useContext(AuthContext)

	const location = useLocation()

	return (
		<Card className="sidebar">
			<CardTitle center>
				Dashboard
			</CardTitle>
			<CardBody>
				<div className="nav-list list +md:flex-gap-y-2">
					{navList.map((navItem) => {
						const matches = () => routeMatchesExact(navItem.path, location.pathname)
						return (
							<Button
								key={navItem.label}
								component={NavLink}
								to={navItem.path}
								textColor={matches() ? "default" : "secondary"}
								color={matches() ? "primary" : "transparent"}
								className="!justify-start"
								icon={navItem.icon}
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