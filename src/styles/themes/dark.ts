import { createTheme } from "../../util";

const dark = createTheme({
  key: "dark",
  label: "Dark",
  text: {
    primary: "#eee",
    secondary: "#c0c0c0"
  },
	background: {
		paperLight: "#202020",
		paper: "#161616",
		paperDark: "#121212",
		navbar: "#000",
		contrast: "#161616",
		default: "#101010",
	}
});

export default dark;
