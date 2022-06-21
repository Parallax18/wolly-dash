declare module "object-deep-update" {
	const objectDeepUpdate: <T = Record<string, any>>(ob1: T, obj2: T) => T
	export default objectDeepUpdate;
}