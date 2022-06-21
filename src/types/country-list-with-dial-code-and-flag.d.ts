declare module "country-list-with-dial-code-and-flag" {
	export interface CountryItem {
		name: string,
		dial_code: string,
		code: string,
		flag: string
	}
	const list: CountryItem[];
	export default list;
}