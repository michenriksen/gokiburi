<script>
	import { createEventDispatcher } from 'svelte/internal';
	import { fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	const dispatch = createEventDispatcher();
	export let input = '';
	export let name;
	export let value = [];
	export let whitelist = [];
	export let max = -1;
	export let minlength = -1;
	export let maxlength = -1;
	export let allowUpperCase = false;
	export let allowDuplicates = false;
	export let validation = () => true;
	export let duration = 150;
	export let required = false;
	export let chips = 'variant-filled';
	export let invalid = 'input-error';
	export let padding = 'p-2';
	export let rounded = 'rounded-container-token';
	const cBase = 'textarea cursor-pointer';
	const cInterface = 'space-y-4';
	const cChipList = 'flex flex-wrap gap-2';
	const cInputField = 'unstyled bg-transparent border-0 !ring-0 p-0 w-full';
	let inputValid = true;
	let chipValues = value.map((val) => {
		return { val, id: Math.random() };
	});
	function onInputHandler() {
		inputValid = true;
	}
	function validate() {
		if (!input) return false;
		input = input.trim();
		if (validation !== void 0 && !validation(input)) return false;
		if (max !== -1 && value.length >= max) return false;
		if (minlength !== -1 && input.length < minlength) return false;
		if (maxlength !== -1 && input.length > maxlength) return false;
		if (whitelist.length > 0 && !whitelist.includes(input)) return false;
		if (allowDuplicates === false && value.includes(input)) return false;
		return true;
	}
	function addChip(event) {
		event.preventDefault();
		inputValid = validate();
		if (inputValid === false) {
			dispatch('invalid', { event, input });
			return;
		}
		input = allowUpperCase ? input : input.toLowerCase();
		value.push(input);
		value = value;
		chipValues.push({ val: input, id: Math.random() });
		chipValues = chipValues;
		dispatch('add', { event, chipIndex: value.length - 1, chipValue: input });
		input = '';
	}
	function removeChip(event, chipIndex, chipValue) {
		if ($$restProps.disabled) return;
		value.splice(chipIndex, 1);
		value = value;
		chipValues.splice(chipIndex, 1);
		chipValues = chipValues;
		dispatch('remove', { event, chipIndex, chipValue });
	}
	$: classesInvalid = inputValid === false ? invalid : '';
	$: classesBase = `${cBase} ${padding} ${rounded} ${$$props.class ?? ''} ${classesInvalid}`;
	$: classesInterface = `${cInterface}`;
	$: classesChipList = `${cChipList}`;
	$: classesInputField = `${cInputField}`;
	$: chipValues = value.map((val, i) => {
		if (chipValues[i]?.val === val) return chipValues[i];
		return { id: Math.random(), val };
	});
</script>

<div class="input-chip {classesBase}" class:opacity-50={$$restProps.disabled}>
	<!-- NOTE: Don't use `hidden` as it prevents `required` from operating -->
	<div class="h-0 overflow-hidden">
		<select bind:value {name} multiple {required} tabindex="-1">
			<!-- NOTE: options are required! -->
			{#each value as option}<option value={option}>{option}</option>{/each}
		</select>
	</div>
	<!-- Interface -->
	<div class="input-chip-interface {classesInterface}">
		<!-- Input Field -->
		<form on:submit={addChip}>
			<input
				type="text"
				bind:value={input}
				placeholder={$$restProps.placeholder ?? 'Enter values...'}
				class="input-chip-field {classesInputField}"
				on:input={onInputHandler}
				on:input
				disabled={$$restProps.disabled}
			/>
		</form>
		<!-- Chip List -->
		{#if chipValues.length}
			<div class="input-chip-list {classesChipList}" transition:fly|local={{ duration, opacity: 0, y: -20 }}>
				{#each chipValues as { id, val }, i (id)}
					<!-- Wrapping div required for FLIP animation -->
					<div animate:flip={{ duration }}>
						<button
							type="button"
							class="chip {chips}"
							on:click={(e) => {
								removeChip(e, i, val);
							}}
							on:click
							on:keypress
							on:keydown
							on:keyup
							transition:scale|local={{ duration, opacity: 0 }}
						>
							<span>{val}</span>
							<span>✕</span>
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
