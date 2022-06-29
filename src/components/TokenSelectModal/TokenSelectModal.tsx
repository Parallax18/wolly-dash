import React, { useMemo, useState } from "react"
import { Component } from "../../types/Util"
import Card, { CardBody } from "../Card";

import "./TokenSelectModal.css"

import CloseIcon from "../../svg/icons/close.svg"
import { CurrencyItem, getTokenLabelString, tokenList } from "../../util";
import clsx from "clsx";
import Input from "../Input";
import SearchIcon from "../../svg/icons/search.svg"
import IconButton from "../IconButton";
import Button from "../Button";

export type TokenSelectModalProps = React.HTMLAttributes<HTMLDivElement> & {
	open: boolean,
	onClose: () => void;
}

const TokenSelectModal: Component<TokenSelectModalProps> = ({
	open, onClose
}) => {
	const [ search, setSearch ] = useState("")
	
	const filteredTokens = useMemo<CurrencyItem[]>(() => {
		return tokenList.filter((tokenItem) => (tokenItem.name + " - " + tokenItem.symbol + " - " + (tokenItem.chain || "ERC20")).toLowerCase().includes(search.toLowerCase()))
	}, [tokenList, search])

	return (
		<div className={clsx("token-modal", {open})}>
			<Card className="p-6 pr-2 flex-gap-y-6">
				<div className="modal-header">
					<span>Select a currency</span>
					<IconButton onClick={onClose}>
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
					{filteredTokens.map((token) => (
						<Button color="transparent" className="token-item justify-start" >
							<img className="token-img" src={token.imageUrl} />
							<span className="token-symbol">{token.symbol}</span>
							<span className="token-name">- {getTokenLabelString(filteredTokens, token)}</span>
						</Button>
					))}
				</div>
			</Card>
		</div>
	)
}

export default TokenSelectModal