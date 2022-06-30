import clsx from "clsx";
import React, { useMemo, useState } from "react"
import { Component } from "../../types/Util"
import Card from "../Card";
import IconButton from "../IconButton";

import Input from "../Input";
import SearchIcon from "../../svg/icons/search.svg"
import Button from "../Button";


import CloseIcon from "../../svg/icons/close.svg"

import "./SelectModal.css"

export type SelectModalProps<T> = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
	open: boolean,
	onClose: () => void,
	onChange?: (item: T) => void;
	items: T[];
	searchStringFunction?: (item: T) => string;
	itemComponentGenerator?: (item: T) => JSX.Element;
}

const SelectModal = <T extends string | number | Record<string, any>>({
	open,
	items,
	onClose,
	onChange,
	searchStringFunction,
	itemComponentGenerator,
	...others
}: SelectModalProps<T>) => {
	
	const [ search, setSearch ] = useState("")
	
	const filteredList = useMemo<T[]>(() => {
		return items.filter((item) => (searchStringFunction ? searchStringFunction(item) : item.toString()).toLowerCase().includes(search.toLowerCase()))
	}, [items, search])

	return (
		<div className={clsx("select-modal", others.className, {open})}>
			<Card className="p-6 pr-2 flex-gap-y-6">
				<div className="modal-header">
					<span>Select a currency</span>
					<IconButton onClick={onClose} type="button">
						<CloseIcon />
					</IconButton>
				</div>
				<Input
					icon={SearchIcon}
					placeholder="Search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div className="modal-body flex-gap-y-2">
					{filteredList.map((item, i) => (
						<Button
							type="button"
							key={searchStringFunction ? searchStringFunction(item) : i}
							color="transparent"
							className="token-item justify-start"
							onClick={() => {
								onChange?.(item)
								onClose()
							}}
						>
							{itemComponentGenerator ?
								itemComponentGenerator(item) :
								toString()
							}
						</Button>
					))}
				</div>
			</Card>
		</div>
	)
}

export default SelectModal

export const SelectModalWrapper: Component<{open: boolean}> = ({ open, children }) => {
	return (
		<div className={clsx("select-modal-wrapper", {open})}>
			{children}
		</div>
	)
}