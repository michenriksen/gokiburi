<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	export let selected = writable(void 0);
	export let background = 'bg-surface-100-800-token';
	export let border = '';
	export let active = 'bg-primary-active-token';
	export let hover = 'bg-primary-hover-token';
	export let width = 'w-[70px] sm:w-20';
	export let height = 'h-full';
	export let gap = 'gap-0';
	export let regionLead = '';
	export let regionDefault = '';
	export let regionTrail = '';
	setContext('selected', selected);
	setContext('active', active);
	setContext('hover', hover);
	const cBase = 'grid grid-rows-[auto_1fr_auto] overflow-y-auto';
	$: classesBase = `${cBase} ${background} ${border} ${width} ${height} ${gap} ${$$props.class || ''}`;
</script>

<!-- @component A vertical navigation rail component. -->

<div class="app-rail {classesBase}">
	<!-- Slot: lead -->
	<div class="app-bar-lead {regionLead}"><slot name="lead" /></div>
	<!-- Slot: Default -->
	<div class="app-bar-default {regionDefault}"><slot /></div>
	<!-- Slot: lead -->
	<div class="app-bar-trail {regionTrail}"><slot name="trail" /></div>
</div>
