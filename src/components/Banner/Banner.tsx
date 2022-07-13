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
	const { activeStage, presaleEnded } = useContext(StageContext)

	const getBanners = () => {
		 let banners = getBonusBanners(activeStage?.bonuses, user?.signup_date)
		 if (presaleEnded) {
			 banners.push({
				 label: "Presale has ended",
				 key: "presale-ended",
				 closable: false
			 })
		 }
		 return banners;
	}

	const [ bannerOpens, setBannerOpens ] = useLocalState<Record<string, {open: boolean, closedAt: string}>>({}, "banners")
	const [ banners, setBanners ] = useState(getBanners())

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
		if ((!activeStage?.bonuses || !user?.signup_date) && !presaleEnded) return;
		setBanners(getBanners())
	}, [activeStage?.bonuses, user?.signup_date, presaleEnded])

	useInterval(() => {
		setBanners(getBanners())
	}, 1000)

	return (
		<div className="banners-container">
			<div className="fixed-banner-wrapper">
				{banners.map((banner, i) => (
					<Banner
						closable={banner.closable}
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
			<div className="banner-hidden-clearfix">
				{banners.map((banner, i) => (
					<Banner
						key={banner.key}
						closable={banner.closable}
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
		</div>
	)
}

export const Banner: Component<{onClose: () => void, open: boolean, closable?: boolean}> = ({ children, open, onClose, closable = true }) => {
	return (
		<div className={clsx("banner", {open})}>
			{children}
			{closable && (
				<IconButton className="close-button" onClick={() => onClose()}>
					<CloseIcon />
				</IconButton>
			)}
		</div>
	)
}