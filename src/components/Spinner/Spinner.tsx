import clsx from "clsx"
import React from "react"

import "./Spinner.css"

export interface SpinnerProps {
	className?: string,
	size?: number,
	color?: "primary" | "contrast"
}

const Spinner: React.FC<SpinnerProps> = ({ size = 16, className, color = "primary" }) => {
	return (
		<div className={clsx("spinner-container", className, color)} style={{width: `${size/4}rem`, height: `${size/4}rem`}}>
			<svg
				className="spinner"
				viewBox="0 0 66 66"
				style={{width: "100%", height: "100%"}}
			>
				<circle
					cx="33" cy="33" r="30"
					fill="none" strokeWidth="6"
					strokeLinecap="round"
				></circle>
			</svg>
		</div>
	)
}

export default Spinner