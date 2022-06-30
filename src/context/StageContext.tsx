import React, { createContext, useContext, useEffect, useState } from "react"
import { Stage } from "../types/Api"
import { Component } from "../types/Util"
import { useGetActiveStages } from "../util"

export const StageContext = createContext<StageContextData>({})

export interface StageContextData {
	activeStage?: Stage
}

export const StageContextWrapper: Component = ({ children }) => {
	const [ activeStage, setActiveStage ] = useState<Stage | undefined>(undefined)

	const stageRequest = useGetActiveStages()

	const StageData: StageContextData = {
		activeStage
	}

	useEffect(() => {
		stageRequest.sendRequest().then((res) => {
			setActiveStage(res.data)
		});
	}, [])

	return (
		<StageContext.Provider value={StageData}>
			{children}
		</StageContext.Provider>
	)
}