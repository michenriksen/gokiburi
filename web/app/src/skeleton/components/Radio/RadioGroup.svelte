<script>
	import { setContext } from 'svelte';
	export let display = 'inline-flex';
	export let background = 'bg-surface-200-700-token';
	export let border = 'border-token border-surface-400-500-token';
	export let spacing = 'space-x-1';
	export let rounded = 'rounded-token';
	export let padding = 'px-4 py-1';
	export let active = 'variant-filled';
	export let hover = 'hover:variant-soft';
	export let color = '';
	export let fill = '';
	export let labelledby = '';
	setContext('rounded', rounded);
	setContext('padding', padding);
	setContext('active', active);
	setContext('hover', hover);
	setContext('color', color);
	setContext('fill', fill);
	const cBase = 'p-1';
	$: classesBase = `${cBase} ${display} ${background} ${border} ${spacing} ${rounded} ${$$props.class ?? ''}`;
</script>

<div class="radio-group {classesBase}" data-testid="radio-group" role="radiogroup" aria-labelledby={labelledby}>
	<slot />
</div>
