import { Component, ComponentItem } from "../../types/Util"
import "./Select.css"

import ArrowDropdownIcon from "../../svg/icons/down-chevron.svg"
import CloseIcon from "../../svg/icons/close.svg"
import CheckBoxIcon from "../../svg/icons/checkbox.svg"
import CheckBoxEmptyIcon from "../../svg/icons/checkbox-outline.svg"

import Dropdown from "../Dropdown"
import Chip from "../Chip"
import IconButton from "../IconButton"
import InputBase, { InputBaseProps } from "../InputBase"
import clsx from "clsx"
import { Loadable, LoaderContext } from "../Loader"
import { useContext, useMemo, useRef, useState } from "react"

export type ValueComponent = Component<{
	style?: Record<string, any>,
	item?: ComponentItem,
}>

export type SelectProps = {
	class?: string
	style?: Record<string, any>,
	multiple?: false,
	onChange: (newValue: any, totalValues?: any[], prevValues?: any[]) => any,
	items: ComponentItem[],
	value: any,
	emptyValuePlaceholder?: JSX.Element | string,
	itemStyle?: (value: string | null) => Record<string, any>
	isSelected?: (value: string | null, selected: string[]) => boolean,
	compact?: boolean,
	valueComponent?: ValueComponent,
	inputStyle?: InputBaseProps["inputStyle"],
	flush?: InputBaseProps["flush"],
	error?: boolean,
	hintText?: string
}

const Select: Component<SelectProps> = (props) => {
	const [ dropdownOpen, setDropdownOpen ] = useState(false)
	const loadingValue = useContext(LoaderContext)

	const containerRef = useRef<HTMLButtonElement>()

	const isSelected = props.isSelected || ((value) => Array.isArray(props.value) && props.value.includes(value))

	const valueComponent = useMemo<JSX.Element | JSX.Element[] | string>(() => {
		if (props.valueComponent) {
			let Comp = props.valueComponent
			return <Comp style={props.itemStyle?.(props.value)} item={props.items.find((item: ComponentItem) => item.value === props.value)} />
		}
		let comp = props.multiple ? (props.items.filter((item) => props.value.includes(item.value)) || [] as ComponentItem[])
			.map((item: ComponentItem) => (
			<Chip style={props.itemStyle?.(item.value) || {}}>
				{item.label}
				<IconButton onClick={(e) => {
					if (props.multiple) {
						e.stopPropagation()
						let newValue = [...props.value]
						let index = newValue.findIndex((value) => value === item.value)
						if (index > -1) {
							newValue.splice(index, 1)
						} else {
							newValue.push(item.value)
						}
						return props.onChange(newValue, item.value, props.value)
					}
				}}>
					<CloseIcon />
				</IconButton>
			</Chip>
		)) : <p style={props.itemStyle?.(props.value)}>{props.items.find((item: ComponentItem) => item.value === props.value)?.label || props.emptyValuePlaceholder}</p>
		if (props.multiple && (comp as []).length === 0 && props.emptyValuePlaceholder) {
			(comp as (JSX.Element | string)[]).push(<Chip class="empty-value" style={props.itemStyle?.(null)}>
				{props.emptyValuePlaceholder}
			</Chip>)
		}
		return comp;
	}, [props.valueComponent, props.emptyValuePlaceholder, props.value])

	return (
		<InputBase
			component={"button"}
			type="button"
			className={clsx("select", props.class, {
				multiple: props.multiple,
				open: dropdownOpen,
				compact: props.compact
			})}
			ref={(el: HTMLButtonElement) => containerRef.current = el}
			onClick={() => !loadingValue.loading && setDropdownOpen((open) => !open)}
			active={dropdownOpen}
			labelFixed
			style={props.style}
			inputStyle={props.inputStyle}
			flush={props.flush}
			error={props.error}
			hintText={props.hintText}
		>
			<div className="value-container thin-scroll">
				<Loadable>
					{valueComponent || ""}
				</Loadable>
			</div>
			<ArrowDropdownIcon className="dropdown-icon" />
			<Dropdown
				open={dropdownOpen}
				items={props.items}
				onClose={() => setDropdownOpen(false)}
				containerRef={containerRef}
				renderFunction={(item: ComponentItem) => (
					<>
						{item.label}
						{props.multiple && (isSelected(item.value, props.value) ?
							<CheckBoxIcon /> : <CheckBoxEmptyIcon />)
						}
					</>
				)}
				itemStyle={props.itemStyle}
				onClick={(item, e) => {
					if (props.multiple) e.stopPropagation()
					if (props.multiple) {
						let newValue = [...props.value]
						let index = newValue.findIndex((value) => value === item.value)
						if (index > -1) {
							newValue.splice(index, 1)
						} else {
							newValue.push(item.value)
						}
						return props.onChange(newValue, item.value, props.value)
					}
					props.onChange(item.value)
				}}
			/>
		</InputBase>
	)
}

export default Select