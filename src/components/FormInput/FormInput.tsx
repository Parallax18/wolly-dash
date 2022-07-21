import { useContext } from "react"
import type { Component } from "../../types/Util"
import { FormContext } from "../Form/Form"
import Input, { InputProps } from "../Input"
import "./FormInput.css"

export type FormInputProps = InputProps & {
	field: string
}

const FormInput: Component<FormInputProps> = ({
	field, ...others
}) => {
	const formContext = useContext(FormContext)
	if (!formContext) throw "FormInputs must be inside a Form component"

	return (
		<Input
			{...others}
			value={formContext.values[field]}
			
			onInput={(e) => {
				formContext.updateValue(field, e.currentTarget.value)
				others.onInput?.(e)
			}}
			error={!!formContext.errors[field]}
			hintText={formContext.errors[field] || undefined}
			onBlur={() => {
				if (!formContext.values[field]) return;
				formContext.updateChanged(field, true)
			}}
		/>
	)
}

export default FormInput