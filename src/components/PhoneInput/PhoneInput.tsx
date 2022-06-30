import type { Component } from "../../types/Util"
import Input from "../Input"
import Select from "../Select"
import "./PhoneInput.css"

import { countryList } from "../../util"
import FormInput from "../FormInput"
import FormSelect from "../FormSelect"

export interface PhoneValue {
	countryCode?: string,
	phoneNumber?: string
}

export interface PhoneInputProps {
	numberField: string,
	codeField: string

}

const PhoneInput: Component<PhoneInputProps> = (props) => {
	return (
		<FormInput
			className="phone-input"
			field={props.numberField}
			placeholder="Phone Number"
			leftContent={(
				<FormSelect
					className="phone-input-select"
					searchable
					field={props.codeField}
					compact
					flush="right"
					inputStyle="light"
					valueComponent={(props) => (
						<div className="flex-1 flex items-center h-6">
							<p style={props.style}>
								{props.item?.data.dial_code}
							</p>
						</div>
					)}
					items={countryList.map((countryItem) => ({
						label: `${countryItem.flag} ${countryItem.name} ${countryItem.dial_code}`,
						value: countryItem.code,
						data: countryItem
					}))}
				/>
			)}
		/>
	)
}

export default PhoneInput