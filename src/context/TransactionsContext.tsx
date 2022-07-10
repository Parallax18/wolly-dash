import { AxiosResponse } from "axios"
import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { Transaction } from "../types/Api"
import { Component } from "../types/Util"
import { CreateTransactionArgs, CreateTransactionRequest, GetTransactionsRequest, useCreateTransaction, useGetTransactions } from "../util"
import { AuthContext } from "./AuthContext"

export const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData)

export interface TransactionsContextData {
	transactions: Transaction[],
	getTransactionsRequest: GetTransactionsRequest,
	createTransactionRequest: CreateTransactionRequest,
	createTransaction: (args: CreateTransactionArgs) => Promise<AxiosResponse<Transaction>>
}

export const TransactionsContextWrapper: Component = ({ children }) => {
	const { loggedIn, user } = useContext(AuthContext)
	const [ transactions, setTransactions ] = useState<Transaction[]>([])
	const getTransactionsRequest = useGetTransactions();
	const createTransactionRequest = useCreateTransaction();
	const fetchedRef = useRef(false)

	const getTransactions = () => {
		if (!loggedIn || !user) return;
		getTransactionsRequest.sendRequest(user.id).then((res) => {
			setTransactions(res.data.data)
		})
	}

	useEffect(() => {
		if (!loggedIn || !user || (fetchedRef.current && getTransactionsRequest.requestData?.userId === user.id)) return;
		fetchedRef.current = true
		getTransactions()
	}, [loggedIn, user])

	const createTransaction = (args: CreateTransactionArgs): Promise<AxiosResponse<Transaction>> => {
		return new Promise((resolve, reject) => {
			createTransactionRequest.sendRequest(args)
				.then((res) => {
					resolve(res)
					getTransactions()
				})
				.catch((err) => reject(err))
		})
	}

	const TransactionsData: TransactionsContextData = {
		transactions,
		getTransactionsRequest,
		createTransactionRequest,
		createTransaction
	}

	return (
		<TransactionsContext.Provider value={TransactionsData}>
			{children}
		</TransactionsContext.Provider>
	)
}