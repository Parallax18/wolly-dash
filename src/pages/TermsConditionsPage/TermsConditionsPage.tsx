import React, { useContext } from "react"
import { Loadable, LoadableParagraph, Loader } from "../../components/Loader"
import Page from "../../components/Page"
import { AuthContext } from "../../context/AuthContext"
import { ProjectContext } from "../../context/ProjectContext"
import { Component } from "../../types/Util"

import "./TermsConditionsPage.css"

const TermsConditionsPage: Component = () => {
	const { currentProject, currProjectRequest } = useContext(ProjectContext)

	const name = currentProject?.name

	return (
		<Page path="/terms" title="Terms & Conditions">
			<Loader loading={currProjectRequest.fetching}>
				<div className="terms-page">
					<Loadable component="h1">Terms and Conditions</Loadable>
					<LoadableParagraph length={30}>
						These Terms govern your access to, usage of all content, Product and Services available at website (the “Service”) operated by (“us”, “we”, or “our”). Your access to our services is subject to your acceptance, without modification, of all of the terms and conditions contained herein and all other operating rules and policies published and that may be published from time to time by us. Please read the Agreement carefully before accessing or using our Services. By accessing or using any part of our Services, you agree to be bound by these Terms. If you do not agree to any part of the terms of the Agreement, then you may not access or use our Services.
					</LoadableParagraph>
					<Loadable component="h2">Blog Comments Policy</Loadable>
					<LoadableParagraph length={20}>We encourage and welcome comments on our blog. We would also like to thank everyone who takes their time out in posting comments on {name}. We generally post all the comments which are useful to all of our readers. However, there are certain instances where we edit or delete the comment(s). This includes:</LoadableParagraph>
					<LoadableParagraph length={30}>
						Comments that are posted solely for the purpose of promotion.<br />
						Comments that are spam or have a spammy nature.<br />
						Comments which use vulgar language or swear words.<br />
						Comments which attack / harass another person individually.
					</LoadableParagraph>
					<LoadableParagraph length={17}>We recommend everyone to follow our comment policy rules to help you keep the blog a constructive place for discussion. We reserve the right to edit or delete comments submitted to this blog at any time without notice. The comment policy may be changed at any point of time. </LoadableParagraph>
					<Loadable component="h2">Newsletter disclaimer</Loadable>
					<Loadable component="h3">Copyright</Loadable>
					<LoadableParagraph length={24}>We at {name}, reserve all copyrights on text or images on the newsletter. The text or images in the newsletter may not be copied or distributed without prior permission of {name}. If there is any approved use of content, the following conditions should be followed: The source of copied material should be mentioned as {name}, this statement should appear on all forms of distribution.</LoadableParagraph>
					<Loadable component="h3">E-mail</Loadable>
					<LoadableParagraph length={24}>You may choose to communicate with us via e-mail. However, in case you do so, you should note that the security of internet e-mail is unreliable. By sending confidential or sensitive e-mail messages which are unencrypted you accept the risks of such uncertainty and possible breach of confidentiality or privacy over the internet.</LoadableParagraph>
					<Loadable component="h3">No Warranty</Loadable>
					<LoadableParagraph length={24}>The information contained in this newsletter is provided by {name} as a service/promotion to its users, subscribers, customers and possible others. It does not contain (legal) advice. Although we try to provide quality information, we do not guarantee of results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance for a particular purpose.</LoadableParagraph>
					<Loadable component="h3">No Liability</Loadable>
					<LoadableParagraph length={14}>In no way is {name} is liable to user or any other party for any damages, costs of any character including but not limited to direct or indirect, consequential, incidental or other costs or damages, via the use of the information contained in the newsletters.</LoadableParagraph>
					<Loadable component="h3">Changes</Loadable>
					<LoadableParagraph length={10}>We may make changes to this information at any time without prior notice. We make no commitment to update the information contained in this newsletter.</LoadableParagraph>
					<Loadable component="h2">Intellectual Property</Loadable>
					<LoadableParagraph length={15}>The Agreement does not transfer from Us to you any of Ours or third-party intellectual property, and all right, title, and interest in and to such property will remain (as between the parties) solely with and its licensors.</LoadableParagraph>
					<Loadable component="h2">Third Party Services</Loadable>
					<LoadableParagraph length={30}>In using the Services, you may use third-party services, products, software, embeds, or applications developed by a third party (“Third Party Services”). If you use any Third-Party Services, you understand that: Any use of a Third-Party Service is at your own risk, and we shall not be responsible or liable to anyone for Third Party websites or Services. You acknowledge and agree that We shall not be responsible or liable for any damage or loss caused or alleged to be caused by or in connection with the use of any such content, goods or services available on or through any such web sites or services.</LoadableParagraph>
					<Loadable component="h2">Accounts</Loadable>
					<LoadableParagraph length={35}>Where use of any part of our Services requires an account, you agree to provide us with complete and accurate information when you register for an account. You will be solely responsible and liable for any activity that occurs under your account. You are responsible for keeping your account information up-to-date and for keeping your password secure. You are responsible for maintaining the security of your account that you use to access the Service. You shall not share or misuse your access credentials. You must notify us immediately of any unauthorized uses of your account or upon becoming aware of any other breach of security.</LoadableParagraph>
					<Loadable component="h2">Termination</Loadable>
					<LoadableParagraph length={30}>We may terminate or suspend your access to all or any part of our Services at any time, with or without cause, with or without notice, effective immediately. If you wish to terminate the Agreement or your account, you may simply discontinue using our Services. All provisions of the Agreement which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</LoadableParagraph>
					<Loadable component="h2">Disclaimer</Loadable>
					<LoadableParagraph length={32}>Our Services are provided “AS IS.” and “AS AVAILABLE” basis. and its suppliers and licensors hereby disclaim all warranties of any kind, express or implied, including, without limitation, the warranties of merchantability, fitness for a particular purpose and non-infringement. Neither, nor its suppliers and licensors, makes any warranty that our Services will be error free or that access thereto will be continuous or uninterrupted. You understand that you download from, or otherwise obtain content or services through, our Services at your own discretion and risk.</LoadableParagraph>
					<Loadable component="h2">Jurisdiction and Applicable Law</Loadable>
					<LoadableParagraph length={24}>Except to the extent any applicable law provides otherwise, the Agreement and any access to or use of our Services will be governed by the laws of. The proper venue for any disputes arising out of or relating to the Agreement and any access to or use of our Services will be the state and federal courts located in.</LoadableParagraph>
					<Loadable component="h2">Changes</Loadable>
					<LoadableParagraph length={30}>{name} reserves the right, at our sole discretion, to modify or replace these Terms at any time. If we make changes that are material, we will let you know by posting on our website, or by sending you an email or other communication before the changes take effect. The notice will designate a reasonable period of time after which the new terms will take effect. If you disagree with our changes, then you should stop using our Services within the designated notice period, or once the changes become effective. Your continued use of our Services will be subject to the new terms.</LoadableParagraph>
				</div>
			</Loader>
		</Page>
	)
}

export default TermsConditionsPage