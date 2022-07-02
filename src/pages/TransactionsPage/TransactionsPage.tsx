import clsx from "clsx"
import React, { useContext, useRef, useState } from "react"
import Button from "../../components/Button"
import Card, { CardBody, CardTitle } from "../../components/Card"
import Chip from "../../components/Chip"
import Dialog, { DialogProps } from "../../components/Dialog"
import Page from "../../components/Page"
import { TransactionsContext } from "../../context/TransactionsContext"
import { Transaction } from "../../types/Api"
import { Component } from "../../types/Util"
import { apiToCurrency, capitalize, formatLargeNumber, getWalletQRValue } from "../../util"

import QRCode from "react-qr-code"

import "./TransactionsPage.css"
import Input from "../../components/Input"
import IconButton from "../../components/IconButton"

import CopyIcon from "../../svg/icons/copy.svg"
import { AlertContext } from "../../context/AlertContext"
import { CurrencyItemDisplay } from "../../components/BuyPage"
import WarningIcon from "../../svg/icons/warning.svg"

const TransactionsPage: Component = () => {
	const { transactions } = useContext(TransactionsContext)
	const [ selectedTransaction, setSelectedTransaction ] = useState<Transaction>()
	const [ detailsOpen, setDetailsOpen ] = useState(true)

	return (
		<Page path="/transactions" title="Transactions">
			<div className="transactions-page">
				<div className="transactions-list flex-gap-y-4">
					<Card className="transaction-item transaction-item-title flex-gap-x-2" >
						<span className="item-value token-value">
							Payment Token
						</span>
						<span className="item-value">
							Crypto Amount
						</span>
						<span className="item-value">
							Fiat Amount
						</span>
						<span className="item-value">
							Status
						</span>
						<span className="item-value">
							Wallet Address
						</span>
						<span className="item-value">
							
						</span>
					</Card>
					{[...transactions,...transactions].map((txn, i) => (
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
				transaction={transactions[0]}
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
				<img className="token-image" src={paymentToken.imageUrl} />
				<span>
					{paymentToken.symbol}
				</span>
			</span>
			<span className="item-value">
				{formatLargeNumber(transaction.initial_purchase_amount_crypto)}
			</span>
			<span className="item-value">
				${formatLargeNumber(transaction.initial_purchase_amount_fiat)}
			</span>
			<span className="item-value">
				<Chip compact className={clsx(statusColorMap[transaction.status])}>
					{capitalize(transaction.status)}
				</Chip>
			</span>
			<span className="item-value">
				{transaction.payment_address.substring(0, 8)}...
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
	const alertContext = useContext(AlertContext)

	if (!transaction) return <></>;

	const apiToken = apiToCurrency(transaction.payment_token)

	return (
		<Dialog {...others} className={clsx("transaction-details", others.className)}>
			<Card className="transaction-details">
				<CardTitle center>
					Transaction
				</CardTitle>
				<CardBody className="transaction-details-body flex-gap-y-2">
					{transaction.status === "pending" && (
						<div className="pending-container">
							<QRCode size={160} className="qr-code" value={getWalletQRValue(transaction.payment_token, transaction.payment_address)} />
							
							<div className="warning">
								<span className="warning-wrapper">
								<WarningIcon />
									Make sure you pay <span className="font-semibold">
										{transaction.initial_purchase_amount_crypto} {transaction.payment_token.short_name}
									</span> to the address below on the <span className="font-semibold">
										{apiToken.chain}
									</span> blockchain.
								</span>
							</div>
						</div>
					)}
					<div className="form-item">
						<label htmlFor="wallet-address">Wallet Address</label>
						<Input
							ref={(el) => inputRef.current = (el || undefined)}
							value={transaction.payment_address}
							id="wallet-address"
							copyable
						/>
					</div>
					<div className="form-item">
						<label htmlFor="crypto-amount">Amount to Pay</label>
						<Input
							ref={(el) => inputRef.current = (el || undefined)}
							value={transaction.initial_purchase_amount_crypto}
							id="crypto-amount"
							copyable
						/>
					</div>
					
					<div className="form-item">
						<label htmlFor="crypto-amount">Token to Pay With</label>
						<CurrencyItemDisplay
							currencyItem={apiToCurrency(transaction.payment_token)}
							className="rounded-item w-full bg-background-contrast py-3"
							fullDetails
						/>
					</div>
				</CardBody>
			</Card>
		</Dialog>
	)
}