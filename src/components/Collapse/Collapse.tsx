import clsx from "clsx"
import React, { useEffect, useRef, useState } from "react"
import { Component } from "../../types/Util"

import "./Collapse.css"

import _DropdownIcon from "../../svg/icons/down-chevron.svg"
import Button from "../Button"

const DropdownIcon = _DropdownIcon as unknown as Component<any>

export interface CollapseClasses {
	header?: string
	title?: string,
	root?: string,
	body?: string,
	inner?: string
}

export interface CollapseProps {
	title: JSX.Element | string,
	classes?: CollapseClasses
}

const Collapse: Component<CollapseProps> = (props) => {
	const [ collapsed, setCollapsed ] = useState(true)
	const [ height, setHeight ] = useState(0)

	const innerRef = useRef<HTMLDivElement>()

	useEffect(() => {
		let rect = innerRef.current?.getBoundingClientRect()
		let height = rect?.height || 0
		setHeight(height)
	}, [props.children])

	return (
		<div className={clsx("collapse", props.classes?.root, {open: !collapsed})}>
			<Button
				className={clsx("collapse-header transition-all", props.classes?.header)}
				flush={collapsed ? undefined : "bottom" }
				color="bg-contrast"
				onClick={() => setCollapsed((collapsed) => !collapsed)}
			>
				<div className="title-container">
					{props.title}
				</div>
				<DropdownIcon className="dropdown-icon" />
			</Button>
			<div className={clsx("collapse-body", props.classes?.body)} style={{["--height" as any]: `${height / 16}rem`}}>
				<div ref={(el) => innerRef.current = el || undefined} className={clsx("collapse-inner", props.classes?.inner)}>
					{props.children}
				</div>
			</div>
		</div>
	)
}

export default Collapse;