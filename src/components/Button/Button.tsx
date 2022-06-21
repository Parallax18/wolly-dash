import clsx from "clsx";
import React from "react";
import { Component, ComponentType } from "../../types/Util";
import Spinner from "../Spinner";
import "./Button.css"

export interface ButtonClasses {
	root?: string,
	container?: string,
	label?: string
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	icon?: ComponentType;
	class?: string;
	classes?: ButtonClasses;
	color?: "base" | "primary" | "secondary" | "accent" | "transparent",
	textColor?: "unselected" | "secondary" | "default"
	buttonStyle?: "contained" | "outlined",
	component?: ComponentType,
	disabled?: boolean,
	compact?: boolean,
	loading?: boolean,
	fluid?: boolean,
	textFill?: boolean
	[key: string]: any
}

const Button: Component<ButtonProps> = ({
	icon, className, classes, color = "base",
	children, component, disabled, buttonStyle = "contained",
	compact, loading, fluid, textFill, textColor,
	...others
}) => {
	const Comp = (component || "button") as Component<any>
	const Icon = icon

	return (
		<Comp
			{...others}
			disabled={disabled}
			onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
				if (disabled) return e.preventDefault()
				if (loading) return e.preventDefault()
				return others.onClick?.(e)
			}}
			className={clsx("button", className, {
				[color]: true,
				[buttonStyle]: true,
				[`text-col-${textColor}`]: !!textColor,
				empty: !children,
				icon: icon !== undefined,
				disabled, compact,
				loading, fluid,
				"text-fill": textFill
			})}
		>
			{Icon && (
				<div className="icon-container">
					<Icon />
				</div>
			)}
			{children !== undefined && !loading && (
				<span>{children}</span>
			)}
			{loading && <>
				<span className="opacity-0">{children}</span>
				<Spinner size={6} />
			</>}
		</Comp>
	)
}

export default Button