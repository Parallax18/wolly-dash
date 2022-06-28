import { Component } from "../../types/Util"
import Card, { CardBody, CardTitle } from "../Card"
import "./FormPage.css"

export interface FormPageProps {
	title: string
	background?: string
}

const FormPage: Component<FormPageProps> = (props) => {
	return (
		<div className="form-page">
			{props.background && <img className="form-background" src={props.background} />}
			<Card className="form-card">
				<CardTitle center>
					{props.title}
				</CardTitle>
				<CardBody>
					{props.children}
				</CardBody>
			</Card>
		</div>
	)
}

export default FormPage