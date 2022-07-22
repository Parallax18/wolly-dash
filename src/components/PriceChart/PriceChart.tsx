import React, { useContext, useEffect, useMemo, useState } from "react"
import { Component } from "../../types/Util"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import "./PriceChart.css"
import { capitalize, formatDollar, formatNumber, PriceChartPeriod, usePriceChartRequest, zeroPad } from "../../util"
import { ThemeContext } from "../../context/ThemeContext"
import Card, { CardTitle } from "../Card"
import Button from "../Button"
import { Loadable, Loader } from "../Loader"
import LoaderBar from "../LoaderBar"

const PriceChart: Component = () => {
	const [ period, setPeriod ] = useState<PriceChartPeriod>("day")
	const priceChartRequest = usePriceChartRequest()
	const { theme } = useContext(ThemeContext)

	useEffect(() => {
		priceChartRequest.sendRequest(period)
	}, [period])

	const dataset = useMemo(() => {
		return (priceChartRequest.data?.price_chart || [])
			.map((dataItem, i) => ({date: new Date(dataItem.date), price: dataItem.price}))
			.sort((a, b) => a.date.getTime() - b.date.getTime())
	}, [priceChartRequest.data])

	const tooltipDateFormatter = (value: any): string => {
		if (period === "day") return new Date(value).toLocaleString([], {hour: '2-digit', minute:'2-digit'});
		return new Date(value).toLocaleDateString()
	}

	const max = Math.max(...dataset.map((item) => item.price))

	const labelStyles = {fontSize: "0.8rem", fill: theme.text?.muted}
	return (
		<Loader loading={priceChartRequest.fetching}>
			<Card className="price-chart-container">
				<CardTitle className="px-0 py-0 pb-4">Price Chart</CardTitle>
				<LoaderBar />
				<div className="price-chart-buttons flex-gap-x-2">
					{(["day", "week", "month", "all"] as PriceChartPeriod[]).map((value) => (
						<Button
							key={value}
							onClick={() => setPeriod(value)}
							compact
							color={period === value ? "primary" : "bg-light"}
						>
							{capitalize(value)}
						</Button>
					))}
				</div>
				<div className="chart-container">
					<Loadable variant="block" loadClass="h-full w-full">
						<ResponsiveContainer width={"100%"} height={"100%"} className="responsive-container">
							<LineChart data={dataset}>
								<YAxis
									tick={labelStyles}
									ticks={[0, 0, max]}
									tickFormatter={(val) => `$${formatNumber(val)}`}
									// width={35}
									padding={{bottom: 0, top: 0}}
									stroke={labelStyles.fill}
									dataKey="price"
									domain={[0, max]}
								/>
								<XAxis
									tick={labelStyles}
									tickFormatter={() => ""}
									height={20}
									padding={{left: 0, right: 0}}
									stroke={'#158FFF'}
									dataKey={"date"}
									tickLine={false}
									axisLine={false}

								/>
								<Line
									type="monotone"
									dataKey="price"
									stroke={'#158FFF'}
									strokeWidth={1}
									dot={false}
								/>
								<Tooltip
									wrapperStyle={{background: 'red'}}
									labelFormatter={tooltipDateFormatter}
									formatter={(value: number) => `$${formatNumber(value)}`}
								/>
							</LineChart>
						</ResponsiveContainer>
					</Loadable>
				</div>			
			</Card>
		</Loader>
	)
}

export default PriceChart