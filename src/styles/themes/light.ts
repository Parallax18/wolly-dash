import { createTheme } from "../../util";

const light = createTheme({
	key: "light",
	label: "Light",
	type: "light",
	text: {
		primary: "#000",
		secondary: "#444",
		muted: "#222"
	},
	background: {
		paperLight: "#d7d7d7",
		paper: "#fff",
		paperDark: "#ccc",
		navbar: "#fff",
		contrast: "#fff",
		default: "#fff",
	},
	action: {
		hover: "rgba(0,0,0,0.1)"
	}
});

export default light;
