import { Component } from "../types/Util";
import { AlertContextWrapper } from "./AlertContext";
import { AuthContextWrapper } from "./AuthContext";
import { ThemeContextWrapper } from "./ThemeContext";

export const GlobalContextWrapper: Component = ({ children }) => {
	return (
		<ThemeContextWrapper>
			<AlertContextWrapper>
				<AuthContextWrapper>
					{children}
				</AuthContextWrapper>
			</AlertContextWrapper>
		</ThemeContextWrapper>
	)
}