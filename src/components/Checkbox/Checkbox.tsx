import React, { useState } from "react"
import { Component } from "../../types/Util"
import IconButton, { IconButtonProps } from "../IconButton"

import "./Checkbox.css"

import CheckboxOutlineIcon from "../../svg/icons/checkbox-outline.svg"
import CheckboxCheckedIcon from "../../svg/icons/checkbox.svg"
import clsx from "clsx"

export type CheckboxProps = IconButtonProps & {
	checked?: boolean
	onChange?: (newValue: boolean) => void
}

const Checkbox: Component<CheckboxProps> = ({
	checked, onChange, ...others
}) => {
	const [ _value, _setValue ] = useState(checked || false)

	const value = checked !== undefined ? checked : _value

	return (
		<IconButton {...others} className={clsx({"text-primary-main": value}, others.className)} onClick={() => {
			_setValue((val) => !val)
			onChange?.(!value)
		}} >
			{value ? <CheckboxCheckedIcon /> : <CheckboxOutlineIcon /> }
		</IconButton>
	)
}

export default Checkbox