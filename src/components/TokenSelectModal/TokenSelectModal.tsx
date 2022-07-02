import React, { useContext, useMemo, useState } from "react"
import { Component } from "../../types/Util"
import Card, { CardBody } from "../Card";

import "./TokenSelectModal.css"

import { CurrencyItem, getChainDisplayName, getTokenLabelString, tokenList as fullTokenList } from "../../util";
import { FormContext } from "../Form";
import SelectModal, { SelectModalProps } from "../SelectModal";
import { TokenBonus } from "../../types/Api";
import { ProjectContext } from "../../context/ProjectContext";

export type TokenSelectModalProps = Omit<SelectModalProps<CurrencyItem>, "items"> & {
	bonuses?: TokenBonus[]
}

const TokenSelectModal = ({ bonuses, ...others }: TokenSelectModalProps): JSX.Element => {
	const { currentProject, currencyTokenList } = useContext(ProjectContext)

	return (
		<SelectModal<CurrencyItem>
			{...others}
			className="token-modal"
			items={currencyTokenList || []}
			searchStringFunction={(token) => token.name + token.chain + token.symbol}
			itemComponentGenerator={(token) => (
				<TokenSelectItem token={token} bonuses={bonuses} tokenList={currencyTokenList || []} />
			)}
		/>
	)
}

export interface TokenSelectItemProps {
	token: CurrencyItem,
	tokenList: CurrencyItem[]
	compact?: boolean,
	bonuses?: TokenBonus[]
}

export const TokenSelectItem: Component<TokenSelectItemProps> = ({
	token, compact, bonuses, tokenList
}) => {
	let bonusItem = bonuses ? bonuses.find((bonus) => bonus.token_id === token.id) : undefined;

	return  (
		<>
			<img className="token-img" src={token.imageUrl} />
			<span className="token-symbol">{token.symbol}</span>
			{!compact && <span className="token-name">- {getTokenLabelString(tokenList, token)}</span>}
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
			onChange={(item: CurrencyItem) => {
				formContext.updateValue(field, item)
			}}

		/>
	)
}