import React, { createContext, useEffect, useState } from "react"
import { PricesResponse } from "../types/Api"
import { Component } from "../types/Util"
import { useGetPrices } from "../util"

export const PriceContext = createContext<PriceContextData>({
	prices: {},
	refreshPrices: () => Promise.reject()
})

export interface PriceContextData {
	prices: PricesResponse
	refreshPrices: () => Promise<PricesResponse>
}

export const PriceContextWrapper: Component = ({ children }) => {
	const [ prices, setPrices ] = useState<PricesResponse>({})

	const priceRequest = useGetPrices()


	const refreshPrices = async (): Promise<PricesResponse> => {
		let res = await priceRequest.sendRequest()
		setPrices(res.data)
		return res.data;
	}

	const PriceData: PriceContextData = {
		prices: prices,
		refreshPrices
	}

	useEffect(() => {
		refreshPrices()
	}, [])

	return (
		<PriceContext.Provider value={PriceData}>
			{children}
		</PriceContext.Provider>
	)
}