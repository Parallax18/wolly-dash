import CountryList from "country-list-with-dial-code-and-flag"
import { findFlagUrlByIso2Code } from "country-flags-svg"

export const countryList = CountryList.map((country) => ({
	...country,
	flagUrl: findFlagUrlByIso2Code(country.code)
}))

export const uk = countryList.find((country) => country.code === "GB")
