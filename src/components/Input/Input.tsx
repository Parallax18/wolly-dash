import { Component, ComponentType } from "../../types/Util"
import InputBase, { InputBaseProps } from "../InputBase"
import "./Input.css"

import clsx from "clsx"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string,
	class?: string,
	round?: boolean,
	inputStyle?: InputBaseProps["inputStyle"],
	hintText?: string,
	error?: boolean,
	icon?: ComponentType,
	visibilityToggle?: boolean,
	leftContent?: JSX.Element
}

import VisibilityIcon from "../../svg/icons/visibility-outline.svg"
import VisibilityOffIcon from "../../svg/icons/visibility-off-outline.svg"
import IconButton from "../IconButton"
import { useMemo, useState } from "react"

const Input: Component<InputProps> = ({
	label, className, value, round,
	inputStyle, children, error, hintText,
	icon, visibilityToggle, leftContent, ...others
}) => {
	const [ selected, setSelected ] = useState(false)
	const [ _value, _setValue ] = useState("")
	const [ _visible, _setVisible ] = useState(others.type === "text")

	const val = useMemo<string>(() => {
		return value?.toString() || _value
	}, [value, _value])

	const type = useMemo(() => {
		if (!visibilityToggle) return others.type;
		return _visible ? "text" : "password"
	}, [visibilityToggle, _visible])

	return (
		<InputBase
			label={label}
			className={clsx("input-container", className, {round: round})}
			active={selected}
			labelFixed={selected || val.length > 0}
			inputStyle={inputStyle}
			error={error}
			hintText={hintText}
			icon={icon}
			leftContent={leftContent}
		>
			<div className="input-wrapper">
				<input
					{...others}
					size={1}
					value={val}
					onInput={others.onInput ?? ((e) => _setValue(e.currentTarget.value))}
					onFocus={() => setSelected(true)}
					onBlur={(e) => {
						setSelected(false)
						others.onBlur?.(e)
					}}
					type={type}
				/>
				{children}
				{visibilityToggle && (					
					<IconButton type="button" onClick={() => _setVisible((vis) => !vis)}>
						{_visible && (
							<VisibilityOffIcon />
						)}
						{!_visible && (
							<VisibilityIcon />
						)}
					</IconButton>
				)}
			</div>
		</InputBase>
	)
}

export default Input