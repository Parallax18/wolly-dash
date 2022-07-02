import clsx from "clsx"
import React from "react"
import { Component, ComponentType } from "../../types/Util"

import "./Dialog.css"

export type DialogProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onClose"> & {
	open: boolean,
	onClose?: () => void,
	component?: ComponentType,
	[key: string]: any
}

const Dialog: Component<DialogProps> = ({
	open, onClose, component, ...others
}) => {
	const Comp = component || "div"

	return (
		<>
			<div className={clsx("overlay", {open})} onClick={() => onClose?.()} />
			<Comp className={clsx("dialog", {open}, others.className)}>
				{others.children}
			</Comp>
		</>
	)
}

export default Dialog