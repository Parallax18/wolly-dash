import React, { createContext, useContext, useEffect, useState } from "react"
import { Stage } from "../types/Api"
import { Component } from "../types/Util"
import { GetActiveStageRequest, useGetActiveStages } from "../util"

export const StageContext = createContext<StageContextData>({} as StageContextData)

export interface StageContextData {
	activeStage?: Stage,
	activeStageRequest: GetActiveStageRequest,
	presaleEnded: boolean
}

export const StageContextWrapper: Component = ({ children }) => {
	const [ activeStage, setActiveStage ] = useState<Stage | undefined>(undefined)
	const [ presaleEnded, setPresaleEnded ] = useState(false)

	const activeStageRequest = useGetActiveStages()

	const StageData: StageContextData = {
		activeStage,
		activeStageRequest,
		presaleEnded
	}

	useEffect(() => {
		activeStageRequest.sendRequest()
			.then((res) => {
				setActiveStage(res.data)
			})
			.catch((err) => {
				console.log("ERR", err)
				if (err?.message?.toLowerCase().includes("token sale has ended")) setPresaleEnded(true)
			});
	}, [])

	return (
		<StageContext.Provider value={StageData}>
			{children}
		</StageContext.Provider>
	)
}