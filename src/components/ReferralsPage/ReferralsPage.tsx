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
import ShareIcon from "../../svg/icons/share.svg"

import Dialog from "../Dialog"

import { ReferralContext } from "../../context/ReferralContext"
import { Loadable, Loader } from "../Loader"
import clsx from "clsx"

const ReferralsPage: Component = () => {
	const { activeStage, activeStageRequest } = useContext(StageContext)
	const { currentProject, currProjectRequest } = useContext(ProjectContext)
	const { user, userRequest } = useContext(AuthContext)

	const [ modalOpen, setModalOpen ] = useState(false)

	const shareText = `Use my referral link to get $${activeStage?.bonuses?.referrals?.earn}`
	const shareUrl = `${getURL(currentProject?.frontend_url || "")}/register?referral=${user?.id}`

	const earn = activeStage?.bonuses?.referrals?.earn || 0
	const spend = activeStage?.bonuses?.referrals?.spend || 0

	const loading = activeStageRequest.fetching || currProjectRequest.fetching || userRequest.fetching

	return (
		<Page path="/referrals" title="Referrals">
			<div className="referrals-page flex-gap-y-4">
				<ReferralInfoCard
					shareText={shareText}
					shareUrl={shareUrl}
					onHowToClick={() => !loading && setModalOpen(true)}
					earn={earn}
					spend={spend}
					loading={loading}
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
	shareText: string,
	loading?: boolean
}> = (props) => {
	return (
		<Loader loading={!!props.loading}>
			<Card className="referrals-card">
				<CardBody className="flex flex-col flex-gap-y-4">
					<div className="referrals-description flex-gap-y-1">
						<Loadable component="h1">Refer & Earn Rewards</Loadable>
						<Loadable component="p">Earn ${props.earn} per referral when they spend ${props.spend} or more</Loadable>
						<Button
							style={{color: '#8e66de'}}
							compact
							buttonStyle="transparent"
							onClick={props.onHowToClick}
						>
							How it Works?
						</Button>
					</div>
					<Input
						value={props.loading ? "" : props.shareUrl}
						copyable
					>
						<Loadable variant="block" loadClass="w-[calc(100%-4.5rem)] absolute left-4 h-5 top-1/2 -translate-y-1/2" />
					</Input>
					<div className={clsx("referral-share-buttons gap-2", {"can-share": !!navigator.share})}>
						<Button
							compact
							// color="bg-light"
							icon={FacebookIcon}
							component="a"
							target="_blank"
							href={generateShareLink("facebook", props.shareText, props.shareUrl)}
							style={{color: 'white'}}
						>Share</Button>
						<Button
							compact
							// color="bg-light"
							icon={TwitterIcon}
							component="a"
							target="_blank"
							style={{color: 'white'}}
							href={generateShareLink("twitter", props.shareText, props.shareUrl)}
						>Tweet</Button>
						<Button
							compact
							// color="bg-light"
							icon={TelegramIcon}
							href={generateShareLink("telegram", props.shareText, props.shareUrl)}
							target="_blank"
							component="a"
							style={{color: 'white'}}
						>Post</Button>
						<Button
							compact
							color="bg-light"
							icon={ShareIcon}
							onClick={() => {
								if (!navigator.share) return;
								navigator.share({
									url: props.shareUrl,
									text: props.shareText
								})
							}}
						>Share</Button>
					</div>
				</CardBody>
			</Card>
		</Loader>
	)
}

export const ReferralStatsCard: Component = () => {
	const { referralStats, getReferralStatsRequest } = useContext(ReferralContext)
	const { activeStage, activeStageRequest } = useContext(StageContext)

	return (
		<Loader loading={getReferralStatsRequest.fetching || activeStageRequest.fetching}>
			<Card>
				<CardTitle center>Referred Friends</CardTitle>
				<CardBody className="referral-stats flex-gap-x-4">
					<div className=" referred">
						<Loadable length={1} component="p" className="referral-stat-value">{referralStats?.referred}</Loadable>
						<span className="referral-stat-label" style={{color: 'black'}}>Referred</span>
					</div>
					<div className="referral-stat dollar">
						<Loadable length={2} component="p" className="referral-stat-value">${formatLargeNumber((referralStats?.earned_tokens || 0) * (activeStage?.token_price || 0), 1000, 0, 2)}</Loadable>
						<span className="referral-stat-label" style={{color: 'black'}}>Earned</span>
					</div>
				</CardBody>
			</Card>
		</Loader>
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
						{title: "Top Up", desc: `Once a friend registers, have them make a purchase of at least $${props.spend}`},
						{title: "Earn $", desc: `Both you and your friend will earn $${props.earn} in tokens`},
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