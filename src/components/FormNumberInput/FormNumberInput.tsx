import React, { useContext, useEffect, useState } from "react"
import { Component } from "../../types/Util"
import { FormContext } from "../Form/Form"
import Input, { InputProps } from "../Input"

import "./FormNumberInput.css"

export type FormNumberInputProps = InputProps & {
	field: string
}

// let fullNumberRegex = /[0-9]+(\.[0-9]+)?/
let partialNumberRegex = /^[0-9]*\.?[0-9]*$/

const getFullNumberFromPartialNumber = (str: string, prevValue: number): number => {
	if (!partialNumberRegex.test(str)) return prevValue;
	if (str.endsWith(".")) str = str.replace(".", "")
	return parseFloat(str);
}

const FormNumberInput: Component<FormNumberInputProps> = ({ field, ...others }) => {
	const formContext = useContext(FormContext)
	if (!formContext) throw "FormInputs must be inside a Form component"

	const [ strValue, setStrValue ] = useState<string>(formContext.values[field] ? formContext.values[field] : "")

	const updateFormValue = (newValue: string) => {
		let fullNumber = getFullNumberFromPartialNumber(newValue, formContext.values[field])
		formContext.updateValue(field, fullNumber)
		if (partialNumberRegex.test(newValue)) setStrValue(newValue)
	}

	const updateStrValue = () => {
		setStrValue(formContext.values[field].toString())
	}

	return (
		<Input
			{...others}
			value={strValue}
			onInput={(e) => {
				updateFormValue(e.currentTarget.value)
			}}
			error={!!formContext.errors[field]}
			hintText={formContext.errors[field] || undefined}
			onBlur={() => {
				updateStrValue()
				if (!formContext.values[field]) return;
				formContext.updateChanged(field, true)
			}}
		/>
	)
}

export default FormNumberInput