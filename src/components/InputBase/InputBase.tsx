import clsx from "clsx"
import React from "react"
import { useEffect, useState } from "react"
import { Component, ComponentType } from "../../types/Util"
import { calculateTextBounds } from "../../util"
import { Loadable } from "../Loader"
import "./InputBase.css"

export interface InputClasses {
	root?: string,
	container?: string,
	label?: string
}

export type InputBaseProps = React.HTMLAttributes<HTMLDivElement> & {
	label?: string,
	classes?: InputClasses,
	id?: string,
	labelFixed?: boolean,
	active?: boolean,
	selected?: boolean,
	inputStyle?: "default" | "contrast" | "light",
	error?: boolean,
	hintText?: string
	icon?: ComponentType;
	leftContent?: JSX.Element
	rightContent?: JSX.Element
	flush?: "top" | "left" | "bottom" | "right";
	component?: ComponentType,
	[key: string]: any
}

const InputBase: Component<InputBaseProps> = React.forwardRef(({
	classes, id, label, labelFixed, active,
	selected, children, className,
	inputStyle, hintText, error, icon, leftContent,
	flush, component, rightContent, ...others
}, ref) => {

	const [ labelWidth, setLabelWidth ] = useState("0px")

	useEffect(() => {
		const labelBounds = calculateTextBounds(label || "", ["text-hint", "uppercase"])
		setLabelWidth(`${labelBounds.width}px`)
	})

	const Icon = icon as Component<any>
	const Comp = (component || "div") as Component<any>
	
	return (
		<Comp
			{...others}
			ref={ref}
			className={clsx(
				"input-root",
				classes?.root,
				className,
				inputStyle,
				{
					"label-fixed": labelFixed,
					"selected": selected,
					"active": active,
					"error": error,
					"has-icon": icon !== undefined,
					"has-hint": !!hintText,
					[`flush-${flush}`]: flush
				}
			)}
		>
			{icon && (
				<div className="left-container icon-container">
					<Icon className="icon" />
				</div>
			)}
			{leftContent && (
				leftContent
			)}
			{children}
			{rightContent && (
				rightContent
			)}
			
			{hintText && (
				<Loadable
					component="p"
					className="hint-text"
				>
					{hintText}
				</Loadable>
			)}
		</Comp>
	)
})

export default InputBase