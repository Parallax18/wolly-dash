import React, { useContext, useMemo, useState } from "react"
import { Component } from "../../types/Util"
import Card, { CardBody } from "../Card";

import "./TokenSelectModal.css"

import { CurrencyItem, getTokenLabelString, tokenList as fullTokenList } from "../../util";
import { FormContext } from "../Form";
import SelectModal, { SelectModalProps } from "../SelectModal";
import { TokenBonus } from "../../types/Api";

export type TokenSelectModalProps = Omit<SelectModalProps<CurrencyItem>, "items"> & {
	bonuses?: TokenBonus[]
}

const TokenSelectModal = ({ bonuses, ...others }: TokenSelectModalProps): JSX.Element => {

	return (
		<SelectModal<CurrencyItem>
			{...others}
			className="token-modal"
			items={fullTokenList}
			searchStringFunction={(token) => token.name + token.chain + token.symbol}
			itemComponentGenerator={(token) => (
				<TokenSelectItem token={token} bonuses={bonuses} />
			)}
		/>
	)
}

export interface TokenSelectItemProps {
	token: CurrencyItem,
	compact?: boolean,
	bonuses?: TokenBonus[]
}

export const TokenSelectItem: Component<TokenSelectItemProps> = ({
	token, compact, bonuses
}) => {
	let bonusItem = bonuses ? bonuses.find((bonus) => bonus.token_id.toLowerCase() === token.symbol.toLowerCase()) : undefined;

	return  (
		<>
			<img className="token-img" src={token.imageUrl} />
			<span className="token-symbol">{token.symbol}</span>
			{!compact && <span className="token-name">- {getTokenLabelString(fullTokenList, token)}</span>}
			{bonusItem && <span className="token-bonus">+{bonusItem.percentage}%</span>}
		</>
	)
}

export default TokenSelectModal

export type FormTokenSelectModalProps = TokenSelectModalProps & {
	field: string
}

export const FormTokenSelectModal: Component<FormTokenSelectModalProps> = ({
	field, ...others
}) => {
	const formContext = useContext(FormContext)
	if (!formContext) throw "FormInputs must be inside a Form component"

	return (
		<TokenSelectModal
			{...others}
			onChange={(item: CurrencyItem) => formContext.updateValue(field, item)}

		/>
	)
}