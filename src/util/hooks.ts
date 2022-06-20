import { MutableRefObject, useEffect, useRef, useState } from "react";
import { deserializeValue } from "../util";
import { serializeValue } from "./data";

export const useEventListener = (element: EventTarget, eventListeners: (keyof WindowEventMap)[] | keyof WindowEventMap, callback: (event: Event) => void, options?: boolean | AddEventListenerOptions): void => {
	let listeners: (keyof WindowEventMap)[];
	if (!Array.isArray(eventListeners)) listeners = [eventListeners];
	else listeners = eventListeners

	useEffect(() => {
		if (!element) return;
		listeners.forEach((listener: keyof WindowEventMap) => {
			element.addEventListener(listener, callback, options)
		})
		return () => {
			if (!element) return;
			listeners.forEach((listener: keyof WindowEventMap) => {
				element.removeEventListener(listener, callback)
			})
		}
	}, [element, listeners, callback, options])
}

export const useWindowSize = () => {
	const [ width, setWidth ] = useState(window.innerWidth)
	const [ height, setHeight ] = useState(window.innerHeight)

	useEventListener(window, "resize", () => {
		setWidth(window.innerWidth)
		setHeight(window.innerHeight)
	})

	return {
		width,
		height
	}
}

const breakpoints = {
	"lg": "(min-width: 1160px)",
	"md": "(min-width: 860px)",
	"sm": "(min-width: 500px)",
	"xs": "(min-width: 400px)",

	"-lg": "(max-width: 1160px)",
	"-md": "(max-width: 859px)",
	"-sm": "(max-width: 499px)",
	"-xs": "(max-width: 399px)",
}

export const useBreakPoints = () => {
	const [ currentActive, setCurrentActive ] = useState<string[]>([])

	const setNewActiveBreakpoints = () => {
		let newCurrentActive: string[] = [];
		Object.entries(breakpoints).forEach(([breakpointLabel, mediaQuery]: [string, string]) => {
			if (window.matchMedia(mediaQuery).matches) newCurrentActive.push(breakpointLabel)
		})
		setCurrentActive(newCurrentActive)
	}

	useEffect(() => {
		setNewActiveBreakpoints()
	}, [])
	useEventListener(window, "resize", setNewActiveBreakpoints)

	return currentActive;
}

export const useStateRef = <T>(defaultValue: T): [T, (newValue: T) => void, MutableRefObject<T>] => {
	const [ value, setValue ] = useState(defaultValue)
	const valueRef = useRef(defaultValue)

	const newSetValue = (newValue: T) => {
		valueRef.current = newValue
		setValue(newValue)
	}

	return [value, newSetValue, valueRef]
}

export const useLocalState = <T>(defaultValue: T | undefined, stateKey: string): [T, (newValue: T) => void] => {
	const localValue = localStorage.getItem(stateKey)
	const parsedValue = localValue ? deserializeValue(localValue) : defaultValue
	const [ value, setValue ] = useState<T>(parsedValue)

	const newSetValue = (newValue: T) => {
		setValue(newValue)
		localStorage.setItem(stateKey, serializeValue(newValue))
	}

	return [value, newSetValue]
}

export const useLocalStateRef = <T>(defaultValue: T, stateKey: string): [T, (newValue: T) => void, MutableRefObject<T>] => {
	const [ value, setValue ] = useLocalState(defaultValue, stateKey)
	const valueRef = useRef(value)

	const newSetValue = (newValue: T) => {
		setValue(newValue)
		valueRef.current = newValue
	}

	return [value, newSetValue, valueRef]
}

export const useClickAway = (
	ref: MutableRefObject<HTMLElement | null | undefined>,
	callback: (e: MouseEvent) => void,
	ignoreRefs?: MutableRefObject<HTMLElement | null | undefined>[]
) => {
	useEventListener(window, ["click"], (e: Event) => {
		const currRef = ref.current;
		if (!currRef) return;
		let isIgnored = false
		if (ignoreRefs) {
			ignoreRefs.forEach((ignoreRef: MutableRefObject<HTMLElement | undefined | null>) => {
				if (e.target) {
					let current = ignoreRef?.current
					if (current) {
						if (current.isEqualNode(e.target as Node)) isIgnored = true
						if (current.contains(e.target as Node)) isIgnored = true
					}
				}
				
			})
		}
		if (!currRef.isEqualNode(e.target as Node) && !currRef.contains(e.target as Node) && !isIgnored) {
			callback(e as MouseEvent);
		}
	});
};

export const useRandoms = (numOfRandoms: number): number[] => {
	const [ randoms, setRandoms ] = useState<number[]>([])
	useEffect(() => {
		let newRandoms: number[] = []
		new Array(numOfRandoms).fill(0).forEach(() => {
			newRandoms.push(Math.random())
		})
		setRandoms(newRandoms)
	}, [])
	return randoms
}

export const useInterval = (callback: Function, timeMs: number, runFirst: boolean = false) => {
	useEffect(() => {
		if (runFirst) callback()
		const interval = setInterval(callback, timeMs)
		return () => clearInterval(interval)
	}, [callback, runFirst, timeMs])
}