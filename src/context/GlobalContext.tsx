import { Component } from "../types/Util";
import { AlertContextWrapper } from "./AlertContext";
import { AuthContextWrapper } from "./AuthContext";
import { PriceContextWrapper } from "./PriceContext";
import { ProjectContextWrapper } from "./ProjectContext";
import { StageContextWrapper } from "./StageContext";
import { ThemeContextWrapper } from "./ThemeContext";
import { TransactionsContextWrapper } from "./TransactionsContext";

export const GlobalContextWrapper: Component = ({ children }) => {
	return (
		<ThemeContextWrapper>
			<AlertContextWrapper>
				<StageContextWrapper>
					<ProjectContextWrapper>
						<AuthContextWrapper>
							<TransactionsContextWrapper>
								<PriceContextWrapper>
									{children}
								</PriceContextWrapper>
							</TransactionsContextWrapper>
						</AuthContextWrapper>
					</ProjectContextWrapper>
				</StageContextWrapper>
			</AlertContextWrapper>
		</ThemeContextWrapper>
	)
}