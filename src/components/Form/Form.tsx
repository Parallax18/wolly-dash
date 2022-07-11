import type { Component } from "../../types/Util"
import "./Form.css"
import { fillObj, useStateRef } from "../../util"

import * as Yup from "yup"
import clsx from "clsx"
import { createContext, FormEvent, useContext, useEffect, useState } from "react"
import { AlertContext } from "../../context/AlertContext"

export interface FormContextValue {
	values: Record<string, any>,
	errors: Record<string, string | null>,
	changed: Record<string, boolean>,
	updateValue: (key: string, value: any) => void,
	updateError: (key: string, value: string | null) => void,
	updateChanged: (key: string, changed: boolean) => void
}

const defaultValue: FormContextValue = {
	values: {},
	errors: {},
	changed: {},
	updateValue: () => {},
	updateError: () => {},
	updateChanged: () => {}
}

export const FormContext = createContext<FormContextValue>(defaultValue)

export type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
	values?: Record<string, any>,
	initialValues: Record<string, any>,
	onSubmit: (values: Record<string, any>) => void,
	onUpdate?: (values: Record<string, any>, field: string) => void,
	validationSchema?: Yup.ObjectSchema<Record<string, any>>
}

const Form: Component<FormProps> = ({
	initialValues, onSubmit, validationSchema, values : propValues,
	onUpdate, ...others
}) => {
	const [ values, setValues, valuesRef ] = useStateRef(initialValues)
	const [ changed, setChanged, changedRef ] = useStateRef<Record<string, boolean>>(fillObj(initialValues, false))
	const [ errors, setErrors, errorsRef ] = useStateRef(fillObj(initialValues, null))

	const updateError = (key: string, error: any) => setErrors((err) => ({...err, [key]: error}))
	const updateValue = (key: string, value: any) => {
		setValues((val) => {
			let newValues = {...val, [key]: value}
			onUpdate?.(newValues, key)
			return newValues
		})
		updateErrors()
	}
	const updateChanged = (key: string, changed: boolean) => {
		setChanged((changedVal) => ({...changedVal, [key]: changed}))
		updateErrors()
	}

	useEffect(() => {
		if (!propValues) return;
		valuesRef.current = propValues as Record<string, any>
		updateErrors()
	}, [propValues])

	const updateErrors = async (): Promise<boolean> => {
		if (!validationSchema) return false;

		let validationErr: any | null = null;
		await validationSchema.validate(valuesRef.current, {abortEarly: false}).catch((err) => validationErr = err)

		let errorMessages = fillObj(initialValues, null)
		if (validationErr) {

			let errors = validationErr.inner;
			errors.forEach((err: any) => {
				if (!changedRef.current[err.path]) return;
				errorMessages[err.path] = err.message
			})
			
			setErrors(errorMessages)
			return true;
		}
		setErrors(errorMessages)
		return false;
	}

	const onFormSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setChanged(fillObj(initialValues, true))
		let errors = await updateErrors()

		onSubmit(values)
	}

	const FormValue: FormContextValue = {
		values: propValues !== undefined ? propValues : values, errors, changed,
		updateValue, updateError, updateChanged
	}

	return (
		<FormContext.Provider value={FormValue}>
			<form
				{...others}
				onSubmit={onFormSubmit}
				className={clsx("flex-gap-y-4", others.className)}
			/>
		</FormContext.Provider>
	)
}

export default Form

export interface FormRenderProps {
	children: (formContext: FormContextValue) => JSX.Element
}

export const FormRender: React.FC<FormRenderProps> = (props) => {
	const formContext = useContext(FormContext)

	return props.children(formContext)
}