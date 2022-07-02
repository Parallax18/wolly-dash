import { AxiosResponse } from "axios"
import React, { createContext, useEffect, useState } from "react"
import { PricesResponse } from "../types/Api"
import { Component } from "../types/Util"
import { CreateRequestResponse, useGetPrices } from "../util"

export const PriceContext = createContext<PriceContextData>({
	prices: {},
	refreshPrices: () => Promise.reject(),
	priceRequest: {} as CreateRequestResponse<PricesResponse, () => Promise<AxiosResponse<PricesResponse>>>
})

export interface PriceContextData {
	prices: PricesResponse
	refreshPrices: () => Promise<PricesResponse>
	priceRequest: CreateRequestResponse<
		PricesResponse,
		() => Promise<AxiosResponse<PricesResponse>>
	>
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
		refreshPrices,
		priceRequest
	}

	return (
		<PriceContext.Provider value={PriceData}>
			{children}
		</PriceContext.Provider>
	)
}