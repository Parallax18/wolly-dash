import React, { createContext, useCallback, useState } from "react"
import { Component } from "../types/Util";

export const AlertContext = createContext<AlertContextData>({
	alerts: [],
	addAlert: () => {},
	removeAlert: () => {}
})

export interface AlertData {
	label: string;
	type: "success" | "info" | "warning" | "error";
	duration: number;
	id: number;
	hiding: boolean;
}

export interface AlertArgument {
	label: string;
	type: "success" | "info" | "warning" | "error";
	duration?: number;
}

let alertId = 0;

export interface AlertContextData {
	alerts: AlertData[];
	addAlert: (newAlert: AlertArgument) => void;
	removeAlert: (alertId: number) => void;
}

export const AlertContextWrapper: Component = ({ children }) => {
	const [ alerts, setAlerts ] = useState<AlertData[]>()

	const removeAlert = useCallback((id: number) => {
		let changed = false;
		setAlerts((alerts) => {
			let newAlerts = [...(alerts || [])]
			let foundAlert = newAlerts.find((alert) => alert.id === id)
			if (!foundAlert || foundAlert.hiding) return alerts
			foundAlert.hiding = true
			changed = true
			return newAlerts
		})
		if (changed) setTimeout(() => {
			setAlerts((alerts) => alerts?.filter((alert) => alert.id !== id))
		}, 500)		
	}, [])

	const addAlert = useCallback((newAlert: AlertArgument) => {
		const newId = alertId
		alertId++;
		setAlerts((alerts) => [...(alerts || []), {duration: -1, ...newAlert, id: newId, hiding: false}])
		if (!newAlert.duration || newAlert.duration < 0) return;
		setTimeout(() => {
			removeAlert(newId)
		}, newAlert.duration)
	}, [])

	const AlertData: AlertContextData = {
		alerts: alerts || [],
		addAlert,
		removeAlert
	}

	return (
		<AlertContext.Provider value={AlertData}>
			{children}
		</AlertContext.Provider>
	)
}