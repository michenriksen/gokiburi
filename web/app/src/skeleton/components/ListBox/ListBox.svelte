<script>
	import { setContext } from 'svelte';
	export let multiple = false;
	export let spacing = 'space-y-1';
	export let rounded = 'rounded-token';
	export let active = 'variant-filled';
	export let hover = 'hover:variant-soft';
	export let padding = 'px-4 py-2';
	export let labelledby = '';
	setContext('multiple', multiple);
	setContext('rounded', rounded);
	setContext('active', active);
	setContext('hover', hover);
	setContext('padding', padding);
	const cBase = '';
	$: classesBase = `${cBase} ${spacing} ${rounded} ${$$props.class ?? ''}`;
</script>

<div class="listbox {classesBase}" role="listbox" aria-labelledby={labelledby} data-testid="listbox">
	<slot />
</div>
