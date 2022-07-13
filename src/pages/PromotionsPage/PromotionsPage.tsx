import React, { useContext } from "react"
import { Loadable, Loader } from "../../components/Loader"
import Page from "../../components/Page"
import { AuthContext } from "../../context/AuthContext"
import { PromotionContext } from "../../context/PromotionContext"
import { Component } from "../../types/Util"

import "./PromotionsPage.css"

const PromotionsPage: Component = () => {
	const { userRequest } = useContext(AuthContext)
	const { getPromotionImagesRequest, promotionImages } = useContext(PromotionContext)

	const loading = true || getPromotionImagesRequest.fetching || userRequest.fetching

	const images = loading ? new Array(2).fill(["", ""]) : Object.entries(promotionImages)

	return (
		<Page path="/promotions" title="Promotions">
			<div className="promotions-page flex-gap-y-4">
				<Loader loading={loading}>
					{images.map(([key, value ]) => (
						<Loadable key={key} component="img" src={`data:image/png;base64, ${value}`} loadClass="max-w-200 h-100 w-[calc(100vw-4rem)]" />
					))}
				</Loader>
			</div>
		</Page>
	)
}

export default PromotionsPage