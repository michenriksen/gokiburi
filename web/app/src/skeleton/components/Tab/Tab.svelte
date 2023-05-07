<script>
	import { getContext } from 'svelte';
	export let group;
	export let name;
	export let value;
	export let controls = '';
	export let active = getContext('active');
	export let hover = getContext('hover');
	export let flex = getContext('flex');
	export let padding = getContext('padding');
	export let rounded = getContext('rounded');
	export let spacing = getContext('spacing');
	const cBase = 'text-center cursor-pointer transition-colors duration-100';
	const cInterface = '';
	let elemInput;
	function onKeyDown(event) {
		if (['Enter', 'Space'].includes(event.code)) {
			event.preventDefault();
			elemInput.click();
		}
	}
	$: selected = value === group;
	$: classesActive = selected ? active : hover;
	$: classesBase = `${cBase} ${flex} ${padding} ${rounded} ${classesActive} ${$$props.class ?? ''}`;
	$: classesInterface = `${cInterface} ${spacing}`;
	function prunedRestProps() {
		delete $$restProps.class;
		return $$restProps;
	}
</script>

<label>
	<!-- A11y attributes are not allowed on <label> -->
	<div
		class="tab {classesBase}"
		data-testid="tab"
		role="tab"
		aria-controls={controls}
		aria-selected={selected}
		tabindex="0"
		on:keydown={onKeyDown}
		on:keydown
		on:keyup
		on:keypress
	>
		<!-- NOTE: Don't use `hidden` as it prevents `required` from operating -->
		<div class="h-0 w-0 overflow-hidden">
			<input
				bind:this={elemInput}
				type="radio"
				bind:group
				{name}
				{value}
				{...prunedRestProps()}
				tabindex="-1"
				on:click
				on:change
			/>
		</div>
		<!-- Interface -->
		<div class="tab-interface {classesInterface}">
			{#if $$slots.lead}<div class="tab-lead"><slot name="lead" /></div>{/if}
			<div class="tab-label"><slot /></div>
		</div>
	</div>
</label>
