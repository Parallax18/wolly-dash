import React from "react"
import clsx from "clsx"
import { Component, ComponentType } from "../../types/Util"
import Spinner from "../Spinner"
import "./IconButton.css"

export type IconButtonProps = {
	component?: ComponentType
	disabled?: boolean,
	loading?: boolean
	[key: string]: any
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const IconButton: Component<IconButtonProps> = ({
	component,
	disabled,
	children,
	loading,
	...others
}) => {
	let Comp = (component || "button") as React.FC<any>
	return (
		<Comp
			{...others}
			component={component || "button"}
			className={clsx("icon-button", others.className, {
				disabled,
				loading
			})}
			disabled={disabled || loading}
		>
			{loading ? <Spinner size={6} /> : children}
		</Comp>
	)
}

export default IconButton