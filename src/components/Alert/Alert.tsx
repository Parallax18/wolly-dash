import clsx from "clsx";
import React, { CSSProperties } from "react"

import SuccessIcon from "../../svg/icons/success.svg"
import InfoIcon from "../../svg/icons/info.svg"
import WarningIcon from "../../svg/icons/warning.svg"
import ErrorIcon from "../../svg/icons/error.svg"
import CloseIcon from "../../svg/icons/close.svg"

import "./Alert.css"
import IconButton from "../IconButton";

export interface AlertProps {
	className?: string;
	style?: CSSProperties;
	label: string;
	type: "success" | "info" | "warning" | "error";
	duration?: number
	onClose: () => void;
}

const iconMap = {
	success: SuccessIcon,
	info: InfoIcon,
	warning: WarningIcon,
	error: ErrorIcon
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ label, type, style, className, onClose, duration }, ref) => {
	const Icon = iconMap[type]
	
	return (
		<div
			className={clsx("alert", type, className)}
			style={style}
			ref={ref}
		>
			<Icon />
			<p>{label}</p>
			<IconButton
				onClick={onClose}
			>
				<CloseIcon />
			</IconButton>
			{duration && duration > 0 && (
				<div className="duration-bar" style={{animationDuration: `${duration}ms`}} />
			)}
		</div>
	)
})

export default Alert