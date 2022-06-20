import { JSX } from "solid-js";

export interface Serializer<T> {
	serialize: (value: T) => string,
	deserialize: (str: string) => T
}

export interface ComponentItem {
	label: string,
	value: any,
	data?: any
}

export type Primitive = number | string | boolean | null | undefined

export type WatchListSortType = "WATCH_STATUS" | "LAST_UPDATED" | "USER_SCORE" | "DATE_STARTED"

export declare type PropsWithChildren<P = {}> = P & {
    children?: JSX.Element;
};
export type Component<P = {}> = (props: PropsWithChildren<P>) => JSX.Element;