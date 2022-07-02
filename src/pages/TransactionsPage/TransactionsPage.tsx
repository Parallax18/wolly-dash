import clsx from "clsx"
import React, { useContext, useEffect, useRef, useState } from "react"
import Button from "../../components/Button"
import Card, { CardBody, CardTitle } from "../../components/Card"
import Chip from "../../components/Chip"
import Dialog, { DialogProps } from "../../components/Dialog"
import Page from "../../components/Page"
import { TransactionsContext } from "../../context/TransactionsContext"
import { Transaction } from "../../types/Api"
import { Component } from "../../types/Util"
import { apiToCurrency, capitalize, CurrencyItem, formatLargeNumber, getWalletQRValue } from "../../util"

import { QRCodeCanvas } from "qrcode.react"

import "./TransactionsPage.css"
import Input from "../../components/Input"
import IconButton from "../../components/IconButton"

import CopyIcon from "../../svg/icons/copy.svg"
import { AlertContext } from "../../context/AlertContext"
import { CurrencyItemDisplay } from "../../components/BuyPage"
import WarningIcon from "../../svg/icons/warning.svg"
import { useParams } from "react-router"
import { Loadable, Loader } from "../../components/Loader"
import { defaultTransaction } from "../../defaults/Api"

const TransactionsPage: Component = () => {
	const { transactions, getTransactionsRequest } = useContext(TransactionsContext)
	const { id } = useParams()
	const [ selectedTransaction, setSelectedTransaction ] = useState<Transaction | undefined>(transactions.find((txn) => txn.id === id))
	const [ detailsOpen, setDetailsOpen ] = useState(false)

	return (
		<Page path="/transactions" title="Transactions">
			<div className="transactions-page">
				<div className="transactions-list flex-gap-y-4">
					<Loader loading={getTransactionsRequest.fetching }>
						<Card className="transaction-item transaction-item-title flex-gap-x-2" >
							<span className="item-value token-value">Payment Token</span>
							<span className="item-value">Crypto Amount</span>
							<span className="item-value">Fiat Amount</span>
							<span className="item-value">Status</span>
							<span className="item-value">Wallet Address</span>
							<span className="item-value"></span>
						</Card>
						{(getTransactionsRequest.fetching ? new Array(4).fill(defaultTransaction) : transactions).map((txn, i) => (
							<TransactionItem
								key={i}
								transaction={txn}
								onActionClick={() => {
									setSelectedTransaction(txn)
									setDetailsOpen(true)
								}}
							/>
						))}
					</Loader>
				</div>
			</div>
			<TransactionDetails
				transaction={selectedTransaction}
				open={detailsOpen}
				onClose={() => setDetailsOpen(false)}
			/>
		</Page>
	)
}

export default TransactionsPage

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

	return (
		<Card className="transaction-item flex-gap-x-2" >
			<span className="item-value token-value">
				<Loadable component="img" className="token-image" src={paymentToken.imageUrl} />
				<Loadable component="span">
					{paymentToken.symbol}
				</Loadable>
			</span>
			<span className="item-value">
				<Loadable component="span">
					{formatLargeNumber(transaction.initial_purchase_amount_crypto)}
				</Loadable>
			</span>
			<span className="item-value">
				<Loadable component="span">
					${formatLargeNumber(transaction.initial_purchase_amount_fiat)}
				</Loadable>
			</span>
			<span className="item-value">
				<Loadable component="span">
					<Chip compact className={clsx(statusColorMap[transaction.status])}>
						{capitalize(transaction.status)}
					</Chip>
				</Loadable>
			</span>
			<span className="item-value">
				<Loadable component="span">
					{transaction.payment_address.substring(0, 8)}...
				</Loadable>
			</span>
			<span className="item-value">
				{transaction.status === "pending" && (
					<Button
						rounded
						type="button"
						className="!px-3 !py-1 text-sm w-20"
						color="primary"
						buttonStyle={transaction.status === "pending" ? "contained" : "outlined"}
						onClick={() => onActionClick(transaction)}
					>
						{transaction.status === "pending" ? "Pay" : "Details"}
					</Button>
				)}
			</span>
		</Card>
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