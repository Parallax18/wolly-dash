import React, { useContext } from "react"
import { Loadable, LoadableParagraph, Loader } from "../../components/Loader"
import Page from "../../components/Page"
import { ProjectContext } from "../../context/ProjectContext"
import { Component } from "../../types/Util"

import "./PrivacyPolicyPage.css"

const PrivacyPolicyPage: Component = () => {
	const { currentProject, currProjectRequest } = useContext(ProjectContext)

	const name = currentProject?.name
	const url = currentProject?.frontend_url

	return (
		<Page path="/privacy-policy" title="Privacy Policy">
			<Loader loading={currProjectRequest.fetching}>
				<div className="privacy-policy">
					<Loadable component="h1">Privacy Policy & Cookie Policy</Loadable>
					<LoadableParagraph length={24}>
						This Privacy Policy explains how {name} collects, uses, shares, and protects user
						information obtained through the <a href={url}>{url}</a> website. The terms “we,” “us,” and “our”
						refer to {name} and its affiliates. When we ask for certain personal information from
						users it is because we are required by law to collect this information or it is relevant for
						specified purposes. Any non-required information you provide to us is done so voluntarily.
						You decided whether to provide us with these non-required information; you may not be
						able to access or utilize all of our Services if you choose not to.
					</LoadableParagraph>
					<LoadableParagraph length={24}>
						By using the Site, you consent to the data practices described in this Privacy Policy. On
						occasion, {name} may revise this Privacy Policy to reflect changes in law or our personal
						data collection and use practices. If material changes are made to this Privacy
						Policy, the changes will be announced by posting on the site. We will ask for your consent
						before using your information for any purpose that is not covered in this Privacy Policy.
						The latest privacy policy has incorporated elements from the General Data Protection Regulation (GDPR) as we act in accordance to its personal information processing rules
						within the European Economic Area (EEA).
					</LoadableParagraph>
					<Loadable component="h2">What kinds of information do we collect?</Loadable>
					<LoadableParagraph length={5}>
						We want you to understand the types of information we collect when you register for and use
						{name}’s services
					</LoadableParagraph>
					<Loadable component="h2">Information you provide to us at registration</Loadable>
					<LoadableParagraph length={12}>
						When you create a {name} Account, you provide us with personal information that
						includes your contact information (Email Address and a password). You can also choose
						to add a Google Authenticator account to be used for 2FA verification for improved security.
					</LoadableParagraph>
					<Loadable component="h2">Service Usage Information</Loadable>
					<LoadableParagraph length={24}>
						Through your use of the {name} platform, we also can monitor and collect tracking
						information related to usages such as access date & time, device identification,
						operating system, browser type, and IP address. This information may be directly obtained
						by {name} or through third party services. This service usage data helps us our
						systems to ensure that our interface is accessible for users across all platforms
						and can aid during criminal investigations.
					</LoadableParagraph>
					<Loadable component="h2">Why does {name} collect this information</Loadable>
					<LoadableParagraph length={20}>To provide and maintain our services
						We use the information collected to deliver our services and verify user identity.
						We use the IP address and unique identifiers stored in your device’s cookies to help us
						authenticate your identity and provide our service. Given our legal obligations and system
						requirements, we cannot provide you with services without data like identification, contact
						information, and transaction-related information.</LoadableParagraph>
					<Loadable component="h2">To protect our users</Loadable>
					<LoadableParagraph length={20}>We use the information collected to protect our platform, users’ accounts, and archives.
					We use IP addresses and cookie data to protect against automated abuse such as spam,
					phishing and Distributed Denial of Service (DDoS) attacks.</LoadableParagraph>
					<Loadable component="h2">To comply with legal and regulatory requirements</Loadable>
					<LoadableParagraph length={20}>Respect for the privacy and security of data you store with {name} informs our approach
	to complying with regulations, governmental requests and user-generated inquiries. We will
	not disclose or provide any personal information to third party sources without review from
	our legal case team and/or prior consent from the user.</LoadableParagraph>
					<Loadable component="h2">To measure site performance</Loadable>
					<LoadableParagraph length={20}>We actively measure and analyze data to understand how our services are used. This
					review activity is conducted by our operations team to continually improve our platform’s
					performance and to resolve issues with the user experience.
					We continuously monitor our systems’ activity information and communications with users to
					look for and quickly fix problems.</LoadableParagraph>
					<Loadable component="h2">To communicate with you</Loadable>
					<LoadableParagraph length={20}>We use personal information collected, like an email address to interact with users directly
					when providing customer support on a ticket or to keep you informed on logins, transactions,
					and security. Without processing your personal information for confirming each
					communication, we will not be able to respond to your submitted requests, questions and
					inquiries. All direct communications are kept confidential and reviewed internally for
					accuracy.</LoadableParagraph>
					<Loadable component="h2">How does {name} protect user data</Loadable>
					<LoadableParagraph length={27}>{name} has implemented a number of security measures to ensure that your information is
	not lost, abused, or altered. Our data security measures include, but are not limited to:
	PCI Scanning, Secured Sockets Layered encryption technology, internal
	data access restrictions, and strict physical access controls to buildings & files. Please note
	that it is impossible to guarantee 100% secure transmission of data over the Internet nor
	method of electronic storage. As such, we request that you understand the
	responsibility to independently take safety precautions to protect your own personal
	information.</LoadableParagraph>
					<LoadableParagraph length={10}>If you suspect that your personal information has been compromised, especially account
	and/or password information, please contact {name} customer service immediately.</LoadableParagraph>
				</div>
			</Loader>
		</Page>
	)
}

export default PrivacyPolicyPage