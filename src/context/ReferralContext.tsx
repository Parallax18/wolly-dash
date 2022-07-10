import React, { createContext, useContext, useEffect, useState } from "react"
import { ReferralStatsResponse } from "../types/Api"
import { Component } from "../types/Util"
import { GetReferralStatsRequest, useGetReferralStats } from "../util"
import { AuthContext } from "./AuthContext"

export const ReferralContext = createContext<ReferralContextData>({} as ReferralContextData)

export interface ReferralContextData {
	referralStats: ReferralStatsResponse | undefined,
	getReferralStatsRequest: GetReferralStatsRequest
}

export const ReferralContextWrapper: Component = ({ children }) => {
	const { loggedIn, user } = useContext(AuthContext)
	const [ referralStats, setReferralStats ] = useState<ReferralStatsResponse>()
	const getReferralStatsRequest = useGetReferralStats();

	useEffect(() => {
		if (!loggedIn || !user || (getReferralStatsRequest.fetchedAt && getReferralStatsRequest.requestData?.userId === user.id)) return;
		getReferralStatsRequest.sendRequest(user.id).then((res) => {
			setReferralStats(res.data)
		})
	}, [loggedIn, user])

	const ReferralData: ReferralContextData = {
		referralStats,
		getReferralStatsRequest
	}

	return (
		<ReferralContext.Provider value={ReferralData}>
			{children}
		</ReferralContext.Provider>
	)
}