declare module "*.svg" {
	import React = require("react");
	const src: React.FC<React.SVGProps<SVGSVGElement> & {className: string}>;
	export default src;
}