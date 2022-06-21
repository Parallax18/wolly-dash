import clsx from "clsx";
import type { Component } from "../../types/Util"
import "./Chip.css"

export interface ChipProps {
	class?: string;
	style?: Record<string, any>,
	compact?: boolean
}

const Chip: Component<ChipProps> = (props) => {
	return (
		<div className={clsx("chip", props.class, {compact: props.compact})} style={props.style}>
			{props.children}
		</div>
	)
}

export default Chip