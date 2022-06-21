import CountryList from "country-list-with-dial-code-and-flag"
import { findFlagUrlByIso2Code } from "country-flags-svg"

export const countryList = CountryList.map((country) => ({
	...country,
	flagUrl: findFlagUrlByIso2Code(country.code)
}))

export const uk = countryList.find((country) => country.code === "GB")

export const getDialCodeFromCountryCode = (countryCode: string): string => {
	return countryList.find((item) => item.code === countryCode)?.dial_code || ""
}

export const getCountryCodeFromDialCode = (dialCode: string): string => {
	return countryList.find((item) => item.dial_code === dialCode)?.code || "";
}

export const splitPhoneNumber = (mobile: string) => {
	let split = mobile.split(/\s/);
	
	return {
		dial_code: split[0],
		number: split[1]
	}
}