import React, { createContext } from "react"
import themes from "../styles/themes"
import baseTheme from "../styles/themes/baseTheme"
import { useLocalState } from "../util"

import { Component } from "../types/Util"

export const ThemeContext = createContext<ThemeContextData>({
	theme: baseTheme,
	setTheme: () => {}
})

export interface ThemeContextData {
	theme: Record<string, any>,
	setTheme: (themeKey: string) => void,
}

export const ThemeContextWrapper: Component = ({ children }) => {
	const [ themeKey, setThemeKey ] = useLocalState<string>("dark", "theme")

	const ThemeData: ThemeContextData = {
		theme: themes[themeKey],
		setTheme: setThemeKey
	}

	return (
		<ThemeContext.Provider value={ThemeData}>
			{children}
		</ThemeContext.Provider>
	)
}