import React from "react"
import { Component } from "../../types/Util"

import "./Banner.css"

const Banner: Component = ({ children }) => {
	return (
		<div className="banner">
			{children}
		</div>
	)
}

export default Banner