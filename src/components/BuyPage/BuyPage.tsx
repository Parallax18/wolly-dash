import React from "react"
import { useSearchParams } from "react-router-dom"
import { Component } from "../../types/Util"
import { deserializeObjFromQuery } from "../../util"
import Button from "../Button"
import Form from "../Form"
import FormInput from "../FormInput"
import FormPage from "../FormPage"
import FormSelect from "../FormSelect"
import Page from "../Page"
import TokenSelect from "../TokenSelect"

import "./BuyPage.css"

const BuyPage: Component = () => {
	const [ searchParams, setSearchParams ] = useSearchParams()
	const params = deserializeObjFromQuery(
		new URLSearchParams(searchParams),
		["usd_amount", "token"]
	)

	const initialValues = {
		usd_amount: params.usd_amount || 1000,
		buy_token: params.token,
		buy_token_amount: 1
	}

	return (
		<Page path="/buy" title="Buy">
			<FormPage title="Buy Tokens" background={"/image/background/hexagons.svg"}>
				<Form
					className="flex flex-col flex-gap-y-8"
					initialValues={initialValues}
					onSubmit={() => {}}
				>
					<label className="flex flex-col">
						<span className="text-sm mb-2">I want to spend</span>
						<FormInput
							field="usd_amount"
						/>
					</label>
					<label className="flex flex-col">
						<span className="text-sm mb-2">I want to buy</span>
						<FormInput
							field="buy_token_amount"
							rightContent={(
								<TokenSelect inputStyle="light" field="buy_token" flush="left" />
							)}
						/>
					</label>
					<Button color="primary" className="mt-24">
						Confirm
					</Button>
				</Form>
			</FormPage>
		</Page>
	)
}

export default BuyPage