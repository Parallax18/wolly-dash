import clsx from "clsx"
import React, { useContext } from "react"
import { Component } from "../../types/Util"
import { LoaderContext } from "../Loader/Loader"

import "./LoaderBar.css"

const LoaderBar: Component = () => {
	const { loading } = useContext(LoaderContext)

	return (
		<div className={clsx("loader-bar", {loading})} />
	)
}

export default LoaderBar