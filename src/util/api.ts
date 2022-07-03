import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, AxiosResponseHeaders, Method } from "axios"
import { minMax } from "./number";

import { MutableRefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { AuthContext } from "../context/AuthContext";
import { APIError, BonusCalculations, LoginResponse, MinimumAmountResponse, PriceChartResponse, PricesResponse, Project, Stage, Tokens, Transaction, TransactionsResponse, User } from "../types/Api";

export type URLString = `http://${string}.${string}` | `https://${string}.${string}` | `/${string}`
export type CreateRequestOptions = AxiosRequestConfig & {
	method?: Method
}

export type CreateRequestResponse<T, K, Q = Record<string, unknown>> = {
	progress: number;
	uploadProgress: number;
	downloadProgress: number;
	data: T | null | undefined;
	requestData: Q | null | undefined;
	dataHistory: DataHistoryItem<T | null | undefined>[];
	requestStatus: RequestStatus;
	responseStatusCode: number | undefined;
	sendRequest: K;
	fetching: boolean;
	finished: boolean;
	success: boolean;
	error: string | undefined;
	fetchedAt: number;
  }

export type RequestStatus = "NOT_STARTED" | "UPLOADING" | "DOWNLOADING" | "FINISHED";
export type DataHistoryItem<T> = {
	utcReceived: number,
	data: T
}

const baseUrl = import.meta.env.REACT_APP_API_BASE_URL;

export const useRequest = <T = Record<string, unknown>, K = Record<string, unknown>>(url: URLString, options?: CreateRequestOptions): CreateRequestResponse<T, (options: AxiosRequestConfig) => Promise<AxiosResponse<T>>, K> => {
	const unmountedRef = useRef(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const [downloadProgress, setDownloadProgress] = useState(0)
	const [progress, setProgress] = useState(0)
	const [fetchedAt, setFetchedAt] = useState(0)

	const [requestStatus, setRequestStatus] = useState<RequestStatus>("NOT_STARTED")
	const [responseStatusCode, setResponseStatusCode] = useState<number>()

	const [fetching, setFetching] = useState(false)
	const [finished, setFinished] = useState(true)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState<string>();

	const [data, setData] = useState<T | null>();
	const [requestData, setRequestData] = useState<K>()
	const [dataHistory, setDataHistory] = useState<DataHistoryItem<T>[]>([]);

	const addDataToHistory = useCallback((dataToAdd: T | null | undefined) => {
		let newUtc = Date.now()
		if (!dataToAdd) return;
		let newHistory: DataHistoryItem<T>[] = [...(dataHistory || []), {
			utcReceived: newUtc,
			data: dataToAdd
		}].sort((a, b) => a.utcReceived - b.utcReceived)
		setDataHistory(newHistory)
	}, [dataHistory])

	useEffect(() => {
		addDataToHistory(data)
	}, [data])

	// useEffect(() => (() => {unmountedRef.current = true}), [])

	useEffect(() => {
		setProgress(
			Math.min(uploadProgress * 0.5 + downloadProgress * 0.5, 1)
		)
	}, [uploadProgress, downloadProgress])

	const headers: AxiosRequestHeaders = {
		"Content-Type": "application/json",
		...(options?.headers || {})
	}

	const createProgressFunction = (signalUpdateFunc: (num: number) => void) => {
		return (progress: ProgressEvent) => {
			if (!progress.loaded && requestStatus !== "UPLOADING") setRequestStatus("UPLOADING")

			const target = progress.target as XMLHttpRequest;
			let totalLength: number = 1;
			if (progress.lengthComputable) totalLength = progress.total;
			else totalLength = Number.parseInt(target.getResponseHeader("content-length") || "0") || 1;

			const newProgress: number = minMax(progress.loaded / totalLength, 0, 1)
			signalUpdateFunc(newProgress)
		}
	}

	const axiosInstance = axios.create({
		baseURL: url.startsWith("http") ? "" : baseUrl,
		onUploadProgress: createProgressFunction(setUploadProgress),
		onDownloadProgress: createProgressFunction(setDownloadProgress),
		method: "GET",
		headers,
		...options,
		transformResponse: (data: any, headers?: AxiosResponseHeaders) => {
			if (typeof(data) == "string" && data !== "") data = JSON.parse(data)
			if (options && options.transformResponse) {
				if (Array.isArray(options.transformResponse)) {
					data = options.transformResponse.reduce((prevValue, currentTransformer, i) => {
						data = currentTransformer(data, headers)
					}, data)
				} else {
				 	data = options.transformResponse(data, headers)
				}
			}
			return data;
		}
		
	})

	let lastReceived = 0;
	const sendRequest = async (newOptions?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
		setUploadProgress(0)
		setDownloadProgress(0)
		setRequestData(newOptions?.data)
		setFetching(true)
		setSuccess(false)
		setFinished(false)
		setError(undefined)
		setRequestStatus("UPLOADING")
		setResponseStatusCode(undefined)
		return new Promise((resolve, reject) => {

			axiosInstance({...(newOptions || {}), url: url + (newOptions?.url || "")})
				.then((res: AxiosResponse<T>) => {
					if (unmountedRef.current) return;
					let now = Date.now();
					if (lastReceived > now) return reject("Completed too late");
					lastReceived = now;

					setFetchedAt(now)
					setFetching(false)
					setSuccess(true)
					setProgress(1)
					setResponseStatusCode(res.status)
					setFinished(true)
					setData(res.data || null)

					resolve(res)
			}).catch((error: AxiosError) => {
				if (unmountedRef.current) return;
				let responseError: APIError = error?.response?.data as APIError || {
					code: 500,
					message: "Internal server error",
				}
				console.error("ERROR IN API:")
				console.error(responseError.message)

				setFetchedAt(Date.now())
				setFetching(false)
				setProgress(1)
				setUploadProgress(1)
				setDownloadProgress(1)
				setSuccess(false)
				setFinished(true);
				setError((error?.response?.data as APIError)?.message || error?.message)
				setResponseStatusCode(error?.response?.status)

				reject(responseError)
			})
		})
	}

	let returnVal: CreateRequestResponse<T, (options: AxiosRequestConfig) => Promise<AxiosResponse<T>>, K> = {
		progress, uploadProgress, downloadProgress,
		data, requestData, dataHistory,
		requestStatus, responseStatusCode,
		sendRequest,
		finished, fetching, success, error,
		fetchedAt
	}

	return returnVal;
}

export const useAuthRequest = <T = Record<string, unknown>, K = Record<string, unknown>>(url: URLString, options: CreateRequestOptions = {}, suppliedTokenRef?: MutableRefObject<Tokens>): CreateRequestResponse<T, (newOptions?: AxiosRequestConfig) => Promise<AxiosResponse>, K> => {
	const request: CreateRequestResponse<T, (options: AxiosRequestConfig) => Promise<AxiosResponse<T>>, K> = useRequest<T, K>(url, options)
	const { tokensRef, tokens, refreshTokens } = useContext(AuthContext)
	
	const newSendRequest = async (newOptions: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
		let totalOptions = {
			...options,
			...newOptions
		}

		let token = (suppliedTokenRef || tokensRef).current?.access?.token;
		let expires = (suppliedTokenRef || tokensRef).current?.access?.expires

		if (!expires || Date.now() > new Date(expires || 0).getTime()) {
			let success = true
			let error = false
			let tokenRes = await refreshTokens().catch((err) => {
				error = err
				success = false
			});
			if (!success) {
				return Promise.reject(error)
			}
			tokenRes = tokenRes as AxiosResponse<Tokens>
			token = tokenRes.data?.access?.token
		}

		if (!totalOptions.headers) totalOptions.headers = {}
		if (!token) return Promise.reject({
			code: 401
		});
		totalOptions.headers["Authorization"] = "BEARER " + token

		return new Promise((resolve, reject) => {
			request.sendRequest(totalOptions)
				.then((res) => resolve(res))
				.catch((err: AxiosError) => {
					if (err.code?.toString() === "401") {
						refreshTokens()
							.then((res) => {
								return request.sendRequest({
									...totalOptions,
									headers: {
										...totalOptions.headers,
										"Authorization": "BEARER " + res.data.access?.token
									}
								})
							.catch((err: AxiosError) => reject(err))
									.then((res) => resolve(res as AxiosResponse<T>))
									.catch((err: AxiosError) => reject(err))
							})
					}
					reject(err)
				})
		})
	}

	return {
		...request,
		sendRequest: newSendRequest
	}
}

export interface UserArgs {
	email: string,
	first_name: string,
	last_name: string,
	nationality: string,
	password: string,
	mobile?: string,
}

export const useRegisterRequest = (): CreateRequestResponse<
	LoginResponse,
	(args: UserArgs) => Promise<AxiosResponse<LoginResponse>>,
	UserArgs
> => {
	const request = useRequest<LoginResponse, UserArgs>("/auth/register")

	const sendRequest = (args: UserArgs) => {
		return request.sendRequest({
			method: "POST",
			data: args
		})
	}

	return { ...request, sendRequest }
}

export const useLoginRequest = (): CreateRequestResponse<
	LoginResponse,
	(email: string, password: string) => Promise<AxiosResponse<LoginResponse>>,
	{email: string, password: string}
> => {
	const request = useRequest<LoginResponse, {email: string, password: string}>("/auth/login")

	const sendRequest = (email: string, password: string) => {
		return request.sendRequest({
			method: "POST",
			data: {
				email, password
			}
		})
	}

	return { ...request, sendRequest }
}

export const useEditUserRequest = (): CreateRequestResponse<
	User,
	(userId: string, args: Partial<UserArgs>) => Promise<AxiosResponse<User>>,
	Partial<UserArgs>
> => {
	const request = useAuthRequest<User, Partial<UserArgs>>("/users")

	const sendRequest = (userId: string, args: Partial<UserArgs>) => {
		return request.sendRequest({
			method: "PATCH",
			url: "/" + userId,
			data: args
		})
	}

	return { ...request, sendRequest }
}

export type GetUserRequest = CreateRequestResponse<
	User,
	(userId: string, accessToken?: string) => Promise<AxiosResponse<User>>
>

export const useGetUserRequest = (suppliedTokenRef?: MutableRefObject<Tokens>): GetUserRequest => {
	const request = useAuthRequest<User>("/users", {}, suppliedTokenRef)

	const sendRequest = (userId: string) => {
		return request.sendRequest({
			url: "/" + userId
		})
	}

	return { ...request, sendRequest }
}

export const useRefreshTokensRequest = (suppliedTokenRef?: MutableRefObject<Tokens>): CreateRequestResponse<
	Tokens,
	(refreshToken: string) => Promise<AxiosResponse<Tokens>>,
	{refreshToken: string}
> => {
	const request = useAuthRequest<Tokens, {refreshToken: string}>("/auth/refresh-tokens", {}, suppliedTokenRef)

	const sendRequest = (refreshToken: string) => {
		return request.sendRequest({
			method: "POST",
			data: {
				refreshToken
			}
		})
	}

	return { ...request, sendRequest }
}

export type GetActiveStageRequest = CreateRequestResponse<
	Stage,
	() => Promise<AxiosResponse<Stage>>
>

export const useGetActiveStages = (): GetActiveStageRequest => {
	const request = useRequest<Stage>("/stages/active")

	const sendRequest = () => {
		return request.sendRequest({})
	}

	return { ...request, sendRequest }
}


export const useGetPrices = (): CreateRequestResponse<
	PricesResponse,
	() => Promise<AxiosResponse<PricesResponse>>
> => {
	const request = useAuthRequest<PricesResponse>("/prices")

	const sendRequest = () => {
		return request.sendRequest({})
	}

	return { ...request, sendRequest }
}

export const useGetCurrentProject = (): CreateRequestResponse<
	Project,
	() => Promise<AxiosResponse<Project>>
> => {
	const request = useRequest<Project>("/projects/current")

	const sendRequest = () => {
		return request.sendRequest({})
	}

	return { ...request, sendRequest }
}

export interface BonusCalculationArgs {
	purchase_token_id: string,
	purchase_amount: number,
	token_price: number,
	bonuses: Stage["bonuses"]
}

export const useBonusCalculations = (): CreateRequestResponse<
	BonusCalculations,
	(args: BonusCalculationArgs) => Promise<AxiosResponse<BonusCalculations>>,
	BonusCalculationArgs
> => {
	const request = useAuthRequest<BonusCalculations, BonusCalculationArgs>("/calculations/bonus")

	const sendRequest = (args: BonusCalculationArgs) => {
		return request.sendRequest({
			method: "POST",
			data: args
		})
	}

	return { ...request, sendRequest }
}

export interface CreateTransactionArgs {
	purchase_token_id: string,
	purchase_amount: number
}

export type CreateTransactionRequest = CreateRequestResponse<
	Transaction,
	(args: CreateTransactionArgs) => Promise<AxiosResponse<Transaction>>,
	CreateTransactionArgs
>

export const useCreateTransaction = (): CreateTransactionRequest => {
	const request = useAuthRequest<Transaction, CreateTransactionArgs>("/transactions")

	const sendRequest = (args: CreateTransactionArgs) => {
		return request.sendRequest({
			method: "POST",
			data: args
		})
	}

	return { ...request, sendRequest }
}

export type GetTransactionsRequest = CreateRequestResponse<
	TransactionsResponse,
	(userId: string) => Promise<AxiosResponse<TransactionsResponse>>
>

export const useGetTransactions = (): GetTransactionsRequest => {
	const request = useAuthRequest<TransactionsResponse>("/users")

	const sendRequest = (userId: string) => {
		return request.sendRequest({
			url: "/" + userId + "/transactions",
			params: {
				limit: 2
			}
		})
	}

	return { ...request, sendRequest }
}

export type GetMinimumAmountRequest = CreateRequestResponse<
	MinimumAmountResponse,
	(token_id: string) => Promise<AxiosResponse<MinimumAmountResponse>>
>

export const useGetMinimumAmount = (): GetMinimumAmountRequest => {
	const request = useAuthRequest<MinimumAmountResponse>("/tokens")

	const sendRequest = (token_id: string) => {
		return request.sendRequest({
			url: "/" + token_id + "/minimum-amount"
		})
	}

	return { ...request, sendRequest }
}


export type ForgotPasswordRequest = CreateRequestResponse<
	null,
	(email: string) => Promise<AxiosResponse<null>>
>

export const useForgotPasswordRequest = (): ForgotPasswordRequest => {
	const request = useRequest<null>("/auth/forgot-password")

	const sendRequest = (email: string) => {
		return request.sendRequest({
			method: "POST",
			data: {
				email
			}
		})
	}

	return { ...request, sendRequest }
}

export type ResetPasswordRequest = CreateRequestResponse<
	null,
	(token: string, newPassword: string) => Promise<AxiosResponse<null>>
>

export const useResetPasswordRequest = (): ResetPasswordRequest => {
	const request = useRequest<null>("/auth/reset-password")

	const sendRequest = (token: string, newPassword: string) => {
		return request.sendRequest({
			method: "POST",
			data: {
				token,
				password: newPassword
			}
		})
	}

	return { ...request, sendRequest }
}

export type PriceChartPeriod = "day" | "week" | "month" | "all"

export type PriceChartRequest = CreateRequestResponse<
	PriceChartResponse,
	(period: PriceChartPeriod) => Promise<AxiosResponse<PriceChartResponse>>
>

export const usePriceChartRequest = (): PriceChartRequest => {
	const request = useRequest<PriceChartResponse>("/price-chart")

	const sendRequest = (period: PriceChartPeriod) => {
		return request.sendRequest({
			params: {
				period
			}
			
		})
	}

	return { ...request, sendRequest }
}