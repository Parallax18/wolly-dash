import axios, { Axios, AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, AxiosResponseHeaders, Method } from "axios"
import { Accessor, batch, createEffect, createSignal, useContext } from "solid-js";
import { minMax } from ".";
import { APIError, LoginResponse, User } from "../types/Api";
import { AuthContext } from "../context/AuthContext";

export type URLString = `http://${string}.${string}` | `https://${string}.${string}` | `/${string}`
export type CreateRequestOptions = AxiosRequestConfig & {
	method?: Method
}

export interface CreateRequestResponse<T = Record<string, unknown>, K = (options?: AxiosRequestConfig) => Promise<AxiosResponse>> {
	progress: Accessor<number>;
	uploadProgress: Accessor<number>;
	downloadProgress: Accessor<number>;
	data: Accessor<T | null | undefined>;
	dataHistory: Accessor<DataHistoryItem<T | null | undefined>[]>;
	requestStatus: Accessor<RequestStatus>;
	responseStatusCode: Accessor<number | undefined>;
	sendRequest: K;
	fetching: Accessor<boolean>;
	fetchedAt: Accessor<number>;
	finished: Accessor<boolean>;
	success: Accessor<boolean>;
	error: Accessor<string | undefined>;
  }

export type RequestStatus = "NOT_STARTED" | "UPLOADING" | "DOWNLOADING" | "FINISHED";
export type DataHistoryItem<T> = {
	utcReceived: number,
	data: T
}

const baseUrl = import.meta.env.APP_API_BASE_URL;

export const createRequest = <T>(url: URLString, options: CreateRequestOptions = {}): CreateRequestResponse<T> => {
	const [uploadProgress, setUploadProgress] = createSignal(0)
	const [downloadProgress, setDownloadProgress] = createSignal(0)
	const [progress, setProgress] = createSignal(0)

	const [requestStatus, setRequestStatus] = createSignal<RequestStatus>("NOT_STARTED")
	const [responseStatusCode, setResponseStatusCode] = createSignal<number>()

	const [fetching, setFetching] = createSignal(false)
	const [fetchedAt, setFetchedAt] = createSignal(0)
	const [finished, setFinished] = createSignal(true)
	const [success, setSuccess] = createSignal(true)
	const [error, setError] = createSignal<string>();

	const [data, setData] = createSignal<T | null>();
	const [dataHistory, setDataHistory] = createSignal<DataHistoryItem<T>[]>([]);

	const addDataToHistory = (dataToAdd: T | null | undefined) => {
		let newUtc = Date.now()
		if (!dataToAdd) return;
		setDataHistory((dataHistory) => {
			let newHistory: DataHistoryItem<T>[] = [...(dataHistory || []), {
				utcReceived: newUtc,
				data: dataToAdd
			}].sort((a, b) => a.utcReceived - b.utcReceived)
			return newHistory
		})
	}

	createEffect(() => {
		addDataToHistory(data())
	})

	createEffect(() => {
		setProgress(
			Math.min(uploadProgress() * 0.5 + downloadProgress() * 0.5, 1)
		)
	})

	const headers: AxiosRequestHeaders = options.headers || {}

	const createProgressFunction = (signalUpdateFunc: (num: number) => void) => {
		return (progress: ProgressEvent) => {
			if (!progress.loaded && requestStatus() !== "UPLOADING") setRequestStatus("UPLOADING")

			const target = progress.target as XMLHttpRequest;
			let totalLength: number = 1;
			if (progress.lengthComputable) totalLength = progress.total;
			else totalLength = Number.parseInt(target.getResponseHeader("content-length") || "0") || 1;

			const newProgress: number = minMax(progress.loaded / totalLength, 0, 1)
			signalUpdateFunc(newProgress)
		}
	}

	const requestBaseURL = url.startsWith("http") ? "" : baseUrl

	const axiosInstance = axios.create({
		baseURL: requestBaseURL,
		onUploadProgress: createProgressFunction(setUploadProgress),
		onDownloadProgress: createProgressFunction(setDownloadProgress),
		method: "GET",
		headers,
		...options,
		transformResponse: (data: any, headers?: AxiosResponseHeaders) => {
			if (typeof(data) == "string") {
				if (headers && (headers["content-type"].includes("text/plain") || headers["content-type"].includes("application/json"))) {
					data = JSON.parse(data)
				}
			}
			if (options.transformResponse) {
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
	const sendRequest = async (newOptions: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
		return new Promise((resolve, reject) => {
			batch(() => {
				setUploadProgress(0)
				setDownloadProgress(0)
				setFetching(true)
				setSuccess(false)
				setFinished(false)
				setError(undefined)
				setData(null)
				setRequestStatus("UPLOADING")
				setResponseStatusCode(undefined)
			})

			newOptions.url = requestBaseURL + url + (newOptions.url || "")

			axiosInstance(newOptions || {})
				.then((res: AxiosResponse) => {
				let now = Date.now();
				if (lastReceived > now) return reject("Completed too late");
				lastReceived = now;
				batch(() => {
					setFetching(false)
					setSuccess(true)
					setProgress(1)
					setResponseStatusCode(res.status)
					setFinished(true)
					setData(res.data)
					setFetchedAt(Date.now())
				})
				resolve(res)
			}).catch((error: AxiosError<any>) => {
				console.warn(error)
				let responseError: APIError = error?.response?.data?.error || {
					code: 400,
					message: "Internal server error",
				}
				console.warn(responseError.message)
				if (error?.response?.data?.code) {
					responseError.code = error.response.data.code
				}
				if (error?.response?.data?.message) {
					responseError.message = error.response.data.message
				}

				batch(() => {
					setFetching(false)
					setProgress(1)
					setUploadProgress(1)
					setDownloadProgress(1)
					setSuccess(false)
					setFinished(true);
					setError(error.response?.data.message || error.message)
					setResponseStatusCode(error.response?.status)
					setFetchedAt(Date.now())
				})
				reject(responseError)
			})
		})
	}

	let returnVal: CreateRequestResponse<T> = {
		progress, uploadProgress, downloadProgress,
		data, dataHistory,
		requestStatus, responseStatusCode,
		sendRequest,
		finished, fetching, fetchedAt, success, error
	}

	return returnVal;
}

export const createAuthRequest = <T>(url: URLString, options: CreateRequestOptions = {}): CreateRequestResponse<T> => {
	const request: CreateRequestResponse<T> = createRequest<T>(url, options)
	const [ authStore, authFuncs ] = useContext(AuthContext)

	const newSendRequest = (newOptions: AxiosRequestConfig = {}, token?: string): Promise<AxiosResponse> => {
		let totalOptions = {
			...options,
			...newOptions,
			headers: {
				...(options.headers || {}),
				...(newOptions.headers || {}),
			}
		}
		//TODO: AUTH STUFF
		totalOptions.headers.Authorization = `Bearer ${authStore.tokens?.access.token}`

		return new Promise((resolve, reject) => {
			request.sendRequest(totalOptions).then((data) => {
				resolve(data)
			}).catch((error) => {
				if (error.response?.status === 401 && authFuncs) {
					authFuncs.refreshTokens().then((tokenData: any) => {
						newSendRequest(totalOptions, tokenData.token).then((newData) => {
							resolve(newData)
						}).catch((err) => {
							reject(err)
						})
					})
				} else {
					reject(error)
				}
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

export const createRegisterRequest = (): CreateRequestResponse<
	LoginResponse,
	(args: UserArgs) => Promise<AxiosResponse<LoginResponse>>
> => {
	const request = createRequest<LoginResponse>("/auth/register")

	const sendRequest = (args: UserArgs) => {
		return request.sendRequest({
			method: "POST",
			data: args
		})
	}

	return { ...request, sendRequest }
}

export const createLoginRequest = (): CreateRequestResponse<
	LoginResponse,
	(email: string, password: string) => Promise<AxiosResponse<LoginResponse>>
> => {
	const request = createRequest<LoginResponse>("/auth/login")

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

export const createEditUserRequest = (): CreateRequestResponse<
	User,
	(userId: string, args: Partial<UserArgs>) => Promise<AxiosResponse<User>>
> => {
	const request = createAuthRequest<User>("/users")

	const sendRequest = (userId: string, args: Partial<UserArgs>) => {
		return request.sendRequest({
			method: "PATCH",
			url: "/" + userId,
			data: args
		})
	}

	return { ...request, sendRequest }
}