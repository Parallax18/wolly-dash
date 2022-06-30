import { Component } from "../types/Util";
import { AlertContextWrapper } from "./AlertContext";
import { AuthContextWrapper } from "./AuthContext";
import { PriceContextWrapper } from "./PriceContext";
import { ProjectContextWrapper } from "./ProjectContext";
import { StageContextWrapper } from "./StageContext";
import { ThemeContextWrapper } from "./ThemeContext";

export const GlobalContextWrapper: Component = ({ children }) => {
	return (
		<ThemeContextWrapper>
			<AlertContextWrapper>
				<AuthContextWrapper>
					<PriceContextWrapper>
						<StageContextWrapper>
							<ProjectContextWrapper>
								{children}
							</ProjectContextWrapper>
						</StageContextWrapper>
					</PriceContextWrapper>
				</AuthContextWrapper>
			</AlertContextWrapper>
		</ThemeContextWrapper>
	)
}