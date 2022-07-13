import React, { createContext, useContext, useEffect, useState } from "react"
import { ComponentType } from "../types/Util"
import { GetPromotionImagesRequest, useGetPromotionImages } from "../util"
import { AuthContext } from "./AuthContext"

export const PromotionContext = createContext<PromotionContextData>({} as PromotionContextData)

export interface PromotionContextData {
	promotionImages: Record<string, string>,
	getPromotionImagesRequest: GetPromotionImagesRequest
}

export const PromotionContextWrapper: ComponentType = ({ children }) => {
	const { user, loggedIn } = useContext(AuthContext)
	const [ promotionImages, setPromotionImages ] = useState<Record<string, string>>({})

	const getPromotionImagesRequest = useGetPromotionImages()

	useEffect(() => {
		if (!user?.id || !loggedIn || getPromotionImagesRequest.fetchedAt) return;
		getPromotionImagesRequest.sendRequest()
			.then((res) => {
				setPromotionImages(res.data)
			})
	}, [user, loggedIn, getPromotionImagesRequest.fetchedAt])

	const PromotionData: PromotionContextData = {
		getPromotionImagesRequest,
		promotionImages
	}

	return (
		<PromotionContext.Provider value={PromotionData}>
			{children}
		</PromotionContext.Provider>
	)
}