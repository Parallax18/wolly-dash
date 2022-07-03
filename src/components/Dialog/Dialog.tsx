import clsx from "clsx"
import React from "react"
import { Component, ComponentType } from "../../types/Util"
import IconButton from "../IconButton"

import "./Dialog.css"

import CloseIcon from "../../svg/icons/close.svg"

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
				<IconButton onClick={() => onClose?.()} className="close-button">
					<CloseIcon />
				</IconButton>
				{others.children}
			</Comp>
		</>
	)
}

export default Dialog