<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let input = void 0;
	export let options = [];
	export let allowlist = [];
	export let denylist = [];
	export let emptyState = 'No Results Found.';
	export let regionNav = '';
	export let regionList = 'list-nav';
	export let regionItem = '';
	export let regionButton = 'w-full';
	export let regionEmpty = 'text-center';
	export let whitelist = [];
	export let blacklist = [];
	export let duration = 200;
	const deprecated = [whitelist, blacklist, duration];
	let listedOptions = options;
	function filterByAllowed() {
		if (allowlist.length) {
			listedOptions = [...options].filter((option) => allowlist.includes(option.value));
		} else {
			listedOptions = [...options];
		}
	}
	function filterByDenied() {
		if (denylist.length) {
			const denySet = new Set(denylist);
			listedOptions = [...options].filter((option) => !denySet.has(option.value));
		} else {
			listedOptions = [...options];
		}
	}
	function filterOptions() {
		let _options = [...listedOptions];
		_options = _options.filter((option) => {
			const inputFormatted = String(input).toLowerCase().trim();
			let optionFormatted = JSON.stringify([option.label, option.value, option.keywords]).toLowerCase();
			if (optionFormatted.includes(inputFormatted)) return option;
		});
		return _options;
	}
	function onSelection(option) {
		dispatch('selection', option);
	}
	$: if (allowlist) filterByAllowed();
	$: if (denylist) filterByDenied();
	$: optionsFiltered = input ? filterOptions() : listedOptions;
	$: classesBase = `${$$props.class ?? ''}`;
	$: classesNav = `${regionNav}`;
	$: classesList = `${regionList}`;
	$: classesItem = `${regionItem}`;
	$: classesButton = `${regionButton}`;
	$: classesEmpty = `${regionEmpty}`;
</script>

<!-- animate:flip={{ duration }} transition:slide|local={{ duration }} -->
<div class="autocomplete {classesBase}" data-testid="autocomplete">
	{#if optionsFiltered.length > 0}
		<nav class="autocomplete-nav {classesNav}">
			<ul class="autocomplete-list {classesList}">
				{#each optionsFiltered as option, i (option)}
					<li class="autocomplete-item {classesItem}">
						<button
							class="autocomplete-button {classesButton}"
							type="button"
							on:click={() => onSelection(option)}
							on:click
							on:keypress
						>
							{@html option.label}
						</button>
					</li>
				{/each}
			</ul>
		</nav>
	{:else}
		<div class="autocomplete-empty {classesEmpty}">{emptyState}</div>
	{/if}
</div>
