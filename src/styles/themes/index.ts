import dark from "./dark";
import blue from "./blue"
import { Theme } from "./baseTheme";
import light from "./light";

const themeArr = [dark, blue, /*light*/]

let themes: Record<string, Theme> = {}
themeArr.forEach((theme) => {
	themes[theme.key] = theme
})

export default themes;
