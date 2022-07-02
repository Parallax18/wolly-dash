import React, { ReactNode } from "react";

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


type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };

export type Component<P = {}> = React.FC<PropsWithChildren<P>>;

export type ComponentType = React.FC<any> | string

export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;