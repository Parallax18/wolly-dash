import { AxiosResponse } from "axios"
import React, { createContext, useContext, useEffect, useState } from "react"
import { FinalPriceResponse, PricesResponse } from "../types/Api"
import { Component } from "../types/Util"
import { CreateRequestResponse, useGetFinalPrice, useGetPrices } from "../util"
import { StageContext } from "./StageContext"

export const PriceContext = createContext<PriceContextData>({
	prices: {},
	refreshPrices: () => Promise.reject(),
	priceRequest: {} as CreateRequestResponse<PricesResponse, () => Promise<AxiosResponse<PricesResponse>>>,
	finalPriceRequest: {} as CreateRequestResponse<FinalPriceResponse, () => Promise<AxiosResponse<FinalPriceResponse>>>,
	finalPrice: 0,
	getFinalPrice: () => {}
})

export interface PriceContextData {
	prices: PricesResponse
	refreshPrices: () => Promise<PricesResponse>
	priceRequest: CreateRequestResponse<
		PricesResponse,
		() => Promise<AxiosResponse<PricesResponse>>
	>,
	finalPriceRequest: CreateRequestResponse<
		FinalPriceResponse,
		() => Promise<AxiosResponse<FinalPriceResponse>>
	>,
	finalPrice: number,
	getFinalPrice: () => void;
}

export const PriceContextWrapper: Component = ({ children }) => {
	const { presaleEnded } = useContext(StageContext)
	const [ prices, setPrices ] = useState<PricesResponse>({})
	const [ finalPrice, setFinalPrice ] = useState(0)

	const priceRequest = useGetPrices()
	const finalPriceRequest = useGetFinalPrice()

	useEffect(() => {
		console.log("GETTING FINAL PRICE")
		getFinalPrice()
	}, [presaleEnded])

	const refreshPrices = async (): Promise<PricesResponse> => {
		let res = await priceRequest.sendRequest()
		setPrices(res.data)
		return res.data;
	}

	const getFinalPrice = async () => {
		let res = await finalPriceRequest.sendRequest()
		setFinalPrice(res.data.final_price)
	}

	const PriceData: PriceContextData = {
		prices: prices,
		refreshPrices,
		priceRequest,
		finalPriceRequest,
		finalPrice,
		getFinalPrice
	}

	return (
		<PriceContext.Provider value={PriceData}>
			{children}
		</PriceContext.Provider>
	)
}