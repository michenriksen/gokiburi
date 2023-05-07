<script>
	import { createEventDispatcher, getContext } from 'svelte';
	const dispatch = createEventDispatcher();
	export let value = void 0;
	export let tag = 'button';
	export let label = '';
	export let regionIcon = '';
	export let regionLabel = '';
	export let selected = getContext('selected');
	export let active = getContext('active');
	export let hover = getContext('hover');
	const cBase = 'unstyled grid place-content-center place-items-center w-full aspect-square space-y-1.5 cursor-pointer';
	const cLabel = 'font-bold text-xs text-center';
	function onClickHandler(event) {
		if (!String($selected) || !String(value)) return;
		$selected = value;
		dispatch('click', event);
	}
	$: classesActive = String($selected) && String(value) && $selected === value ? `${active}` : '';
	$: classesBase = `${cBase} ${hover} ${classesActive} ${$$props.class || ''}`;
	$: classesLabel = `${cLabel} ${regionLabel}`;
	function prunedRestProps() {
		delete $$restProps.class;
		return $$restProps;
	}
</script>

<!-- @component A navigation tile for the App Rail component. -->

<div on:click={onClickHandler} on:keydown on:keyup on:keypress>
	<!-- IMPORTANT: avoid forwarding events on <svelte:element> tags per: -->
	<!-- https://github.com/skeletonlabs/skeleton/issues/727#issuecomment-1356859261 -->
	<svelte:element this={tag} {...prunedRestProps()} class="app-rail-tile {classesBase}">
		<!-- Slot: Default (icon) -->
		{#if $$slots.default}
			<div class="app-rail-tile-icon {regionIcon}"><slot /></div>
		{/if}
		<!-- Label -->
		{#if label}
			<div class="app-rail-tile-label {classesLabel}">{label}</div>
		{/if}
	</svelte:element>
</div>
