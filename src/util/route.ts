export const routeMatchesExact = (basePath: string | undefined, pathToMatch: string | undefined): boolean => {
	if (!basePath || !pathToMatch) return false;
	let baseSplit = basePath.split("/")
	let pathToMatchSplit = pathToMatch.split("/")
	if (baseSplit.length !== pathToMatchSplit.length) return false;

	let valid = true
	baseSplit.forEach((pathItem, i) => {
		if (pathItem !== pathToMatchSplit[i]) valid = false
	})

	return valid;
}