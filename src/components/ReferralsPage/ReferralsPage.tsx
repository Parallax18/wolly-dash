import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { ProjectContext } from "../../context/ProjectContext"
import { StageContext } from "../../context/StageContext"
import { Component } from "../../types/Util"
import { formatLargeNumber, formatNumber, generateShareLink, getURL, useGetReferralStats } from "../../util"
import Button from "../Button"
import Card, { CardBody, CardTitle } from "../Card"
import Input from "../Input"
import Page from "../Page"

import "./ReferralsPage.css"

import FacebookIcon from "../../svg/icons/facebook.svg"
import TwitterIcon from "../../svg/icons/twitter.svg"
import TelegramIcon from "../../svg/icons/telegram.svg"
import Dialog from "../Dialog"
import { ReferralContext } from "../../context/ReferralContext"

const ReferralsPage: Component = () => {
	const { activeStage } = useContext(StageContext)
	const { currentProject } = useContext(ProjectContext)
	const { user } = useContext(AuthContext)

	const [ modalOpen, setModalOpen ] = useState(false)

	const shareText = `Use my referral link to get $${activeStage?.bonuses.referrals.earn}`
	const shareUrl = `${getURL(currentProject?.frontend_url || "")}/register?referral=${user?.id}`

	const earn = activeStage?.bonuses.referrals.earn || 0
	const spend = activeStage?.bonuses.referrals.spend || 0

	return (
		<Page path="/referrals" title="Referrals">
			<div className="referrals-page flex-gap-y-4">
				<ReferralInfoCard
					shareText={shareText}
					shareUrl={shareUrl}
					onHowToClick={() => setModalOpen(true)}
					earn={earn}
					spend={spend}
				/>
				<ReferralStatsCard />
				<ReferralHowToDialog
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					earn={earn}
					spend={spend}
				/>
			</div>
		</Page>
	)
}

export default ReferralsPage

export const ReferralInfoCard: Component<{
	onHowToClick?: () => void
	earn: number,
	spend: number,
	shareUrl: string,
	shareText: string
}> = (props) => {
	return (
		<Card className="referrals-card">
			<CardBody className="flex flex-col flex-gap-y-4">
				<div className="referrals-description flex-gap-y-1">
					<h1>Refer & Earn Rewards</h1>
					<p>Earn ${props.earn} per referral when they spend ${props.spend} or more</p>
					<Button
						color="primary"
						compact
						buttonStyle="transparent"
						onClick={props.onHowToClick}
					>
						How it Works?
					</Button>
				</div>
				<Input
					value={props.shareUrl}
					copyable
				/>
				<div className="referral-share-buttons gap-2">
					<Button
						compact
						color="bg-light"
						icon={FacebookIcon}
						component="a"
						target="_blank"
						href={generateShareLink("facebook", props.shareText, props.shareUrl)}
					>Share</Button>
					<Button
						compact
						color="bg-light"
						icon={TwitterIcon}
						component="a"
						target="_blank"
						href={generateShareLink("twitter", props.shareText, props.shareUrl)}
					>Tweet</Button>
					<Button
						compact
						color="bg-light"
						icon={TelegramIcon}
						href={generateShareLink("telegram", props.shareText, props.shareUrl)}
						target="_blank"
						component="a"
					>Post</Button>
				</div>
			</CardBody>
		</Card>
	)
}

export const ReferralStatsCard: Component = () => {
	const { referralStats } = useContext(ReferralContext)
	const { activeStage } = useContext(StageContext)

	return (
		<Card>
			<CardTitle center>Referred Friends</CardTitle>
			<CardBody className="referral-stats flex-gap-x-4">
				<div className="referral-stat referred">
					<p className="referral-stat-value">{referralStats?.referred}</p>
					<span className="referral-stat-label">Referred</span>
				</div>
				<div className="referral-stat dollar">
					<p className="referral-stat-value">${formatLargeNumber((referralStats?.earned_tokens || 0) * (activeStage?.token_price || 0), 1000, 0, 2)}</p>
					<span className="referral-stat-label">Earned</span>
				</div>
			</CardBody>
		</Card>
	)
}

export const ReferralHowToDialog: Component<{open: boolean, onClose: () => void, earn: number, spend: number}> = (props) => {
	return (
		<Dialog open={props.open} onClose={props.onClose} className="referrals-how-root">
			<Card className="referrals-how-container">
				<CardTitle>
					How it Works
				</CardTitle>
				<CardBody className="referrals-how flex-gap-y-8">
					{[
						{title: "Share Link", desc: "Share your unique referral link with friends and have them sign up through it"},
						{title: "Top Up", desc: `Once a friend registers, they should buy $${props.spend}`},
						{title: "Earn $", desc: `Both you and your friend will earn $${props.earn}`},
					].map((item, i) => (
						<div className="referrals-how-step" key={i}>
							<span className="step-num">{i+1}</span>
							<div className="step-text">
								<h2>{item.title}</h2>
								<p>{item.desc}</p>
							</div>
						</div>
					))}
				</CardBody>
			</Card>
		</Dialog>
	)
}