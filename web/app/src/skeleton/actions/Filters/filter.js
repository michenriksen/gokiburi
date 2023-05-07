// Action: Filter
export function filter(node, filterName) {
	// Return if Firefox browser
	const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
	if (isFirefox) return;
	// Return if no filterName provided
	if (filterName === undefined) return;
	const applyFilter = () => {
		node.setAttribute('style', `filter: url("${filterName}")`);
	};
	applyFilter();
	return {
		update(newArgs) {
			filterName = newArgs;
			applyFilter();
		}
	};
}
