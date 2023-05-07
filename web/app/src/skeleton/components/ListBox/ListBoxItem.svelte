<script>
	import { getContext } from 'svelte';
	export let group;
	export let name;
	export let value;
	export let multiple = getContext('multiple');
	export let rounded = getContext('rounded');
	export let active = getContext('active');
	export let hover = getContext('hover');
	export let padding = getContext('padding');
	const cBase = 'cursor-pointer -outline-offset-[3px]';
	const cLabel = 'flex space-x-4';
	let checked;
	let elemInput;
	$: if (multiple) updateCheckbox(group);
	$: if (multiple) updateGroup(checked);
	function updateCheckbox(group2) {
		checked = group2.indexOf(value) >= 0;
	}
	function updateGroup(checked2) {
		const index = group.indexOf(value);
		if (checked2) {
			if (index < 0) {
				group.push(value);
				group = group;
			}
		} else {
			if (index >= 0) {
				group.splice(index, 1);
				group = group;
			}
		}
	}
	function onKeyDown(event) {
		if (['Enter', 'Space'].includes(event.code)) {
			event.preventDefault();
			elemInput.click();
		}
	}
	$: selected = multiple ? group.includes(value) : group === value;
	$: classesActive = selected ? active : hover;
	$: classesBase = `${cBase} ${rounded} ${padding} ${classesActive} ${$$props.class ?? ''}`;
	$: classesLabel = `${cLabel}`;
</script>

<label>
	<!-- A11y attributes are not allowed on <label> -->
	<div
		class="listbox-item {classesBase}"
		data-testid="listbox-item"
		role="option"
		aria-selected={selected}
		tabindex="0"
		on:keydown={onKeyDown}
		on:keydown
		on:keyup
		on:keypress
	>
		<!-- NOTE: Don't use `hidden` as it prevents `required` from operating -->
		<div class="h-0 w-0 overflow-hidden">
			{#if multiple}
				<input bind:this={elemInput} type="checkbox" {name} {value} bind:checked tabindex="-1" on:click on:change />
			{:else}
				<input bind:this={elemInput} type="radio" bind:group {name} {value} tabindex="-1" on:click on:change />
			{/if}
		</div>
		<!-- <slot /> -->
		<div class="listbox-label {classesLabel}">
			<!-- Slot: Lead -->
			{#if $$slots.lead}<div class="listbox-label-lead"><slot name="lead" /></div>{/if}
			<!-- Slot: Default -->
			<div class="listbox-label-content flex-1"><slot /></div>
			<!-- Slot: Trail -->
			{#if $$slots.trail}<div class="listbox-label-trail"><slot name="trail" /></div>{/if}
		</div>
	</div>
</label>
