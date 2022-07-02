import { useContext } from "react"
import Card, { CardBody, CardGroup, CardTitle } from "../../components/Card"
import Chip from "../../components/Chip"
import { Loader } from "../../components/Loader"
import Page from "../../components/Page"
import { AuthContext } from "../../context/AuthContext"
import { ProjectContext } from "../../context/ProjectContext"
import { StageContext } from "../../context/StageContext"
import { Component } from "../../types/Util"
import { capitalize, formatLargeNumber, formatNumber, roundToDP } from "../../util"
import "./DashboardPage.css"

const DashboardPage: Component = () => {
	const { currentProject, currProjectRequest } = useContext(ProjectContext)
	const { activeStage, activeStageRequest } = useContext(StageContext)
	const { user, userRequest } = useContext(AuthContext)

	const cardPadding = 1.5

	return (
		<Page title="Dashboard" path="/" userRestricted>
			<div className="dashboard-page gap-4">
				<Loader loading={currProjectRequest.fetching || activeStageRequest.fetching || userRequest.fetching}>
					<CardGroup className="flex-gap-x-4">
						<Card className="dashboard-card" padding={cardPadding}>
							<div className="card-header">
								Token Balance
							</div>
							<CardBody>
								<span>{formatLargeNumber(user?.tokens?.total || 0)} {currentProject?.symbol}</span>
								<span>${formatLargeNumber((user?.tokens?.total || 0) * (activeStage?.token_price || 0))}</span>
							</CardBody>
						</Card>
						<Card className="dashboard-card" padding={cardPadding}>
							<div className="card-header">
								{activeStage?.name}
								<Chip compact>
									{capitalize(activeStage?.type || "")}
								</Chip>
							</div>
							<CardBody>
								<span>1 {currentProject?.symbol} = ${formatNumber(activeStage?.token_price || 0)}</span>
								<span>{formatLargeNumber(activeStage?.total_tokens || 0)} Total Tokens</span>
							</CardBody>
						</Card>
					</CardGroup>
				</Loader>
			</div>
		</Page>
	)
}

export default DashboardPage