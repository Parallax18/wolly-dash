import clsx from "clsx";
import React from "react"
import { Component } from "../../types/Util"
import IconButton from "../IconButton";

import "./Pagination.css"

import LeftIcon from "../../svg/icons/left-chevron.svg"
import RightIcon from "../../svg/icons/right-chevron.svg"
import { string } from "yup/lib/locale";

export interface PaginationClasses {
	root?: string,
	content?: string,
	buttons?: string
}

export type PaginationProps = React.HTMLAttributes<HTMLDivElement> & {
	page: number
	onNext: () => void;
	onPrevious: () => void;
	prevDisabled?: boolean
	nextDisabled?: boolean;
	classes?: PaginationClasses
}

const Pagination: Component<PaginationProps> = ({
	onNext, onPrevious, page, children, classes,
	nextDisabled, prevDisabled,
	...others
}) => {
	return (
		<div className={clsx("pagination-container", classes?.root, others.className)}>
			<div className={clsx("pagination-content", classes?.content)}>
				{children}
			</div>
			<div className={clsx("pagination-buttons", classes?.buttons)}>
				<IconButton onClick={() => onPrevious()} disabled={prevDisabled}>
					<LeftIcon />
				</IconButton>
				<span className="page-label">{page}</span>
				<IconButton onClick={() => onNext()} disabled={nextDisabled}>
					<RightIcon />
				</IconButton>
			</div>
		</div>
	)
}

export default Pagination