import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { ProjectContext } from "../../context/ProjectContext"
import { Component } from "../../types/Util"
import { Loadable, Loader } from "../Loader"

import "./Footer.css"

const Footer: Component = () => {
	const { currentProject, currProjectRequest } = useContext(ProjectContext)

	return (
		<div className="footer">
			<Loader loading={currProjectRequest.fetching}>
				<div className="footer-item flex-gap-y-2">
					<span className="footer-title">Socials</span>
					<div className="footer-body flex flex-gap-x-3">
						{(currProjectRequest.fetching ? [["",""],["",""],["",""]] : Object.entries(currentProject?.social_media || {})).map(([key, link], i) => (
							<Loadable variant="block" loadClass="h-5 w-5" key={i}>
								<a href={link} target="_blank">
									<img
										src={`/image/icon/${key}.svg`}
										className="social-img" />
								</a>
							</Loadable>
						))}
					</div>
				</div>
			</Loader>
			<div className="footer-item flex-gap-y-2">
				<span className="footer-title">Documents</span>
				<div className="footer-body flex flex-col">
					<Link to="/terms">Terms and Conditions</Link>
					<Link to="/privacy-policy">Privacy Policy</Link>
				</div>
			</div>
		</div>
	)
}

export default Footer