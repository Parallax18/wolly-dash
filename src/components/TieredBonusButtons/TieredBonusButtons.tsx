import clsx from "clsx"
import React, { useMemo } from "react"
import { Stage, TieredBonus } from "../../types/Api"
import { ArrayElement, Component } from "../../types/Util"
import Button from "../Button"
import { Loadable } from "../Loader"

import "./TieredBonusButtons.css"

export type  TieredBonusButtonsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> & {
	bonuses: TieredBonus[],
	onSelect: (bonusItem: TieredBonus) => void,
	usdAmount: number
}

const TieredBonusButtons: Component<TieredBonusButtonsProps> = ({
	bonuses, onSelect, usdAmount, ...others
}) => {
	const sortedBonuses = useMemo(() => {
		return bonuses?.sort((a, b) => a.amount - b.amount) || []
	}, [bonuses])

	const selectedTier = useMemo(() => {
		let num = 0
		sortedBonuses.forEach((tier) => {
			if (tier.amount > num && usdAmount >= tier.amount) {
				num = tier.amount
			}
		})
		return num;
	}, [sortedBonuses, usdAmount])

	if (bonuses.length === 0) return <></>;
	return (
		<div className={clsx("tiered-bonus-buttons flex-gap-x-2", others.className)}>
			{bonuses.map((bonus) => (
				<Button
					type="button"
					key={bonus.amount}
					size="tiny"
					color="bg-light"
					className={clsx("bonus-button", {
						active: selectedTier === bonus.amount
					})}
					onClick={() => onSelect(bonus)}
				>
					<Loadable length={3} variant="text" loadClass="text-sm">
						<span className="amount mr-1">${bonus.amount}</span>
						<span className="percent">+{bonus.percentage}%</span>
					</Loadable>
				</Button>
			))}
		</div>
	)
}

export default TieredBonusButtons