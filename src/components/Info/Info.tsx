import React from "react"
import { Component } from "../../types/Util"

import "./Info.css"

export interface InfoProps {}

const Info: Component<InfoProps> = (props) => {

	return (
		<span className="info">
			<span>i</span>
			<div className="info-tooltip">
				{props.children}
			</div>
		</span>
	)
}

export default Info