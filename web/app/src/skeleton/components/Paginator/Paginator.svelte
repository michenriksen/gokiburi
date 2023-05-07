<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let settings = { offset: 0, limit: 5, size: 0, amounts: [1, 2, 5, 10] };
	export let disabled = false;
	export let select = 'select min-w-[150px]';
	export let justify = 'justify-between';
	export let text = 'text-xs';
	export let amountText = 'Items';
	export let buttonClasses = 'btn-icon variant-filled';
	export let buttonTextPrevious = '&larr;';
	export let buttonTextNext = '&rarr;';
	const cBase = 'flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4';
	const cLabel = 'w-full md:w-auto';
	const cPageText = 'whitespace-nowrap';
	function onChangeLength() {
		settings.offset = 0;
		dispatch('amount', settings.limit);
	}
	function onPrev() {
		settings.offset--;
		dispatch('page', settings.offset);
	}
	function onNext() {
		settings.offset++;
		dispatch('page', settings.offset);
	}
	$: classesBase = `${cBase} ${justify} ${$$props.class ?? ''}`;
	$: classesLabel = `${cLabel}`;
	$: classesSelect = `${select}`;
	$: classesPageText = `${cPageText} ${text}`;
</script>

<!-- prettier-ignore -->
<div class="paginator {classesBase}" data-testid="paginator">
	<!-- Select Amount -->
	<label class="paginator-label {classesLabel}">
		<select bind:value={settings.limit} on:change={() => { onChangeLength() }} class="paginator-select {classesSelect}" {disabled} aria-label="Select Amount">
			{#each settings.amounts as amount}<option value={amount}>{amount} {amountText}</option>{/each}
		</select>
	</label>
	<!-- Details -->
	<span class="paginator-details {classesPageText}">
		{settings.offset * settings.limit + 1} - {Math.min(settings.offset * settings.limit + settings.limit, settings.size)} <span class="opacity-50 px-2">/</span> <strong>{settings.size}</strong>
	</span>
	<!-- Arrows -->
	<div class="paginator-arrows space-x-2">
		<button type="button" class="{buttonClasses}" on:click={() => { onPrev() }} disabled={disabled || settings.offset === 0}>
			{@html buttonTextPrevious}
		</button>
		<button type="button" class="{buttonClasses}" on:click={() => { onNext() }} disabled={disabled || (settings.offset + 1) * settings.limit >= settings.size}>
			{@html buttonTextNext}
		</button>
	</div>
</div>
