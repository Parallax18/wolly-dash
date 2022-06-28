import type { Component } from "../../types/Util"
import "./NationalityInput.css"

import { countryList } from "../../util"
import FormSelect from "../FormSelect"

export interface NationalityInputProps {
	field: string,
}

const NationalityInput: Component<NationalityInputProps> = (props) => {
	const unknownFlagUrl = "/image/placeholder/flag.svg"

	return (
		<FormSelect
			searchable
			field={props.field}
			compact
			valueComponent={(props) => (
				<>
					{props.item && (
						<div className="flex-1 flex items-center h-6">
							<img src={props.item?.data?.flagUrl || unknownFlagUrl} className="h-full mr-4 rounded" />
							<p style={props.style} className="whitespace-nowrap">{props.item?.data?.name}</p>
						</div>
					)}
					{!props.item && (
						<div className="flex-1 flex items-center h-6">
							<img src={unknownFlagUrl} className="h-full mr-4 rounded" />
							<p style={props.style} className="whitespace-nowrap">Nationality</p>
						</div>
					)}
				</>
			)}
			items={countryList.map((countryItem) => ({
				label: `${countryItem.flag} ${countryItem.name}`,
				value: countryItem.code,
				data: countryItem
			}))}
		/>
	)
}

export default NationalityInput