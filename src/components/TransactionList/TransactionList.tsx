import clsx from "clsx"
import { QRCodeCanvas } from "qrcode.react"
import React, { useContext, useEffect, useRef, useState } from "react"
import { ProjectContext } from "../../context/ProjectContext"
import { TransactionsContext } from "../../context/TransactionsContext"
import { defaultTransaction } from "../../defaults/Api"
import { Transaction } from "../../types/Api"
import { Component } from "../../types/Util"
import { apiToCurrency, capitalize, CurrencyItem, formatLargeNumber, formatNumber, getWalletQRValue } from "../../util"
import Button from "../Button"
import Card, { CardBody, CardTitle } from "../Card"
import Chip from "../Chip"
import Collapse from "../Collapse"
import Dialog, { DialogProps } from "../Dialog"
import { Loadable, Loader } from "../Loader"
import Pagination from "../Pagination"

import WarningIcon from "../../svg/icons/warning.svg"

import "./TransactionList.css"
import Input from "../Input"
import { CurrencyItemDisplay } from "../BuyPage"
import placeholder from "../../constants/placeholder"
import { AuthContext } from "../../context/AuthContext"
import { AlertContext } from "../../context/AlertContext"

const TransactionList: Component = () => {
	const { transactions, getTransactionsRequest } = useContext(TransactionsContext)
	const params = new URLSearchParams(location.search)
	const { user } = useContext(AuthContext)
	const [ selectedTransaction, setSelectedTransaction ] = useState<Transaction | undefined>()
	const [ detailsOpen, setDetailsOpen ] = useState(false)

	const alertContext = useContext(AlertContext)

	const afterRef = useRef<string | undefined>()

	const [ page, setPage ] = useState(1)

	const paramsRef = useRef(false)

	useEffect(() => {
		let id = params.get("id")
		if (!id || paramsRef.current || transactions.length === 0) return;
		paramsRef.current = true;
		let transaction = transactions.find((txn) => txn.id === params.get("id"))
		if (!transaction) return;
		setSelectedTransaction(transaction)
		setDetailsOpen(true)
	}, [params, transactions])

	const next = () => {
		let after = getTransactionsRequest.data?.after?.[0]?.["@ref"].id
		console.log(after)
		if (!user || !after) return;
		getTransactionsRequest
			.sendRequest(user?.id, after)
			.then(() => setPage((page) => page + 1))
			.catch(() => alertContext.addAlert({type: "error", label: "Error getting transactions"}))
	}
	
	const prev = () => {
		let before = getTransactionsRequest.data?.before?.[0]?.["@ref"].id
		if (!user || !before) return;
		getTransactionsRequest
			.sendRequest(user?.id, undefined, before)
			.then(() => setPage((page) => page - 1))
			.catch(() => alertContext.addAlert({type: "error", label: "Error getting transactions"}))
	}

	return (
		<Loader loading={getTransactionsRequest.fetching}>
			<Pagination
				page={page}
				onNext={() => next()}
				onPrevious={() => prev()}
				prevDisabled={getTransactionsRequest.data?.before === undefined || getTransactionsRequest.fetching}
				nextDisabled={getTransactionsRequest.data?.after === undefined  || getTransactionsRequest.fetching}
			>
				<div className="transactions-list">
					<div className="transactions-wrapper">
						{(getTransactionsRequest.fetching ? new Array(5).fill(defaultTransaction) : getTransactionsRequest.data?.data || []).map((txn, i) => (
							<TransactionItem
								key={i}
								transaction={txn}
								onActionClick={() => {
									setSelectedTransaction(txn)
									setDetailsOpen(true)
								}}
							/>
						))}
					</div>
				</div>
				<TransactionDetails
					transaction={selectedTransaction}
					open={detailsOpen}
					onClose={() => setDetailsOpen(false)}
				/>
			</Pagination>
		</Loader>
	)
}

export default TransactionList

export type TransactionItemProps = {
	transaction: Transaction,
	onActionClick: (txn: Transaction) => void
}

const statusColorMap: Record<Transaction["status"], [string, string]> = {
	completed: ["bg-success-main", "text-success-contrastText"],
	expired: ["bg-error-main", "text-error-contrastText"],
	failed: ["bg-error-main", "text-error-contrastText"],
	pending: ["bg-warning-main", "text-warning-contrastText"],
	processing: ["bg-info-main", "text-info-contrastText"],
}

export const TransactionItem: Component<TransactionItemProps> = ({ transaction, onActionClick }) => {
	const paymentToken = apiToCurrency(transaction.payment_token)
	const { currentProject } = useContext(ProjectContext)

	return (
		<div
			className="transaction-item flex-gap-x-1"
		>
			<span className="item-value token-value">
				<Loadable component="img" className="token-image" src={paymentToken.imageUrl || placeholder.tokenImage } />
			</span>
			<span className="item-value">
				<div className="value-group">
					<Loadable component="span">
						{formatLargeNumber(transaction.initial_purchase_amount_crypto)} 
						{" "}{paymentToken.symbol}
					</Loadable>
					<Loadable component="span" className="value-sub">
						${formatLargeNumber(transaction.initial_purchase_amount_fiat)}
					</Loadable>
				</div>
			</span>
			<span className="item-value">
				<div className="value-group">
					<Loadable component="span">
						{formatLargeNumber(transaction.tokens.total)} {currentProject?.symbol}
					</Loadable>
					<Loadable component="span" className="value-sub">
						${formatLargeNumber(transaction.tokens.total * transaction.token_price, 1000, 0, 2)}
					</Loadable>
				</div>
			</span>
			<span className="item-value">
				<div className="value-group">
					<Loadable component={Chip} compact className={clsx(statusColorMap[transaction.status], "font-normal w-22 justify-center mr-1")}>
						{capitalize(transaction.status)}
					</Loadable>
				</div>
			</span>
			<span className="item-value action-value">
				{transaction.status === "pending" && (
					<Button
						rounded
						type="button"
						className="!px-3 !py-1 text-sm w-full"
						color="primary"
						buttonStyle={transaction.status === "pending" ? "contained" : "outlined"}
						onClick={(e) => {
							e.stopPropagation()
							onActionClick(transaction)
						}}
					>
						{transaction.status === "pending" ? "Pay" : "Details"}
					</Button>
				)}
			</span>
		</div>
	)
}

export type TransactionDetailsProps = DialogProps & {
	transaction?: Transaction
}

export const TransactionDetails: Component<TransactionDetailsProps> = ({ transaction, ...others }) => {
	const inputRef = useRef<HTMLInputElement>()

	const apiToken: CurrencyItem | Record<string, any> = transaction?.payment_token ? apiToCurrency(transaction?.payment_token) : {}

	return (
		<Dialog {...others} className={clsx("transaction-details", others.className)}>
			<Card className="transaction-details">
				<CardTitle center>
					Transaction
				</CardTitle>
				<CardBody className="transaction-details-body flex-gap-y-2">
					{transaction?.status === "pending" && (
						<div className="pending-container">
							<QRCodeCanvas size={160} className="qr-code" value={getWalletQRValue(transaction.payment_token, transaction.payment_address)} />
							
							<div className="warning">
								<span className="warning-wrapper">
								<WarningIcon />
									Make sure you pay <span className="font-semibold">
										{transaction.initial_purchase_amount_crypto} {transaction.payment_token.short_name}
									</span> to the address below on the <span className="font-semibold">
										{apiToken?.chain || ""}
									</span> blockchain.
								</span>
							</div>
						</div>
					)}
					<div className="form-item">
						<label htmlFor="wallet-address">Wallet Address</label>
						<Input
							ref={(el) => inputRef.current = (el || undefined)}
							value={transaction?.payment_address}
							id="wallet-address"
							copyable
						/>
					</div>
					<div className="form-item">
						<label htmlFor="crypto-amount">Amount to Pay</label>
						<Input
							ref={(el) => inputRef.current = (el || undefined)}
							value={transaction?.initial_purchase_amount_crypto}
							id="crypto-amount"
							copyable
						/>
					</div>
					
					<div className="form-item">
						<label htmlFor="crypto-amount">Token to Pay With</label>
						{apiToken && (
							<CurrencyItemDisplay
								currencyItem={apiToken as CurrencyItem}
								className="rounded-item w-full bg-background-contrast py-3"
								fullDetails
							/>
						)}
					</div>
				</CardBody>
			</Card>
		</Dialog>
	)
}