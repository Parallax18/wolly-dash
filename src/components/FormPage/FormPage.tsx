import clsx from "clsx"
import { Component } from "../../types/Util"
import Card, { CardBody, CardTitle } from "../Card"
import "./FormPage.css"

export interface FormPageClasses {
	page?: string,
	card?: string,
	title?: string,
	body?: string
}

export interface FormPageProps {
	title: string
	background?: string,
	classes?: FormPageClasses
}

const FormPage: Component<FormPageProps> = (props) => {
	return (
		<div className={clsx("form-page", props.classes?.page)}>
			{props.background && <img className="form-background" src={props.background} />}
			<Card className={clsx("form-card", props.classes?.card)}>
				<CardTitle center className={clsx(props.classes?.title)}>
					{props.title}
				</CardTitle>
				<CardBody className={clsx(props.classes?.body)}>
					{props.children}
				</CardBody>
			</Card>
		</div>
	)
}

export default FormPage