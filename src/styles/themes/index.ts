import dark from "./dark";
import blue from "./blue"
import light from "./light";

const themeArr = [dark, blue, /*light*/]

let themes: Record<string, Record<string, any>> = {}
themeArr.forEach((theme) => {
	themes[theme.key] = theme
})

export default themes;
