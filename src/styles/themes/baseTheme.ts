const getShadowCol = (opacity: number) => {
	return `rgba(0,0,0,${opacity})`;
};

const baseTheme: Record<string, any> = {
	key: "base",
	label: "Base",
	radius: {
		paper: 4,
		button: 8,
		item: 8,
		card: 8,
		input: 8
	},
	breakpoints: {
		"xs": {max: "639px"},
		'sm': '640px',
		'md': '768px',
		'lg': '1024px',
		'xl': '1280px',
		'2xl': '1536px',	
	},
	accent: {
		light: "#d46c6e",
		main: "#b84648",
		// main: "#43A047",
		dark: "#b33235",
		contrastText: "#fff"
	},
	primary: {
		light: "#158FFF",
		main: "#158FFF",
		dark: "158FFF",
		contrastText: "#000",
	},
	secondary: {
		light: "#7c43bd",
		main: "#4a148c",
		dark: "#12005e",
		contrastText: "#fff"
	},
	anim: {
		short: 100,
		norm: 150,
		long: 300,
		spinner: 1200,
		spinnerEase: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
		ease: "ease-out",
	},
	text: {
		primary: "#fff",
		secondary: "#c0c0c0",
		muted: "#aaa",
		hint: "#bbb"
	},
	font: {
		primary: "Poppins, Arial, sans-serif",
		navbar: "Ubuntu, Roboto, Arial, sans-serif",
		display: "Oxygen, Roboto, Arial, sans-serif",
		size: 16
	},
	link: {
		color: "#a4c7e5"
	},
	zindex: {
		navbar: 10000,
		dialog: 11000,
		snackbar: 12000,
		tooltip: 13000
	},
	money: "#00aa00",
	favourite: "#f6b702",
	divider: "rgba(255, 255, 255, 0.12)",
	background: {
		paperHighlight: "#484c52",
		paperLight: "#393c40",
		paper: "#292B30",
		paperDark: "#212226",
		navbar: "#000",
		contrast: "#1A1D22",
		default: "#1a1d22",
		overlay: "rgba(0,0,0,0.65)"
	},
	success: {
		contrastText: "#ffffff",
		light: "#6fbf73",
		main: "#43a047",
		dark: "#357a38"
	},
	error: {
		contrastText: "#ffffff",
		light: "#ff6666",
		main: "#ff4444",
		dark: "#bb4444",
	},
	info: {
		contrastText: "#ffffff",
		light: "#4791db",
		main: "#1976d2",
		dark: "#115293"
	},
	warning: {
		contrastText: "#000",
		light: "#ffb333",
		main: "#ffa000",
		dark: "#b27000",
	},
	action: {
		disabled: "#666",
		unselected: "#45484C",
		ripple: "rgba(255,255,255,0.15)",
		hover: "rgba(255,255,255, 0.1)",
		hoverBackground: "rgba(255,255,255,0.8)",
		loading: "rgba(255,255,255,0.15)",
		loadingTo: "rgba(255,255,255,0.2)"
	},
	border: {
		main: "rgba(255,255,255,0.4)",
		input: "#262626",
		highlight: "#ffffff"
	},
	shadows: [
		"none",
		[`0px 2px 1px -1px ${getShadowCol(0.2)}`, `0px 1px 1px 0px ${getShadowCol(0.14)}`, `0px 1px 3px 0px ${getShadowCol(0.12)}`],
		[`0px 2px 1px -1px ${getShadowCol(0.2)}`, `0px 1px 1px 0px ${getShadowCol(0.14)}`, `0px 1px 3px 0px ${getShadowCol(0.12)}`],
		[`0px 3px 1px -2px ${getShadowCol(0.2)}`, `0px 2px 2px 0px ${getShadowCol(0.14)}`, `0px 1px 5px 0px ${getShadowCol(0.12)}`],
		[`0px 3px 3px -2px ${getShadowCol(0.2)}`, `0px 3px 4px 0px ${getShadowCol(0.14)}`, `0px 1px 8px 0px ${getShadowCol(0.12)}`],
		[`0px 2px 4px -1px ${getShadowCol(0.2)}`, `0px 4px 5px 0px ${getShadowCol(0.14)}`, `0px 1px 10px 0px ${getShadowCol(0.12)}`],
		[`0px 3px 5px -1px ${getShadowCol(0.2)}`, `0px 5px 8px 0px ${getShadowCol(0.14)}`, `0px 1px 14px 0px ${getShadowCol(0.12)}`],
		[`0px 3px 5px -1px ${getShadowCol(0.2)}`, `0px 6px 10px 0px ${getShadowCol(0.14)}`, `0px 1px 18px 0px ${getShadowCol(0.12)}`],
		[`0px 4px 5px -2px ${getShadowCol(0.2)}`, `0px 7px 10px 1px ${getShadowCol(0.14)}`, `0px 2px 16px 1px ${getShadowCol(0.12)}`],
		[`0px 5px 5px -3px ${getShadowCol(0.2)}`, `0px 8px 10px 1px ${getShadowCol(0.14)}`, `0px 3px 14px 2px ${getShadowCol(0.12)}`],
		[`0px 5px 6px -3px ${getShadowCol(0.2)}`, `0px 9px 12px 1px ${getShadowCol(0.14)}`, `0px 3px 16px 2px ${getShadowCol(0.12)}`],
		[`0px 6px 6px -3px ${getShadowCol(0.2)}`, `0px 10px 14px 1px ${getShadowCol(0.14)}`, `0px 4px 18px 3px ${getShadowCol(0.12)}`],
	]
}

export default baseTheme;