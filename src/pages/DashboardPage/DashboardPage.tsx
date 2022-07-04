import { useContext } from "react"
import Card, { CardBody, CardGroup, CardTitle } from "../../components/Card"
import Chip from "../../components/Chip"
import Countdown from "../../components/Countdown"
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

	const loading = currProjectRequest.fetching || activeStageRequest.fetching || userRequest.fetching

	return (
		<Page title="Dashboard" path="/" userRestricted>
			<div className="dashboard-page gap-6 <md:gap-2 <sm:!p-4">
				<Loader loading={loading}>
					<div className="flex flex-[2] flex-col flex-gap-y-6">
						<div className="dashboard-card">
							<div className="card-header small">
								Token Balance
							</div>
							<Loadable component="span" className="value large">${formatLargeNumber((user?.tokens?.total || 123123123) * (activeStage?.token_price || 0), 1000, 0, 2)}</Loadable>
							<Loadable component="span" className="value small">{formatLargeNumber(user?.tokens?.total || 123123123)} {currentProject?.symbol}</Loadable>
						</div>
						{(activeStage?.type === "dynamic" || loading) && <PriceChart />}
						<div className="dashboard-card">
							<div className="card-header">
								Recent Transactions
							</div>
							<TransactionList />
						</div>
					</div>
					<div className="flex flex-[1.25] flex-col flex-gap-y-6">
						<div className="dashboard-card">
							<div className="card-header small">
								{activeStage?.name}
							</div>
							<Loadable component="span" className="value large">{currentProject?.symbol} ${formatNumber(activeStage?.token_price || 0)}</Loadable>
							<Loadable component="span" className="value small">{formatLargeNumber(activeStage?.total_tokens || 0)} Tokens</Loadable>
						</div>
						{activeStage?.end_date && (
							<Card className="dashboard-card p-4">
								<div className="card-header small">
									{activeStage?.name} Ends In
								</div>
									<Countdown
										className="mt-2"
										endDate={new Date(activeStage?.end_date)}
									/>
							</Card>
						)}
					</div>
				</Loader>
			</div>
		</Page>
	)
}

export default DashboardPage