import clsx from "clsx"
import React, { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { Loadable, Loader } from "../../components/Loader"
import Page from "../../components/Page"
import { AuthContext } from "../../context/AuthContext"
import { PromotionContext } from "../../context/PromotionContext"
import { defaultPromotionImage } from "../../defaults/Api"
import { PromotionImage } from "../../types/Api"
import { Component } from "../../types/Util"
import { getParamsString } from "../../util"

import "./PromotionsPage.css"

const PromotionsPage: Component = () => {
	const { userRequest } = useContext(AuthContext)
	const { getPromotionImagesRequest, promotionImages } = useContext(PromotionContext)

	const loading = getPromotionImagesRequest.fetching || userRequest.fetching

	const images: [string, PromotionImage][] = loading ? new Array(2).fill(["", defaultPromotionImage]) : Object.entries(promotionImages)

	return (
		<Page path="/promotions" title="Promotions">
			<Loader loading={loading}>
				<div className={clsx("promotions-page", {
					"+lg:max-w-400": images.length > 1
				})} style={{["--items" as any]: images.length}}>
					<div className={clsx("promotions-images-container gap-4", {
						"+lg:grid": images.length > 1,
					})}>
						{images.map(([key, promotionImage], i) => {
							return (
								<Loadable
									key={i}
									component={Link}
									to={`/buy?${promotionImage.buy_params}`}
									variant="block"
									className="flex"
									loadClass="aspect-video +md:min-h-80 <md:min-h-40 "
								>
									<img
										src={`data:image/png;base64, ${promotionImage.image}`}
										className="w-full rounded"
									/>
								</Loadable>
							)
						})}
					</div>
				</div>
			</Loader>
		</Page>
	)
}

export default PromotionsPage