<script>
	import { getContext } from 'svelte';
	import { createEventDispatcher } from 'svelte/internal';
	import { slide } from 'svelte/transition';
	const dispatch = createEventDispatcher();
	export let open = false;
	export let id = String(Math.random());
	const cBase = '';
	const cControl = 'text-left w-full flex items-center space-x-4';
	const cControlCaret = 'fill-current w-3 transition-transform duration-[200ms]';
	const cPanel = '';
	export let autocollapse = getContext('autocollapse');
	export let active = getContext('active');
	export let duration = getContext('duration');
	export let disabled = getContext('disabled');
	export let padding = getContext('padding');
	export let hover = getContext('hover');
	export let rounded = getContext('rounded');
	export let caretOpen = getContext('caretOpen');
	export let caretClosed = getContext('caretClosed');
	export let regionControl = getContext('regionControl');
	export let regionPanel = getContext('regionPanel');
	export let regionCaret = getContext('regionCaret');
	function setActive(event) {
		if (autocollapse === true) {
			active.set(id);
		} else {
			open = !open;
		}
		onToggle(event);
	}
	function onToggle(event) {
		const currentOpenState = autocollapse ? $active === id : open;
		dispatch('toggle', { event, id: `accordion-control-${id}`, open: currentOpenState, autocollapse });
	}
	if (autocollapse && open) setActive();
	$: if (open && autocollapse) setActive();
	$: openState = autocollapse ? $active === id : open;
	$: classesBase = `${cBase} ${$$props.class ?? ''}`;
	$: classesControl = `${cControl} ${padding} ${hover} ${rounded} ${regionControl}`;
	$: classesCaretState = openState ? caretOpen : caretClosed;
	$: classesControlCaret = `${cControlCaret} ${regionCaret} ${classesCaretState}`;
	$: classesPanel = `${cPanel} ${padding} ${rounded} ${regionPanel}`;
</script>

<!-- @component The Accordion child element. -->

<div class="accordion-item {classesBase}" data-testid="accordion-item">
	<!-- Control -->
	<button
		type="button"
		class="accordion-control {classesControl}"
		id="accordion-control-{id}"
		on:click={setActive}
		on:click
		on:keydown
		on:keyup
		on:keypress
		aria-expanded={openState}
		aria-controls="accordion-panel-{id}"
		{disabled}
	>
		<!-- Lead -->
		{#if $$slots.lead}
			<div class="accordion-lead">
				<slot name="lead" />
			</div>
		{/if}
		<!-- Summary -->
		<div class="accordion-summary flex-1">
			<slot name="summary">(summary)</slot>
		</div>
		<!-- Caret -->
		<div class="accordion-summary-caret {classesControlCaret}">
			<!-- SVG Caret -->
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
				<path
					d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
				/>
			</svg>
		</div>
	</button>
	<!-- Panel -->
	{#if openState}
		<div
			class="accordion-panel {classesPanel}"
			id="accordion-panel-{id}"
			transition:slide|local={{ duration }}
			role="region"
			aria-hidden={!openState}
			aria-labelledby="accordion-control-{id}"
		>
			<slot name="content">(content)</slot>
		</div>
	{/if}
</div>
