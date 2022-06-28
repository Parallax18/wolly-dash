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
	itemStyle?: (value: string | null) => Record<string, any>,
	searchable?: boolean;
	searchFilter?: (search: string, item: ComponentItem) => boolean
	resetSearchOnClose?: boolean
}

const Dropdown: Component<DropdownProps> = (props) => {
	const [ position, setPosition ] = useState({ x: 0, y: 0 })
	const [ width, setWidth ] = useState(100)

	const [ search, setSearch ] = useState("")

	let dropdownRef = useRef<HTMLDivElement | null>();

	useClickAway(dropdownRef, () => props.onClose(), [props.containerRef])

	const updatePosition = useCallback(() => {
		if (!dropdownRef.current || !props.containerRef.current) return;

		const containerBounds = props.containerRef.current.getBoundingClientRect();
		const dropdownBounds = dropdownRef.current.getBoundingClientRect();
		
		const cs = getComputedStyle(props.containerRef.current)
		const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

		const offsetX = paddingX / 2
		const offsetY = 8

		setPosition({
			x: minMax(containerBounds.x + offsetX, offsetX, window.innerWidth - dropdownBounds.width - offsetX),
			y: minMax(containerBounds.y + containerBounds.height - offsetY, offsetY, window.innerHeight - dropdownBounds.height - offsetY)
		})
	}, [dropdownRef, props.containerRef])

	const updateSize = useCallback(() => {
		if (!dropdownRef.current || !props.containerRef.current) return;
		const containerBounds = props.containerRef.current.getBoundingClientRect();
		const cs = getComputedStyle(props.containerRef.current)

		const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

		setWidth(containerBounds.width - paddingX)
	}, [props.containerRef])

	useEffect(() => {
		updateSize()
		updatePosition()
	}, [dropdownRef, props.containerRef, props.open])

	useEventListener(window, ["resize", "scroll"], () => {
		updateSize()
		updatePosition()
	})

	const renderFunction = (): RenderFunction => {
		if (props.renderFunction) return props.renderFunction;
		return (item: ComponentItem) => item.label
	}

	const items = !props.searchable ?
		props.items : props.items.filter(
			(value) => props.searchFilter ?
				props.searchFilter(search, value) :
				value.label.toLowerCase().includes(search.toLowerCase())
		)

	return ReactDOM.createPortal(
		<div
			className={clsx("dropdown", {open: props.open, searchable: props.searchable})}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				width: `${width}px`
			}}
			ref={(el) => dropdownRef.current = el}
		>
			{props.children}
			
			{props.searchable && (
				<div className="search-input-container">
					<input
						placeholder="Search"
						size={0}
						className="search-input"
						onChange={(e) => setSearch(e.target.value)}
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			)}

			{(items || []).map((item: ComponentItem) => (
				<button
					className="dropdown-item"
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