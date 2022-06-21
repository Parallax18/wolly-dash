import clsx from "clsx"
import React, { useContext, useEffect, useRef, useState } from "react"
import { AlertContext, AlertData } from "../../context/AlertContext"
import Alert from "../Alert"

import "./Alerts.css"

const Alerts: React.FC = () => {
	const { alerts, removeAlert } = useContext(AlertContext)
	const [ height, setHeight ] = useState(64)
	const alertRef = useRef<HTMLDivElement>()

	const offset = 16;

	useEffect(() => {
		const bounds = alertRef.current?.getBoundingClientRect()
		if (!bounds) return
		setHeight(bounds.height)
	}, [alertRef])

	let shownCount = -1;
	let hiddenCount = 0;

	return (
		<div className="alerts-container">
			{alerts.map((alert: AlertData, i) => {
				if (!alert.hiding) shownCount++;
				else hiddenCount++;

				let bottom = alert.hiding ? (height + offset) * (shownCount + hiddenCount) : (height + offset) * shownCount

				return (
					<Alert
						className={clsx({hiding: alert.hiding})}
						key={alert.id}
						ref={(el: HTMLDivElement) => (i === 0) && (alertRef.current = el)}
						style={{bottom: `${bottom}px`}}
						label={alert.label}
						type={alert.type}
						onClose={() => removeAlert(alert.id)}
						duration={alert.duration}
					/>
				)
			})}
		</div>
	)
}

export default Alerts