import clsx from "clsx"
import React, { useContext, useEffect, useState } from "react"
import { Component } from "../../types/Util"
import { getBonusBanners, useInterval, useLocalState } from "../../util"
import IconButton from "../IconButton"

import CloseIcon from "../../svg/icons/close.svg"

import "./Banner.css"
import { StageContext } from "../../context/StageContext"
import { AuthContext } from "../../context/AuthContext"

export const Banners: Component = () => {
	const { loggedIn, user } = useContext(AuthContext)
	const { activeStage } = useContext(StageContext)
	
	const [ bannerOpens, setBannerOpens ] = useLocalState<Record<string, {open: boolean, closedAt: string}>>({}, "banners")
	const [ banners, setBanners ] = useState(getBonusBanners(activeStage?.bonuses, user?.signup_date))

	useEffect(() => {
		let newBannerOpens: Record<string, {open: boolean, closedAt: string}> = {}
		Object.entries(bannerOpens).map(([key, value]) => {
			if (Date.now() - new Date(value.closedAt).getTime() > 60 * 60 * 24 * 1000) {
				newBannerOpens[key] = {open: true, closedAt: ""}
			} else {
				newBannerOpens[key] = value
			}
		})
		setBannerOpens(newBannerOpens)
	}, [])

	useEffect(() => {
		if (!activeStage?.bonuses || !user?.signup_date) return;
		setBanners(getBonusBanners(activeStage?.bonuses, user?.signup_date))
	}, [activeStage?.bonuses, user?.signup_date])

	useInterval(() => {
		setBanners(getBonusBanners(activeStage?.bonuses, user?.signup_date))
	}, 60*1000)

	return (
		<div className="banners-container">
			{banners.map((banner) => (
				<Banner
					key={banner.key}
					open={(bannerOpens?.[banner.key]?.open !== null && bannerOpens?.[banner.key]?.open !== undefined) ? bannerOpens?.[banner.key]?.open : true}
					onClose={() => setBannerOpens({
						...bannerOpens,
						[banner.key]: {open: false, closedAt: new Date().toISOString()}
					})}
				>
					{banner.label}
				</Banner>
			))}
		</div>
	)
}

export const Banner: Component<{onClose: () => void, open: boolean}> = ({ children, open, onClose }) => {
	return (
		<div className={clsx("banner", {open})}>
			{children}
			<IconButton className="close-button" onClick={() => onClose()}>
				<CloseIcon />
			</IconButton>
		</div>
	)
}