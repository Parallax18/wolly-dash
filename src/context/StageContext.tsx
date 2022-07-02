import React, { createContext, useContext, useEffect, useState } from "react"
import { Stage } from "../types/Api"
import { Component } from "../types/Util"
import { GetActiveStageRequest, useGetActiveStages } from "../util"

export const StageContext = createContext<StageContextData>({} as StageContextData)

export interface StageContextData {
	activeStage?: Stage,
	activeStageRequest: GetActiveStageRequest
}

export const StageContextWrapper: Component = ({ children }) => {
	const [ activeStage, setActiveStage ] = useState<Stage | undefined>(undefined)

	const activeStageRequest = useGetActiveStages()

	const StageData: StageContextData = {
		activeStage,
		activeStageRequest
	}

	useEffect(() => {
		activeStageRequest.sendRequest().then((res) => {
			setActiveStage(res.data)
		});
	}, [])

	return (
		<StageContext.Provider value={StageData}>
			{children}
		</StageContext.Provider>
	)
}