import React from "react"
import { Component } from "../../types/Util"
import { tokenList } from "../../util"
import FormSelect, { FormSelectProps } from "../FormSelect"

import "./TokenSelect.css"

export type TokenSelectProps = Omit<FormSelectProps, "items"> & {
	field: string
}


const TokenSelect: Component<TokenSelectProps> = ({ field, ...others }) => {
	const unknownTokenUrl = "/image/placeholder/token.svg"

	return (
		<FormSelect
			{...others}
			searchable
			field={field}
			compact
			valueComponent={(props) => (
				<>
					{props.item && (
						<div className="flex-1 flex items-center h-6">
							<img src={props.item?.data?.imageUrl || unknownTokenUrl} className="h-full mr-4 rounded" />
							<p style={props.style} className="whitespace-nowrap">{props.item?.data?.symbol}</p>
						</div>
					)}
					{!props.item && (
						<div className="flex-1 flex items-center h-6">
							<img src={unknownTokenUrl} className="h-full mr-4 rounded" />
							<p style={props.style} className="whitespace-nowrap">Token</p>
						</div>
					)}
				</>
			)}
			items={tokenList.map((tokenItem) => ({
				label: `${tokenItem.name} (${tokenItem.symbol})`,
				value: tokenItem.symbol,
				data: tokenItem
			}))}
		/>
	)
}

export default TokenSelect