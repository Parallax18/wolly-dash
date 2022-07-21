import { Component, ComponentType } from "../../types/Util"
import InputBase, { InputBaseProps } from "../InputBase"
import "./Input.css"

import clsx from "clsx"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string,
	round?: boolean,
	inputStyle?: InputBaseProps["inputStyle"],
	hintText?: string,
	error?: boolean,
	icon?: ComponentType,
	visibilityToggle?: boolean,
	copyable?: boolean,
	leftContent?: JSX.Element,
	rightContent?: JSX.Element,
}

import VisibilityIcon from "../../svg/icons/visibility-outline.svg"
import VisibilityOffIcon from "../../svg/icons/visibility-off-outline.svg"
import IconButton from "../IconButton"
import { useContext, useMemo, useRef, useState } from "react"
import React from "react"

import CopyIcon from "../../svg/icons/copy.svg"
import { AlertContext } from "../../context/AlertContext"

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
	label, className, value, round,
	inputStyle, children, error, hintText,
	icon, visibilityToggle, leftContent,
	rightContent, copyable, ...others
}, _ref) => {
	const alertContext = useContext(AlertContext)

	const ref = useRef<HTMLInputElement>();
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
			className={clsx("input-container",)}
			active={selected}
			labelFixed={selected || val.length > 0}
			inputStyle={inputStyle}
			error={error}
			hintText={hintText}
			icon={icon}
			leftContent={leftContent}
			rightContent={rightContent}
			flush='bottom'
		>
			<div className="input-wrapper">
				<input
					{...others}
					size={1}
					value={val}
					onInput={others.onInput ?? ((e) => _setValue(e.currentTarget.value))}
					onFocus={(e) => {
						setSelected(true)
						others.onFocus?.(e)
					}}
					onBlur={(e) => {
						setSelected(false)
						others.onBlur?.(e)
					}}
					ref={(el) => ref.current = (el || undefined)}
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
				{copyable && (					
					<IconButton className="ml-1" type="button" onClick={() => {
						let input = ref.current;
						if (!input) return;
						input.select();
						input.setSelectionRange(0, 99999);
						navigator.clipboard.writeText(input.value)
						alertContext.addAlert({
							type: "success",
							label: "Successfully copied text",
							duration: 4000
						})
					}}>
						<CopyIcon />
					</IconButton>
				)}
			</div>
		</InputBase>
	)
})

export default Input