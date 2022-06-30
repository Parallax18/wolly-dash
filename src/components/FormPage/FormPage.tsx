import clsx from "clsx"
import { Component } from "../../types/Util"
import Card, { CardBody, CardTitle } from "../Card"
import "./FormPage.css"

export interface FormPageClasses {
	page?: string,
	card?: string,
	title?: string,
	body?: string,
	wrapper?: string
}

export interface FormPageProps {
	title: string
	background?: string,
	classes?: FormPageClasses,
	outsideElement?: JSX.Element
}

const FormPage: Component<FormPageProps> = (props) => {
	return (
		<div className={clsx("form-page", props.classes?.page)}>
			{props.background && <img className="form-background" src={props.background} />}
			<div className={clsx("form-card-wrapper", props.classes?.wrapper)}>
				<Card className={clsx("form-card", props.classes?.card)}>
					<CardTitle center className={clsx(props.classes?.title)}>
						{props.title}
					</CardTitle>
					<CardBody className={clsx(props.classes?.body)}>
						{props.children}
					</CardBody>
				</Card>
				{props.outsideElement}
			</div>
		</div>
	)
}

export default FormPage