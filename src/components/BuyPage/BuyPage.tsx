import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Component, ComponentType } from "../../types/Util"
import { CurrencyItem, deserializeObjFromQuery, dollarItem, tokenList } from "../../util"
import Button from "../Button"
import Form from "../Form"
import FormInput from "../FormInput"
import FormPage from "../FormPage"
import FormSelect from "../FormSelect"
import Page from "../Page"
import TokenSelect from "../TokenSelect"

import DollarIcon from "../../svg/icons/dollar.svg"
import DropdownIcon from "../../svg/icons/down-chevron.svg"

import "./BuyPage.css"
import FormNumberInput from "../FormNumberInput"
import clsx from "clsx"
import TokenSelectModal from "../TokenSelectModal"

const BuyPage: Component = () => {
	const [ searchParams, setSearchParams ] = useSearchParams()
	const [ tokenModalOpen, setTokenModalOpen ] = useState(true)

	const params = deserializeObjFromQuery(
		new URLSearchParams(searchParams),
		["usd_amount", "token"]
	)

	const initialValues = {
		usd_amount: params.usd_amount || 1000,
		buy_token: params.token,
		buy_token_amount: 1
	}

	return (
		<Page path="/buy" title="Buy">
			<FormPage title="Buy Tokens" classes={{card: "relative overflow-hidden"}}>
				<Form
					className="flex flex-col flex-gap-y-8"
					initialValues={initialValues}
					onSubmit={() => {}}
				>
					<label className="flex flex-col">
						<span className="text-sm mb-2">I want to spend</span>
						<FormNumberInput
							field="usd_amount"
							rightContent={<CurrencyItemDisplay currencyItem={dollarItem} />}
						/>
					</label>
					<label className="flex flex-col">
						<span className="text-sm mb-2">I want to buy</span>
						<FormInput
							field="buy_token_amount"
							rightContent={(
								<CurrencyItemDisplay
									currencyItem={tokenList[0]}
									component={Button}
									color="bg-light"
									flush="left"
									onClick={() => setTokenModalOpen(true)}
								>
									<DropdownIcon className="w-3 h-3 ml-3 fill-current !text-text-primary" />
								</CurrencyItemDisplay>
							)}
						/>
					</label>
					<Button color="primary" className="mt-24">
						Confirm
					</Button>
					<TokenSelectModal
						open={tokenModalOpen}
						onClose={() => setTokenModalOpen(false)}
					/>
				</Form>
			</FormPage>
		</Page>
	)
}

export default BuyPage

export type CurrencyItemDisplayProps = React.HTMLAttributes<HTMLDivElement> & {
	currencyItem: CurrencyItem,
	component?: ComponentType
	[key: string]: any
}

export const CurrencyItemDisplay: Component<CurrencyItemDisplayProps> = ({
	currencyItem, component = "div", children, ...others
}) => {
	const Comp = (component || "div") as Component<any>
	
	return (
		<Comp
			{...others}
			className={
				clsx(
					"py-2 px-4 flex items-center bg-background-paperLight h-full rounded-r-item w-31",
					others.className
				)
			}>
			<img
				src={currencyItem.imageUrl}
				className="h-8 w-8 object-center object-cover rounded-full"
			/>
			<span className="ml-2 text-base font-primary">{currencyItem.symbol}</span>
			{children}
		</Comp>
	)
}