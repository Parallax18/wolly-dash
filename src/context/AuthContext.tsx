import { AxiosError, AxiosResponse } from "axios"
import React, { createContext, MutableRefObject, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { Component } from "../types/Util"
import { Tokens, User } from "../types/Api"
import { useGetUserRequest, useLocalState, useLocalStateRef, useRefreshTokensRequest } from "../util"

export const AuthContext = createContext<AuthContextData>({
	tokens: {},
	tokensRef: {current: {}},
	user: null,
	loggedIn: false,
	setTokens: () => {},
	login: () => {},
	logout: () => {},
	refreshTokens: () => Promise.reject(),
	tokensFetchedAt: 0,
	updateUser: () => {}
})

export interface AuthContextData {
	tokens: Tokens,
	tokensRef: MutableRefObject<Tokens>,
	user: User | null,
	loggedIn: boolean,
	setTokens: (newTokens: Tokens) => void,
	login: (user: User, tokens: Tokens) => void,
	logout: () => void,
	refreshTokens: () => Promise<AxiosResponse<Tokens>>,
	tokensFetchedAt: number,
	updateUser: (newUserProps: Partial<User>) => void,
}

export const AuthContextWrapper: Component = ({ children }) => {
	const navigate = useNavigate()
	const [ tokens, setTokens, tokensRef ] = useLocalStateRef<Tokens>({}, "tokens")
	const [ user, setUser ] = useLocalState<User | null>(null, "user")
	const [ loggedIn, setLoggedIn ] = useLocalState<boolean>(false, "loggedIn")
	const refreshedUserRef = useRef(false)
	const refreshTokensRequest = useRefreshTokensRequest(tokensRef)
	
	const getUserRequest = useGetUserRequest(tokensRef)

	const refreshingRef = useRef(false)
	const refreshingPromiseRef = useRef<Promise<any> | null>(null)

	const logout = () => {
		setLoggedIn(false)
		setUser(null)
		navigate("/login", {replace: true})
	}

	useEffect(() => {
		if (refreshedUserRef.current) return
		if (!loggedIn || !user?.id || !tokens.access) return
		refreshedUserRef.current = true
		getUserRequest.sendRequest(user.id)
			.then((res) => {
				setUser((res as AxiosResponse).data as User)
			}).catch((err) => {
				console.log("ERR", err)
				if (err?.message === "Email must be verified" || err?.message === "Password change required") return
				logout()
			})
	}, [loggedIn, user])

	const AuthData: AuthContextData = {
		tokens, tokensRef, user, loggedIn, tokensFetchedAt: refreshTokensRequest.fetchedAt,
		setTokens,
		updateUser: (newUserProps: Partial<User>) => {
			if (user) {
				setUser({...user, ...newUserProps} as User)
			}
		},
		login: (newUser: User, tokens: Tokens) => {
			setLoggedIn(true)
			setUser(newUser)
			setTokens(tokens)
		},
		logout,
		refreshTokens: (): Promise<any> => {
			if (refreshingRef.current && refreshingPromiseRef.current !== null){
				return refreshingPromiseRef.current;
			}
			refreshingPromiseRef.current = new Promise((resolve, reject) => {
				refreshingRef.current = true
				if (!tokens.refresh?.token || Date.now() > new Date(tokens.refresh?.expires).getTime()) {
					AuthData.logout()
					console.log("LOGGING OUT DUE TO EXPIRED REFRESH")
					return Promise.reject();
				}
				refreshTokensRequest.sendRequest(tokens.refresh?.token)
					.then((res: AxiosResponse<Tokens, any> | AxiosError) => {
						res = res as AxiosResponse<Tokens, any>
						setTokens(res.data as Tokens)
						resolve(res)
					})
					.catch((err) => {

						AuthData.logout()
						console.error(err)
						reject(err)
					})
					.finally(() => {
						refreshingRef.current = false
						refreshingPromiseRef.current = null
					})
			})
			return refreshingPromiseRef.current
		}
	}

	return (
		<AuthContext.Provider value={AuthData}>
			{children}
		</AuthContext.Provider>
	)
}