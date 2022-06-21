import React, { useContext, useMemo } from "react"
import { ThemeContext } from "../../context/ThemeContext"
import { getThemeStyleCSS, useEventListener } from "../../util"

import "../css/index.css"
import "../css/util.css"

const CSSBaseline: React.FC = () => {
	const { theme } = useContext(ThemeContext)

	const themeStyle = useMemo(() => {
		return getThemeStyleCSS(theme)
	}, [theme]);
	const addScreenVariables = () => {
		const vh = window.innerHeight / 100;
		document.documentElement.style.setProperty("--vh", `${vh}px`)
		document.documentElement.style.setProperty("--screen-height", `${vh*100}px`)
	}

	addScreenVariables();
	useEventListener(window, "resize", addScreenVariables)
	useEventListener(window, "scroll", () => {
		document.body.classList.remove("scrolled")
		if (window.scrollY > 0) document.body.classList.add("scrolled")
	})

	return (
		<style>
			{themeStyle}
		</style>
	)
}

export default CSSBaseline