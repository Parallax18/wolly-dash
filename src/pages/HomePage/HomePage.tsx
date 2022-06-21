import Page from "../../components/Page"
import { Component } from "../../types/Util"
import "./HomePage.css"

const HomePage: Component = () => {
	return (
		<Page path="/" userRestricted>
			Home
		</Page>
	)
}

export default HomePage