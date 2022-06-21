import clsx from "clsx"
import { Component, ComponentType } from "../../types/Util"
import "./Card.css"

export type CardProps = {
	component?: ComponentType,
} & React.HTMLAttributes<HTMLDivElement>

const Card: Component<CardProps> = ({
	component, children, ...others
}) => {
	const Comp = (component as Component<any>) || "div"

	return (
		<Comp {...others} className={clsx("card", others.className)}>
			{children}
		</Comp>
	)
}

export default Card

export interface CardTitleClasses {
	title: string,
	root: string
}

export type CardTitleProps = {
	title?: string;
	classes?: CardTitleClasses;
	center?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const CardTitle: Component<CardTitleProps> = ({
	center, title, classes, children, ...others
}) => {
	return (
		<div {...others} className={
			clsx("card-title", classes?.title, others.className, {
				"text-center": center,
				"!items-center": center
			})}>
			<div className="card-title-text-container">
				{title !== undefined && (
					<h1 className={clsx(classes?.title)}>{title}</h1>
				)}
			</div>
			{children}
		</div>
	)
}

export type CardBodyProps = {
	component?: ComponentType;
	padding?: number
} & React.HTMLAttributes<HTMLDivElement>

export const CardBody: Component<CardBodyProps> = ({
	component, padding, children, ...others
}) => {
	const Comp = (component || "div") as Component<any>

	return (
		<Comp
			component={component}
			className={clsx("card-body", others.className)}
			style={padding !== undefined ? {padding: `${padding}rem`} : {}}
		>
			{children}
		</Comp>
	)
}