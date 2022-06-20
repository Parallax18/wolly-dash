export const calculateTextBounds = (text: string, className?: string | string[]): DOMRect => {
	let elem = document.createElement("div")
	elem.style.display = "inline-block"
	elem.style.alignSelf = "flex-start"
	if (className) {
		let classArr = []
		if (!Array.isArray(className)) classArr = [className]
		else classArr = className
		classArr.forEach((currClass) => {
			elem.classList.add(currClass)
		})
	}
	elem.innerText = text
	document.body.appendChild(elem)
	const bounds = elem.getBoundingClientRect()
	document.body.removeChild(elem)
	return bounds
}