import React, { createContext, useEffect, useState } from "react"
import { Project } from "../types/Api"
import { Component } from "../types/Util"
import { useGetCurrentProject } from "../util"

export const ProjectContext = createContext<ProjectContextData>({})

export interface ProjectContextData {
	currentProject: Project | undefined
}

export const ProjectContextWrapper: Component = ({ children }) => {
	const currProjectRequest = useGetCurrentProject()
	const [ currentProject, setCurrentProject ] = useState<Project | undefined>()

	useEffect(() => {
		currProjectRequest.sendRequest().then((res) => setCurrentProject(res.data))
	}, [])

	const ProjectData: ProjectContextData = {
		currentProject
	}

	return (
		<ProjectContext.Provider value={ProjectData}>
			{children}
		</ProjectContext.Provider>
	)
}