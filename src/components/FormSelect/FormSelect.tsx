import { useContext } from "react"
import type { Component } from "../../types/Util"
import { FormContext } from "../Form/Form"
import Select, { SelectProps } from "../Select"
import "./FormSelect.css"

export type FormSelectProps = Omit<SelectProps, "value" | "onChange" | "items"> & {
	field: string
}

const FormSelect: Component<FormSelectProps> = ({ field, ...others }) => {
	const formContext = useContext(FormContext)
	if (!formContext) throw "FormSelects must be inside a Form component"
	
	return (
		<Select
			{...others}
			value={formContext.values[field]}
			error={formContext.errors[field] !== null}
			hintText={formContext.errors[field] || undefined}
			onChange={(val) => {
				if(!formContext.changed[field]) formContext.updateChanged(field, true);
				formContext.updateValue(field, val)
			}}
		/>
	)
}

export default FormSelect