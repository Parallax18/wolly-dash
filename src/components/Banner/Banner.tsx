import clsx from "clsx"
import React from "react"
import { Component } from "../../types/Util"
import { useLocalState } from "../../util"
import IconButton from "../IconButton"

import CloseIcon from "../../svg/icons/close.svg"

import "./Banner.css"

const Banner: Component = ({ children }) => {
	const [ bannerObj, setBannerObj ] = useLocalState({
		open: true,
		closedAt: 0
	}, "banner")

	return (
		<div className={clsx("banner", {open: bannerObj.open})}>
			{children}
			<IconButton className="close-button" onClick={() => setBannerObj({open: false, closedAt: Date.now()})}>
				<CloseIcon />
			</IconButton>
		</div>
	)
}

export default Banner