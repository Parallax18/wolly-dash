declare module "country-flags-svg" {
	export interface CountryFlagItem {
		name: string,
		demonym: string,
		flag: string,
		iso2: string,
		iso3: string
	}

	export const countries: CountryFlagItem[];
	export const findFlagUrlByIso2Code: (iso2Code: string) => CountryFlagItem
	export const findFlagUrlByIso3Code: (iso3Code: string) => CountryFlagItem
	export const findFlagUrlByCountryName: (name: string) => CountryFlagItem
	export const findFlagUrlByNationality: (nationality: string) => CountryFlagItem
}