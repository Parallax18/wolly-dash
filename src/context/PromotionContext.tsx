import React, { createContext, useContext, useEffect, useState } from "react"
import { PromotionImageResponse } from "../types/Api"
import { ComponentType } from "../types/Util"
import { GetPromotionImagesRequest, useGetPromotionImages } from "../util"
import { AuthContext } from "./AuthContext"

export const PromotionContext = createContext<PromotionContextData>({} as PromotionContextData)

export interface PromotionContextData {
	promotionImages: PromotionImageResponse,
	getPromotionImagesRequest: GetPromotionImagesRequest,
	getPromotionImages: () => void;
}

export const PromotionContextWrapper: ComponentType = ({ children }) => {
	const { user, loggedIn } = useContext(AuthContext)
	const [ promotionImages, setPromotionImages ] = useState<PromotionImageResponse>({})

	const getPromotionImagesRequest = useGetPromotionImages()

	const getPromotionImages = () => {
		if (!user?.id || !loggedIn || getPromotionImagesRequest.fetchedAt) return;
		getPromotionImagesRequest.sendRequest()
			.then((res) => {
				setPromotionImages(res.data)
			})		
	}

	useEffect(() => {
		getPromotionImages()
	}, [user, loggedIn, getPromotionImagesRequest.fetchedAt])

	const PromotionData: PromotionContextData = {
		getPromotionImagesRequest,
		getPromotionImages,
		promotionImages
	}

	return (
		<PromotionContext.Provider value={PromotionData}>
			{children}
		</PromotionContext.Provider>
	)
}