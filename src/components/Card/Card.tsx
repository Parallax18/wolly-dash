import clsx from "clsx"
import { Component, ComponentType } from "../../types/Util"
import "./Card.css"

export type CardProps = {
	component?: ComponentType,
	padding?: number
} & React.HTMLAttributes<HTMLDivElement>

const Card: Component<CardProps> = ({
	component, children, padding = 2, ...others
}) => {
	const Comp = (component as Component<any>) || "div"

	return (
		<Comp
			{...others}
			className={clsx("card", others.className)}
			style={{["--padding" as any]: `${padding}rem`}}>
			
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
	center?: boolean;
	compact?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const CardTitle: Component<CardTitleProps> = ({
	center, title, classes, compact, children, ...others
}) => {
	return (
		<div
			{...others}
			className={
				clsx("card-title", classes?.title, others.className, {
					"text-center": center,
					compact,
					"!items-center": center
				})
			}
			>
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
	component, children, ...others
}) => {
	const Comp = (component || "div") as Component<any>

	return (
		<Comp
			component={component}
			className={clsx(others.className)}
		>
			{children}
		</Comp>
	)
}

export type CardGroupProps = React.HTMLAttributes<HTMLDivElement>

export const CardGroup: Component<CardGroupProps> = (props) => {
	return (
		<div {...props} className={clsx("card-group", props.className)}>
			{props.children}
		</div>
	)
}