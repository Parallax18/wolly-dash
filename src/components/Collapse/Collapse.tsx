import clsx from "clsx"
import React, { useContext, useEffect, useRef, useState } from "react"
import { Component, ComponentType } from "../../types/Util"

import "./Collapse.css"

import _DropdownIcon from "../../svg/icons/down-chevron.svg"
import Button from "../Button"
import { LoaderContext } from "../Loader"

const DropdownIcon = _DropdownIcon as unknown as Component<any>

export interface CollapseClasses {
	header?: string
	title?: string,
	titleContainer?: string
	root?: string,
	body?: string,
	inner?: string,
}

export interface CollapseProps {
	title: JSX.Element | string,
	color?: "contrast" | "paper"
	classes?: CollapseClasses,
	headerComponent?: ComponentType
}

const Collapse: Component<CollapseProps> = (props) => {
	const { loading } = useContext(LoaderContext)
	const [ collapsed, setCollapsed ] = useState(true)
	const [ height, setHeight ] = useState(0)

	const innerRef = useRef<HTMLDivElement>()

	useEffect(() => {
		let rect = innerRef.current?.getBoundingClientRect()
		let height = rect?.height || 0
		setHeight(height)
	}, [props.children])

	const HeaderComponent = props.headerComponent || Button

	return (
		<div className={clsx("collapse", props.classes?.root, props.color, {open: !collapsed})}>
			<HeaderComponent
				type="button"
				className={clsx("collapse-header transition-all", props.classes?.header)}
				flush={collapsed ? undefined : "bottom" }
				color={(props.color || "contrast") === "contrast" ? "bg-contrast" : "bg-paper"}
				onClick={() => !loading && setCollapsed((collapsed) => !collapsed)}
			>
				<div className={clsx("title-container", props.classes?.titleContainer)}>
					{props.title}
				</div>
				<DropdownIcon className="dropdown-icon" />
			</HeaderComponent>
			<div className={clsx("collapse-body", props.classes?.body)} style={{["--height" as any]: `${height / 16}rem`}}>
				<div ref={(el) => innerRef.current = el || undefined} className={clsx("collapse-inner", props.classes?.inner)}>
					{props.children}
				</div>
			</div>
		</div>
	)
}

export default Collapse;