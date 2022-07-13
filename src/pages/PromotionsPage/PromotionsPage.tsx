import clsx from "clsx"
import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Loadable, Loader } from "../../components/Loader"
import Page from "../../components/Page"
import { AuthContext } from "../../context/AuthContext"
import { PromotionContext } from "../../context/PromotionContext"
import { Component } from "../../types/Util"

import "./PromotionsPage.css"

const PromotionsPage: Component = () => {
	const { userRequest } = useContext(AuthContext)
	const { getPromotionImagesRequest, promotionImages } = useContext(PromotionContext)

	const loading = getPromotionImagesRequest.fetching || userRequest.fetching

	const images = loading ? new Array(2).fill(["", ""]) : Object.entries(promotionImages)

	return (
		<Page path="/promotions" title="Promotions">
			<Loader loading={loading}>
				<div className={clsx("promotions-page", {
					"+lg:max-w-400": images.length > 1
				})} style={{["--items" as any]: images.length}}>
					<div className={clsx("promotions-images-container gap-4", {
						"+lg:grid": images.length > 1,
					})}>
						{images.map(([key, value], i) => (
							<Loadable
								key={i}
								component={Link}
								to="/buy"
								variant="block"
								className="flex"
								loadClass="aspect-video +md:min-h-80 <md:min-h-40 "
							>
								<img
									src={`data:image/png;base64, ${value}`}
									className="w-full rounded"
								/>
							</Loadable>
						))}
					</div>
				</div>
			</Loader>
		</Page>
	)
}

export default PromotionsPage