import type { Component, ComponentType } from "../../types/Util"
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
import React, { useContext } from "react"

import BuyIcon from "../../svg/icons/shopping-cart.svg"
import TransactionsIcon from "../../svg/icons/payments.svg"
import ReferralsIcon from "../../svg/icons/paid.svg"
import HomeIcon from "../../svg/icons/home.svg"
import PromotionsIcon from "../../svg/icons/offer.svg"

import { ProjectContext } from "../../context/ProjectContext"
import { StageContext } from "../../context/StageContext"
import { PromotionContext } from "../../context/PromotionContext"
import { PromotionImageResponse } from "../../types/Api"

interface Args {
	presaleEnded: boolean,
	promotionsFetching: boolean,
	promotionImages: PromotionImageResponse
}

const navList: {
	label: string,
	path: string,
	icon: ComponentType,
	disabled?: (args: Args) => boolean,
	visible?: (args: Args) => boolean
}[] = [
	{label: "Main Site", path: "%MAIN_URL%", icon: HomeIcon},
	{label: "Dashboard", path: "/", icon: DashboardIcon},
	{label: "Profile", path: "/account", icon: AccountIcon},
	{label: "Buy", path: "/buy", icon: BuyIcon, disabled: ({ presaleEnded }) => presaleEnded},
	{label: "Referrals", path: "/referrals", icon: ReferralsIcon},
	{label: "Promotions", path: "/promotions", icon: PromotionsIcon, visible: ({ promotionsFetching, promotionImages }) => !promotionsFetching && Object.entries(promotionImages).length > 0},
]

const bottomList = [
	{label: "Logout", onClick: ({ logout }: {logout: () => void;}) => {
		logout()
	}, icon: LogoutIcon},
]

const Sidebar: Component = () => {
	const { currentProject } = useContext(ProjectContext)
	const { presaleEnded } = useContext(StageContext)
	const { getPromotionImagesRequest, promotionImages } = useContext(PromotionContext)
	const authContext = useContext(AuthContext)

	const location = useLocation()

	return (
		<Card className="sidebar">
			<CardTitle center>
				Dashboard
			</CardTitle>
			<CardBody>
				<div className="nav-list list +md:flex-gap-y-2">
					{navList.map((navItem, i) => {
						const matches = () => routeMatchesExact(navItem.path, location.pathname)
						const path = navItem.path.replace("%MAIN_URL%", getURL(currentProject?.main_site_url || ""))
						const args: Args = { presaleEnded, promotionImages, promotionsFetching: getPromotionImagesRequest.fetching }
						if (navItem.visible !== undefined && !navItem.visible(args)) return <React.Fragment key={navItem.label}></React.Fragment>
						return (
							<Button
								key={navItem.label}
								component={path.startsWith("http") ? "a" : NavLink}
								{...(path.startsWith("http") ? {href: path} : {to: path})}
								target={path.startsWith("http") ? "_blank" : undefined}
								// textColor={matches() ? "default" : "black"}
								color={matches() ? "" : "transparent"}
								className="!justify-start text-sm"
								icon={navItem.icon}
								disabled={navItem.disabled !== undefined && navItem.disabled(args)}
								style={{color: matches()?'#B65BFF':'#FEF5ED'}}
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
					{bottomList.map((navItem, i) => (
						<Button
							key={navItem.label}
							color="transparent"
							className="!justify-start text-sm"
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