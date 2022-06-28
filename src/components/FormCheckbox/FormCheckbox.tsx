import clsx from "clsx"
import React, { useContext } from "react"
import { Component } from "../../types/Util"
import Checkbox, { CheckboxProps } from "../Checkbox"
import { FormContext } from "../Form/Form"

import "./FormCheckbox.css"

export type FormCheckboxProps = Omit<CheckboxProps, "checked" | "onChange"> & {
	field: string
}

const FormCheckbox: Component<FormCheckboxProps> = ({ field, ...others }) => {
	const formContext = useContext(FormContext)
	if (!formContext) throw "FormCheckbox's must be inside a Form component"

	console.log("Checkbox error", formContext.errors[field])

	return (
		<Checkbox
			{...others}
			role="checkbox"
			type="button"
			value={formContext.values[field]}
			className={clsx({"text-error-main": formContext.errors[field] !== null})}
			onChange={(checked) => {
				console.log("CHECKED", checked)
				formContext.updateChanged(field, true)
				formContext.updateValue(field, checked)
			}}
		/>
	)
}

export default FormCheckbox