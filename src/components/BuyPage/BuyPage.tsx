import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Component, ComponentType } from "../../types/Util"
import { CurrencyItem, deserializeObjFromQuery, dollarItem, formatLargeNumber, formatNumber, getBonusName, isDuplicate, floorToDP, roundToNearest, tokenList, useBonusCalculations, useDebounce, useInterval, useStateRef, useCreateTransaction, errorToString } from "../../util"
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
import { AlertContext } from "../../context/AlertContext"
import { TransactionsContext } from "../../context/TransactionsContext"

const BuyPage: Component = () => {
	const [ timeRemaining, setTimeRemaining ] = useState(0);
	const { prices, refreshPrices, priceRequest } = useContext(PriceContext)
	const bonusCalculationRequest = useBonusCalculations()
	const [ bonusUSDFixed, setBonusUSDFixed ] = useState(0)

	const { activeStage } = useContext(StageContext)
	const { user } = useContext(AuthContext)
	const { currentProject, currencyTokenList, currProjectRequest } = useContext(ProjectContext)

	const [ searchParams, setSearchParams ] = useSearchParams()
	const [ tokenModalOpen, setTokenModalOpen ] = useState(false)
	const lastChanged = useRef("usd_amount")

	const { createTransactionRequest, createTransaction } = useContext(TransactionsContext)

	const params = deserializeObjFromQuery(
		new URLSearchParams(searchParams),
		["usd_amount", "token"]
	)

	const initialValues = {
		usd_amount: params.usd_amount as number || 1000,
		buy_token_amount: 1,
		token: currencyTokenList?.[0]
	}
	
	const [ values, setValues, valuesRef ] = useStateRef(initialValues)
	
	useEffect(() => {
		if (values.token === undefined)
		updateValue("token", currencyTokenList?.[0])
	}, [values?.token, currencyTokenList])


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

	const [ bonusLoading, setBonusLoading ] = useState(false)

	const fetchBonuses = useDebounce(() => {
		let vals = valuesRef.current
		if (!vals.token?.id || !activeStage) return;
		let usd = vals.usd_amount
		bonusCalculationRequest.sendRequest({
			purchase_token_id: vals.token?.id,
			bonuses: activeStage?.bonuses,
			purchase_amount: vals.usd_amount,
			token_price: activeStage.token_price
		}).then(() => {
			setBonusUSDFixed(usd)
		}).finally(() => {
			setBonusLoading(false)
		})
	}, 700)

	const updateBonuses = () => {
		setBonusLoading(true)
		fetchBonuses()
	}

	useEffect(() => {
		updateBonuses();
	}, [values, activeStage])

	const { getTimeRemaining } = useInterval(useCallback(async () => {
		if (Date.now() - priceRequest.fetchedAt < 60 * 100 || priceRequest.fetching) return;
		let prices = await refreshPrices()
		updatePrices(prices)
	}, []), 60*1000, true)
	

	useInterval(useCallback(() => setTimeRemaining(Math.floor(getTimeRemaining() / 1000)), []), 1000, true)

	const toDisplay = (num: number) => {
		return floorToDP(num, 5)
	}

	const tiered_fiat = activeStage?.bonuses.tiered_fiat?.sort((a, b) => a.amount - b.amount) || []
	let selectedTier = 0
	tiered_fiat.forEach((tier) => {
		if (tier.amount > selectedTier && values.usd_amount >= tier.amount) {
			selectedTier = tier.amount
		}
	})

	let bonuses: {label: string, amount: number, dollar: number}[] = useMemo(() => {
		let bonusArr = Object.entries(bonusCalculationRequest.data || {}).map(([key, value]) => ({
			label: getBonusName(key),
			amount: (value * (activeStage?.token_price || 0)) * 100 / (bonusUSDFixed || 1),
			dollar: (value * (activeStage?.token_price || 0))
		})).filter((bonus) => bonus.amount > 0)

		return bonusArr
	}, [bonusCalculationRequest, activeStage])

	const totalBonus = useMemo(() => {
		return bonuses.reduce((acc, currBonus) => ({amount: acc.amount + (currBonus.amount || 0), dollar: acc.dollar + (currBonus.dollar || 0)}), {amount: 0, dollar: 0})
	}, [bonuses])

	const totalBonusItem = {label: "Total Bonus", amount: totalBonus.amount, dollar: totalBonus.dollar}

	const alertContext = useContext(AlertContext)
	const navigate = useNavigate()

	const createPurchaseTransaction = () => {
		if (!values.token?.id) return;
		createTransaction({
			purchase_amount: values.usd_amount,
			purchase_token_id: values.token?.id
		}).then((res) => {
			alertContext.addAlert({type: "success", label: "Successfully created transaction", duration: 4000})
			navigate("/transactions?id=" + res.data.id)
		}).catch((err) => {
			alertContext.addAlert({type: "error", label: errorToString(err, "Error creating transaction")})
		})
	}

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
				onSubmit={() => createPurchaseTransaction()}
			>
				<Loader loading={currProjectRequest.fetching}>
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
										type="button"
										key={bonus.amount}
										size="tiny"
										color="bg-light"
										className={clsx("bonus-button", {
											active: selectedTier === bonus.amount
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
												currencyItem={formContext.values.token}
												currencyList={currencyTokenList}
												component={Button}
												type="button"
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
							<span>
								Bonuses
							</span>
							<Loader loading={bonusLoading}>
								<Collapse
									classes={{inner: "bonus-list"}}
									title={
										<div className="bonus-item total">
											<span className="bonus-label">{totalBonusItem.label}</span>
											<Loadable component="span" length={2} className="bonus-percent">+{floorToDP(totalBonusItem.amount || 0, 0)}%</Loadable>
											<Loadable component="span" length={2.5} className="bonus-usd">+{floorToDP((totalBonusItem.dollar || 0), 2)}$</Loadable>
										</div>
									}
								>
									{bonuses.map((bonus) => (
										<div
											key={bonus.label}
											className={clsx("bonus-item", {total: bonus.label === "Total"})}
										>
											<Loadable component="span" className="bonus-label">{bonus.label}</Loadable>
											<Loadable component="span" length={2} className="bonus-percent">+{floorToDP(bonus.amount || 0, 0)}%</Loadable>
											<Loadable component="span" length={2.5} className="bonus-usd">+{floorToDP(bonus.dollar || 0, 2)}$</Loadable>
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
							<div className="summary-container">
								You spend
								<span className="font-semibold mx-1">
									{toDisplay(values.buy_token_amount)} {values.token?.symbol}
								</span>
								for <span className="font-semibold mx-1">
									{formatLargeNumber((values.usd_amount + (totalBonus.dollar || 0)) / (activeStage?.token_price || 1))}
								</span> {currentProject?.symbol}
							</div>
						</div>
						<div className="flex-1 !mb-0" />
						<Button color="primary" rounded loading={createTransactionRequest.fetching}>
							Pay
						</Button>
					</FormPage>
				</Loader>
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
	const bonusItem = bonuses ? bonuses.find((bonus) => bonus.token_id.toLowerCase() === currencyItem?.id?.toLowerCase()) : undefined;

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
				<Loadable component="img"
					className="currency-image"
					src={currencyItem?.imageUrl}
				/>
				{duplicate && (
					<div className="chain-chip">
						{currencyItem?.chain?.substring(0,1)}
					</div>
				)}
			</div>
			<Loadable length={2} component="span" className="text-container">
				{currencyItem?.symbol}
				{bonusItem && <span className={clsx("text-2xs text-success-light font-bold bg-background-contrast py-0.5 px-1.5 rounded-full", classes?.bonusChip)}>
					+{bonusItem.percentage}%
				</span>}
			</Loadable>
			{children}
		</Comp>
	)
}