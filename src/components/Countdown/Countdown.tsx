import clsx from "clsx"
import React, { useEffect, useMemo, useState } from "react"
import { Component, ComponentType } from "../../types/Util"
import { capitalize, useInterval } from "../../util"
import { Loadable } from "../Loader"

import "./Countdown.css"

export type TimeKey = "seconds" | "minutes" | "hours" | "days"

export type CountdownProps = React.HTMLAttributes<HTMLDivElement> & {
	component?: ComponentType,
	timeKeys?: TimeKey[],
	endDate: Date,
	onCountdownFinish?: () => void;
	[key: string]: any
}

const divisorMap = {
	days: 1000 * 60 * 60 * 24,
	hours: 1000 * 60 * 60,
	minutes: 1000 * 60,
	seconds: 1000,
}

const divisorMapEntries = Object.entries(divisorMap)

const getTimeValue = (diff: number, key: TimeKey) => {

	for (let i = 0; i < divisorMapEntries.length; i++) {
		let [ currentKey, divisor ] = divisorMapEntries[i]

		if (currentKey === key) {
			return Math.floor(diff / divisor)
		};

		diff = diff - (Math.floor(diff / divisor) * divisor);
	}
	return Math.floor(diff)
}

const Countdown: Component<CountdownProps> = ({
	timeKeys = ["seconds", "minutes", "hours", "days"],
	component, endDate, onCountdownFinish, ...others
}) => {
	const [ render, setRender ] = useState(false)
	const Comp = component || "div"

	useInterval(() => {
		setRender((rnd) => !rnd)
	}, 1000)
	
	const diff = Math.max(endDate.getTime() - Date.now(), 0)

	useEffect(() => {
		if (Math.max(endDate.getTime() - Date.now()) < 0) onCountdownFinish?.()
	}, [render])

	const keys = useMemo(() => {
		return timeKeys.sort((a, b) => divisorMap[b] - divisorMap[a])
	}, [timeKeys])

	return (
		<Comp
			{...others}
			className={clsx("countdown-container", others.className)}
		>
			{keys.map((key) => (
				<div className="countdown-item" key={key}>
					<span className="countdown-item-label">
						{capitalize(key)}
					</span>
					<Loadable component="span" className="countdown-item-value">
						{getTimeValue(diff, key)}
					</Loadable>
				</div>
			))}
		</Comp>
	)
}

export default Countdown