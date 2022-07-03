import { useContext } from "react"
import Card, { CardBody, CardGroup, CardTitle } from "../../components/Card"
import Chip from "../../components/Chip"
import { Loadable, Loader } from "../../components/Loader"
import Page from "../../components/Page"
import PriceChart from "../../components/PriceChart"
import TransactionList from "../../components/TransactionList"
import { AuthContext } from "../../context/AuthContext"
import { ProjectContext } from "../../context/ProjectContext"
import { StageContext } from "../../context/StageContext"
import { Component } from "../../types/Util"
import { capitalize, formatLargeNumber, formatNumber, getTimeString, roundToDP } from "../../util"
import "./DashboardPage.css"

const DashboardPage: Component = () => {
	const { currentProject, currProjectRequest } = useContext(ProjectContext)
	const { activeStage, activeStageRequest } = useContext(StageContext)
	const { user, userRequest } = useContext(AuthContext)

	const cardPadding = 1.5

	return (
		<Page title="Dashboard" path="/" userRestricted>
			<div className="dashboard-page gap-6">
				<Loader loading={currProjectRequest.fetching || activeStageRequest.fetching || userRequest.fetching}>
					<div className="flex flex-[2] flex-col flex-gap-y-6">
						<div className="dashboard-card">
							<div className="card-header small">
								Token Balance
							</div>
							<Loadable component="span" className="value large">${formatLargeNumber((user?.tokens?.total || 123123123) * (activeStage?.token_price || 0), 1000, 0, 2)}</Loadable>
							<Loadable component="span" className="value small">{formatLargeNumber(user?.tokens?.total || 123123123)} {currentProject?.symbol}</Loadable>
						</div>
						{activeStage?.type === "dynamic" && <PriceChart />}
						<div className="dashboard-card">
							<div className="card-header">
								Recent Transactions
							</div>
							<TransactionList />
						</div>
					</div>
					<div className="flex flex-1 flex-col flex-gap-y-6">
						<div className="dashboard-card">
							<div className="card-header small">
								{activeStage?.name}
							</div>
							<Loadable component="span" className="value large">{currentProject?.symbol} ${formatNumber(activeStage?.token_price || 0)}</Loadable>
							<Loadable component="span" className="value small">{formatLargeNumber(activeStage?.total_tokens || 0)} Tokens</Loadable>
						</div>
					</div>
				</Loader>
			</div>
		</Page>
	)
}

export default DashboardPage