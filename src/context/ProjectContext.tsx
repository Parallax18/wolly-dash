import { AxiosResponse } from "axios"
import React, { createContext, useEffect, useMemo, useState } from "react"
import { Project } from "../types/Api"
import { Component } from "../types/Util"
import { apiListToCurrencyList, CreateRequestResponse, CurrencyItem, useGetCurrentProject } from "../util"

export const ProjectContext = createContext<ProjectContextData>({} as ProjectContextData)

export interface ProjectContextData {
	currentProject: Project | undefined,
	currencyTokenList: CurrencyItem[] | undefined,
	currProjectRequest: CreateRequestResponse<Project, () => Promise<AxiosResponse<Project>>> 
}

export const ProjectContextWrapper: Component = ({ children }) => {
	const currProjectRequest = useGetCurrentProject()
	const [ currentProject, setCurrentProject ] = useState<Project | undefined>()

	useEffect(() => {
		currProjectRequest.sendRequest().then((res) => setCurrentProject(res.data))
	}, [])

	const currencyTokenList = useMemo(() => {
		return apiListToCurrencyList(currentProject?.payment_tokens || [])
	}, [currentProject?.payment_tokens])

	const ProjectData: ProjectContextData = {
		currentProject,
		currencyTokenList,
		currProjectRequest
	}

	return (
		<ProjectContext.Provider value={ProjectData}>
			{children}
		</ProjectContext.Provider>
	)
}