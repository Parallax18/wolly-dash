import clsx from "clsx"
import React, { useContext, useState } from "react"
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
				<Button
					rounded
					type="button"
					className="!px-3 !py-1 text-sm w-20"
					color="primary"
					buttonStyle={transaction.status === "pending" ? "contained" : "outlined"}
					onClick={() => onActionClick()}
				>
					{transaction.status === "pending" ? "Pay" : "Details"}
				</Button>
			</span>
		</Card>
	)
}

export type TransactionDetailsProps = DialogProps & {
	transaction?: Transaction
}

export const TransactionDetails: Component<TransactionDetailsProps> = ({ transaction, ...others }) => {
	if (!transaction) return <></>;
	return (
		<Dialog {...others} className={clsx("transaction-details", others.className)}>
			<Card className="transaction-details">
				<CardTitle>
					Transaction
				</CardTitle>
				<CardBody>
					{transaction.status === "pending" && (
						<QRCode className="qr-code" value={getWalletQRValue(transaction.payment_token, transaction.payment_address)} />
					)}
				</CardBody>
			</Card>
		</Dialog>
	)
}