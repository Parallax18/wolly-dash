import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Component, ComponentItem } from "../../types/Util";
import { calculateTextBounds, useClickAway, useEventListener, minMax } from "../../util";
import "./Dropdown.css"

import clsx from "clsx"

export type RenderFunction = (item: ComponentItem) => JSX.Element | JSX.Element[] | string

export interface DropdownProps {
	items: ComponentItem[],
	onClick: (item: ComponentItem, e: React.MouseEvent) => void,
	onClose: () => void,
	renderFunction?: RenderFunction,
	open: boolean,
	containerRef: MutableRefObject<HTMLElement | null | undefined>,
	itemStyle?: (value: string | null) => Record<string, any>
}

const Dropdown: Component<DropdownProps> = (props) => {
	const [ position, setPosition ] = useState({ x: 0, y: 0 })
	let dropdownRef = useRef<HTMLDivElement | null>();

	useClickAway(dropdownRef, () => props.onClose(), [props.containerRef])

	const offset = 8

	const updatePosition = useCallback(() => {
		if (!dropdownRef.current || !props.containerRef.current) return;
		let containerBounds = props.containerRef.current.getBoundingClientRect();
		let dropdownBounds = dropdownRef.current.getBoundingClientRect();

		setPosition({
			x: minMax(containerBounds.x + offset, offset, window.innerWidth - dropdownBounds.width - offset),
			y: minMax(containerBounds.y + containerBounds.height - offset, offset, window.innerHeight - dropdownBounds.height - offset)
		})
	}, [dropdownRef, props.containerRef])

	useEffect(updatePosition, [dropdownRef, props.containerRef])
	useEventListener(window, ["resize", "scroll"], updatePosition)

	const renderFunction = (): RenderFunction => {
		if (props.renderFunction) return props.renderFunction;
		return (item: ComponentItem) => item.label
	}

	return ReactDOM.createPortal(
		<div
			className={clsx("dropdown", {open: props.open})}
			style={{left: `${position.x}px`, top: `${position.y}px`}}
			ref={(el) => dropdownRef.current = el}
		>
			{props.items.map((item: ComponentItem) => (
				<button
					key={item.value}
					style={props.itemStyle?.(item.value) || {}}
					onClick={(e) => {
						props.onClick(item, e)
					}}
				>
					{renderFunction()(item)}
				</button>
			))}
		</div>,
		document.body
	)
}

export default Dropdown