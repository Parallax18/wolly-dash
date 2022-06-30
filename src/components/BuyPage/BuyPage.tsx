import React, { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Component, ComponentType } from "../../types/Util"
import { CurrencyItem, deserializeObjFromQuery, dollarItem, formatNumber, isDuplicate, tokenList } from "../../util"
import Button from "../Button"
import Form, { FormContextValue, FormRender } from "../Form"
import FormInput from "../FormInput"
import FormPage from "../FormPage"
import FormSelect from "../FormSelect"
import Page from "../Page"
import TokenSelect from "../TokenSelect"

import DollarIcon from "../../svg/icons/dollar.svg"
import _DropdownIcon from "../../svg/icons/down-chevron.svg"

const DropdownIcon = _DropdownIcon as unknown as Component<any>

import "./BuyPage.css"
import FormNumberInput from "../FormNumberInput"
import clsx from "clsx"
import TokenSelectModal, { FormTokenSelectModal } from "../TokenSelectModal"
import Collapse from "../Collapse"

const BuyPage: Component = () => {
	const [ searchParams, setSearchParams ] = useSearchParams()
	const [ tokenModalOpen, setTokenModalOpen ] = useState(false)

	const params = deserializeObjFromQuery(
		new URLSearchParams(searchParams),
		["usd_amount", "token"]
	)

	const initialValues = {
		usd_amount: params.usd_amount || 1000,
		buy_token: params.token,
		buy_token_amount: 1,
		token: tokenList[0]
	}

	return (
		<Page path="/buy" title="Buy">
			<Form
				className={clsx("form-page", {"modal-open": tokenModalOpen})}
				initialValues={initialValues}
				onSubmit={() => {}}
			>
				<FormPage
					title="Buy Tokens"
					classes={{body: "flex-gap-y-8", wrapper: "relative"}}
					outsideElement={
						<div className="form-select-wrapper">
							<FormTokenSelectModal
								className="fixed pointer-events-auto"
								open={tokenModalOpen}
								onClose={() => setTokenModalOpen(false)}
								field="token"
							/>
						</div>
					}
				>
					<div className="form-item">
						<label htmlFor="usd-amount">I want to spend</label>
						<FormNumberInput
							id="usd-amount"
							field="usd_amount"
							rightContent={<CurrencyItemDisplay currencyItem={dollarItem} />}
						/>
					</div>
					<div className="form-item">
						<label htmlFor="buy-token-amount">I want to buy</label>
						<FormInput
							id="buy-token-amount"
							field="buy_token_amount"
							rightContent={(
								<FormRender>
									{(formContext) => (
										<CurrencyItemDisplay
											currencyItem={tokenList.find((item) => item === formContext.values.token)}
											currencyList={tokenList}
											component={Button}
											color="bg-light"
											flush="left"
											onClick={() => setTokenModalOpen(true)}
										>
											<DropdownIcon className="w-3 h-3 ml-2 fill-current !text-text-primary" />
										</CurrencyItemDisplay>
									)}
								</FormRender>
							)}
						/>
					</div>
					<div className="form-item">
						<span>Summary</span>
						<Collapse title={
							<FormRender>
								{(formContext: FormContextValue) => (
									<>
										You get
										<span className="font-semibold mx-1">{formContext.values.buy_token_amount} {formContext.values.token.symbol}</span>
										for <span className="font-semibold mx-1">${formatNumber(formContext.values.usd_amount || 0)}</span>
									</>
								)}
							</FormRender>
						}>
							<FormRender>
								{(formContext: FormContextValue) => (
									<>
										<p>
											{formContext.values.buy_token_amount} {formContext.values.token.symbol} @$1,100
											for <span className="font-semibold mx-1">${formatNumber(formContext.values.usd_amount - 0.48 || 0)}</span>
										</p>
										<p className="mt-1">
											Network fee $0.48
										</p>
									</>
								)}
							</FormRender>
						</Collapse>
					</div>
					<div className="flex-1 !mb-0" />
					<Button color="primary">
						Confirm
					</Button>
				</FormPage>
			</Form>
		</Page>
	)
}

export default BuyPage

export type CurrencyItemDisplayProps = React.HTMLAttributes<HTMLDivElement> & {
	currencyItem?: CurrencyItem,
	component?: ComponentType,
	currencyList?: CurrencyItem[]
	[key: string]: any
}

export const CurrencyItemDisplay: Component<CurrencyItemDisplayProps> = ({
	currencyItem, component = "div", children, currencyList, ...others
}) => {
	const Comp = (component || "div") as Component<any>
	
	const duplicate = useMemo(() => {
		return isDuplicate(currencyItem, currencyList || [], (currItem) => currItem?.symbol === currencyItem?.symbol)
	}, [currencyItem, currencyList])

	return (
		<Comp
			{...others}
			className={
				clsx(
					"py-2 px-4 flex items-center bg-background-paperLight h-full rounded-r-item w-33",
					others.className
				)
			}>
			<div className="relative">
				<img
					src={currencyItem?.imageUrl}
					className="h-8 w-8 object-center object-cover rounded-full"
				/>
				{duplicate && (
					<div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-background-default rounded-full text-2xs flex items-center justify-center">
						{currencyItem?.chain?.substring(0,1)}
					</div>
				)}
			</div>
			<span className="ml-2 text-base font-primary">{currencyItem?.symbol}</span>
			{children}
		</Comp>
	)
}