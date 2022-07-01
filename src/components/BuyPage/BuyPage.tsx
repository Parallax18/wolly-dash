import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Component, ComponentType } from "../../types/Util"
import { CurrencyItem, deserializeObjFromQuery, dollarItem, formatNumber, getBonusName, isDuplicate, roundToDP, tokenList, useBonusCalculations, useInterval, useStateRef } from "../../util"
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
import { SelectModalWrapper } from "../SelectModal"
import { PriceContext } from "../../context/PriceContext"
import { PricesResponse, TokenBonus } from "../../types/Api"
import { StageContext } from "../../context/StageContext"
import { AuthContext } from "../../context/AuthContext"
import { ProjectContext } from "../../context/ProjectContext"
import { Loadable, Loader, LoaderContext } from "../Loader"

const BuyPage: Component = () => {
	const [ timeRemaining, setTimeRemaining ] = useState(0);
	const { prices, refreshPrices } = useContext(PriceContext)
	const bonusCalculationRequest = useBonusCalculations()

	const { activeStage } = useContext(StageContext)
	const { user } = useContext(AuthContext)
	const { currentProject } = useContext(ProjectContext)

	const [ searchParams, setSearchParams ] = useSearchParams()
	const [ tokenModalOpen, setTokenModalOpen ] = useState(false)
	const lastChanged = useRef("usd_amount")

	const params = deserializeObjFromQuery(
		new URLSearchParams(searchParams),
		["usd_amount", "token"]
	)

	const initialValues = {
		usd_amount: params.usd_amount as number || 1000,
		buy_token_amount: 1,
		token: tokenList.find((token) => token.id === params.token_id || "ETH")
	}

	const [ values, setValues, valuesRef ] = useStateRef(initialValues)

	const updateValue = (key: string, value: any) => {
		if (["usd_amount", "buy_token_amount"].includes(key)) lastChanged.current = key;
		setValues((val) => {
			let newValues = {...val, [key]: value}
			return newValues
		})
		updatePrices()
	}

	const updatePrices = (newPrices: PricesResponse = prices) => {
		const { usd_amount, buy_token_amount, token} = valuesRef.current
		let tokenSymbol = token?.symbol || ""
		if (lastChanged.current === "usd_amount") {
			setValues((vals) => ({
				...vals,
				buy_token_amount: (usd_amount as number) !== 0 ? (usd_amount as number) / (newPrices[tokenSymbol]?.USD || 1) : 0
			}))
		} else {
			
			setValues((vals) => ({
				...vals,
				usd_amount: (newPrices[tokenSymbol]?.USD || 1) * (buy_token_amount as number)
			}))
		}
	}

	const updateBonuses = () => {
		let vals = valuesRef.current
		if (!vals.token?.id || !activeStage) return;
		console.log("SENDING")
		bonusCalculationRequest.sendRequest({
			purchase_token_id: vals.token?.id,
			bonuses: activeStage?.bonuses,
			purchase_amount: vals.usd_amount,
			token_price: activeStage.token_price
		})
	}

	useEffect(() => {
		updateBonuses();
	}, [values])

	useEffect(() => {
		console.log("BONUS DATA", bonusCalculationRequest.data)
	}, [bonusCalculationRequest.data])

	const { getTimeRemaining } = useInterval(useCallback(async () => {
		let prices = await refreshPrices()
		updatePrices(prices)
	}, []), 60*1000, true)
	

	useInterval(useCallback(() => setTimeRemaining(Math.floor(getTimeRemaining() / 1000)), []), 1000, true)

	const toDisplay = (num: number) => {
		return roundToDP(num, 5)
	}

	const tiered_fiat = activeStage?.bonuses.tiered_fiat?.sort((a, b) => a.amount - b.amount) || []

	let bonuses: {label: string, amount: number}[] = useMemo(() => {
		let bonusArr;
		if (bonusCalculationRequest.fetching) {
			bonusArr = new Array(4).fill(0).map((_, i) => ({label: i.toString(), amount: 0}))
		} else  {
			bonusArr = Object.entries(bonusCalculationRequest.data || {}).map(([key, value]) => ({
				label: getBonusName(key),
				amount: (value * (activeStage?.token_price || 0)) * 100 / values.usd_amount
			})).filter((bonus) => bonus.amount > 0)
		}

		return bonusArr
	}, [bonusCalculationRequest, activeStage, values.usd_amount])

	const totalBonus = useMemo(() => {
		return bonuses.reduce((acc, currBonus) => acc + (currBonus.amount || 0), 0)
	}, [bonuses])

	const totalBonusItem = {label: "Total Bonus", amount: totalBonus}

	return (
		<Page path="/buy" title="Buy">
			<Form
				className={clsx("buy-page", {"modal-open": tokenModalOpen})}
				initialValues={values}
				values={values}
				onUpdate={(newVals) => {
					setValues(newVals as typeof values)
					updatePrices()
				}}
				onSubmit={() => {}}
			>
				<FormPage
					title={`Buy ${currentProject?.symbol.toUpperCase() || "Tokens"}`}
					classes={{body: "flex-gap-y-6", wrapper: "relative"}}
					outsideElement={
						<SelectModalWrapper open={tokenModalOpen}>
							<FormTokenSelectModal
								bonuses={activeStage?.bonuses.payment_tokens}
								className="fixed pointer-events-auto"
								open={tokenModalOpen}
								onClose={() => setTokenModalOpen(false)}
								field="token"
							/>
						</SelectModalWrapper>
					}
				>
					<div className="form-item">
						<label htmlFor="usd-amount">I want to spend</label>
						<FormNumberInput
							id="usd-amount"
							field="usd_amount"
							rightContent={<CurrencyItemDisplay currencyItem={dollarItem} />}
							onFocus={() => lastChanged.current = "usd_amount"}
						/>
						<div className="bonus-buttons flex-gap-x-2">
							{tiered_fiat.map((bonus) => (
								<Button
									key={bonus.amount}
									size="tiny"
									color="bg-light"
									className={clsx("bonus-button", {
										active: values.usd_amount >= bonus.amount
									})}
									onClick={() => updateValue("usd_amount", bonus.amount)}
								>
									<span className="amount">${bonus.amount}</span>
									<span className="percent">+{bonus.percentage}%</span>
								</Button>
							))}
						</div>
					</div>
					<div className="form-item">
						<label htmlFor="buy-token-amount">I want to buy with</label>
						<FormNumberInput
							id="buy-token-amount"
							field="buy_token_amount"
							onFocus={() => lastChanged.current = "buy_token_amount"}
							maxDecimals={5}
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
											bonuses={activeStage?.bonuses.payment_tokens}
										>
											<DropdownIcon className="w-3 h-3 ml-2 fill-current !text-text-primary" />
										</CurrencyItemDisplay>
									)}
								</FormRender>
							)}
						/>
					</div>
					<div className="form-item">
						<Loader loading={bonusCalculationRequest.fetching}>
							<span>
								Bonuses
							</span>
							<Collapse
								classes={{inner: clsx("bonus-list", {loading: bonusCalculationRequest.fetching})}}
								title={
									<div className="bonus-item total">
										<span className="bonus-label">{totalBonusItem.label}</span>
										<Loadable component="span" length={3} className="bonus-percent">+{totalBonusItem.amount}%</Loadable>
										<Loadable component="span" length={2} className="bonus-usd">+{roundToDP((totalBonusItem.amount || 0) / 100 * values.usd_amount, 2)}$</Loadable>
									</div>
								}
							>
								{bonuses.map((bonus) => (
									<div
										key={bonus.label}
										className={clsx("bonus-item", {total: bonus.label === "Total"})}
									>
										<Loadable component="span" className="bonus-label">{bonus.label}</Loadable>
										<Loadable component="span" length={3} className="bonus-percent">+{roundToDP(bonus.amount, 0)}%</Loadable>
										<Loadable component="span" length={2} className="bonus-usd">+{roundToDP((bonus.amount || 0) / 100 * values.usd_amount, 2)}$</Loadable>
									</div>
								))}
							</Collapse>
						</Loader>
					</div>
					<div className="form-item">
						<span className="flex">
							Summary
							<span className="ml-auto">
								Quote updates in {timeRemaining}s
							</span>
						</span>
						<Collapse title={
							<>
								You spend
								<span className="font-semibold mx-1">
									{toDisplay(values.buy_token_amount)} {values.token?.symbol}
								</span>
								for <span className="font-semibold mx-1">
									${formatNumber(values.usd_amount + values.usd_amount * totalBonus / 100 || 0)}
								</span>
							</>
						}>
							<>
								<p>
									{toDisplay(values.buy_token_amount)} {values.token?.symbol}
									{" "}@<span className="ml-1">
										${prices[values.token?.symbol || ""]?.USD || 1}
									</span>{" "}for
									<span className="font-semibold mx-1">
										${formatNumber(values.usd_amount || 0)}
									</span>
								</p>
								<p>
									A total bonus of <span className="font-semibold">{totalBonus}%</span> for <span className="font-semibold">${formatNumber(totalBonus / 100*values.usd_amount)}</span>
								</p>
							</>
						</Collapse>
					</div>
					<div className="flex-1 !mb-0" />
					<Button color="primary" rounded>
						Continue
					</Button>
				</FormPage>
			</Form>
		</Page>
	)
}

export default BuyPage

export type CurrencyItemDisplayProps = React.HTMLAttributes<HTMLDivElement> & {
	classes?: {
		bonusChip?: string
	},
	currencyItem?: CurrencyItem,
	component?: ComponentType,
	currencyList?: CurrencyItem[],
	bonuses?: TokenBonus[]
	[key: string]: any
}

export const CurrencyItemDisplay: Component<CurrencyItemDisplayProps> = ({
	currencyItem, component = "div", children, currencyList,
	bonuses, classes, ...others
}) => {
	const bonusItem = bonuses ? bonuses.find((bonus) => bonus.token_id.toLowerCase() === currencyItem?.symbol.toLowerCase()) : undefined;

	const Comp = (component || "div") as Component<any>
	
	const duplicate = useMemo(() => {
		return isDuplicate(currencyItem, currencyList || [], (currItem) => currItem?.symbol === currencyItem?.symbol)
	}, [currencyItem, currencyList])


	return (
		<Comp
			{...others}
			className={
				clsx(
					"currency-display-item",
					others.className,
				)
			}>
			<div className="relative">
				<img
					src={currencyItem?.imageUrl}
				/>
				{duplicate && (
					<div className="chain-chip">
						{currencyItem?.chain?.substring(0,1)}
					</div>
				)}
			</div>
			<span className="text-container">
				{currencyItem?.symbol}
				{bonusItem && <span className={clsx("text-2xs text-success-light font-bold bg-background-contrast py-0.5 px-1.5 rounded-full", classes?.bonusChip)}>
					+{bonusItem.percentage}%
				</span>}
			</span>
			{children}
		</Comp>
	)
}