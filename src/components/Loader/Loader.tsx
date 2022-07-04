import clsx from "clsx"
import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { Component, ComponentType } from "../../types/Util"
import { useRandom, useRandoms } from "../../util"
import "./Loader.css"

export interface LoaderProps {
	loading: boolean
}

export interface LoaderContext {
	loading: boolean
}

const defaultValue = { loading: false }

export const LoaderContext = createContext<LoaderContext>(defaultValue)

export const Loader: Component<LoaderProps> = (props) => {
	return (
		<LoaderContext.Provider value={{loading: props.loading}}>
			{props.children}
		</LoaderContext.Provider>
	)
}

export type LoadableProps = {
	component?: ComponentType
	variant?: "text" | "block" | "none",
	loadStyles?: Record<string, any>,
	loadElement?: JSX.Element,
	loadClass?: string,
	full?: boolean,
	length?: number,
	invisible?: boolean
	[key: string]: any
} & React.HTMLAttributes<HTMLElement>

export const Loadable: Component<LoadableProps> = ({
	component, children, loadStyles,
	loadElement, variant, loadClass = {},
	full, length, invisible, ...others
}) => {
	const loadValue = useContext(LoaderContext)
	const compRef = useRef<HTMLElement>()

	useEffect(() => {
		let comp = compRef.current
		if (!comp) return;
		const { height } = comp.getBoundingClientRect()
		const style = getComputedStyle(comp)
		setHeights({
			height: `${height}px`,
			line: style.lineHeight
		})
	}, [compRef.current])

	const [ heights, setHeights ] = useState({
		line: "1.5em",
		height: "1em"
	})

	const allowedLoaderElements: (keyof JSX.IntrinsicElements)[] = [
		"a", "p", "h1", "h2", "h3", "h4", "h5", "h6", "label",
		"span"
	]

	let allowedComponent = allowedLoaderElements.includes(component as keyof JSX.IntrinsicElements)

	let newVariant = variant === undefined ? (allowedComponent ? "text" : "block") : variant

	const LoadingComponent = (allowedComponent ? component : "div") as Component<any>

	const Comp = component as Component<any>

	const random = useRandom(3, 7)
	
	const margin = newVariant === "text" && `calc((${heights.line} - ${heights.height}) / 2)`

	return (
		<>
			{loadElement !== undefined && loadValue.loading && (
				<LoadingComponent
					ref={(el: HTMLElement) => compRef.current = el}
					className={clsx(
						"loadable", "transform", newVariant, loadClass,
						others.className, {
							full: full, invisible: invisible
						}
					)}
					style={{
						...loadStyles,
						"--length": `${length || random}em`,
						marginTop: margin,
						marginBottom: margin
					}}
				>
					{loadElement}
				</LoadingComponent>
			)}
			{loadValue.loading && (
				<LoadingComponent
					ref={(el: HTMLElement) => compRef.current = el}
					className={clsx(
						"loadable", "transform", newVariant, loadClass,
						others.className, {
							full: full, invisible: invisible
						}
					)}
					style={{
						...loadStyles,
						"--length": `${length || random}em`,
						marginTop: margin,
						marginBottom: margin
					}}
				/>
			)}
			{!component && !loadValue.loading && children}
			{component && !loadValue.loading && (
				<Comp
					{...others}
					component={component}
				>
					{children}
				</Comp>
			)}
		</>
	)
}

export type LoadableParagraphProps = {
	length: number,
	component?: Component<any> | keyof JSX.IntrinsicElements,
	loadClass?: string
} & React.HTMLAttributes<HTMLElement>

export const LoadableParagraph: Component<LoadableParagraphProps> = ({
	length, component, children,
	loadClass, ...others
}) => {
	const randoms = useRandoms(length, 3.5, 8)

	return (
		<Loadable
			{...others}
			variant={"none"}
			component={component || "p"}
			loadClass="paragraph-container overflow-hidden"
			loadElement={
				<div className={clsx("flex-gap-x-1.5", "overflow-x-hidden", loadClass)}>
					{new Array(length).fill(0).map((_, i) => (
						<div key={i} className="loadable text" style={{
							["--length" as any]: `${randoms[i]}rem`
						}} />
					))}
				</div>
			}
		>{children}</Loadable>	)
}

export const HideOnLoad: Component = (props) => {
	const loadingValue = useContext(LoaderContext)

	return (
		<>
			{loadingValue.loading  && props.children}
		</>
	)
}