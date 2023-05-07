<script>
	export let files = void 0;
	export let name;
	export let width = '';
	export let button = 'variant-filled';
	const cButton = 'btn';
	let elemFileInput;
	function onButtonClick() {
		elemFileInput.click();
	}
	function prunedRestProps() {
		delete $$restProps.class;
		return $$restProps;
	}
	$: classesBase = `${$$props.class ?? ''}`;
	$: classesButton = `${cButton} ${button} ${width}`;
</script>

<div class="file-button {classesBase}" data-testid="file-button">
	<!-- NOTE: Don't use `hidden` as it prevents `required` from operating -->
	<div class="w-0 h-0 overflow-hidden">
		<input type="file" bind:this={elemFileInput} bind:files {name} {...prunedRestProps()} on:change />
	</div>
	<!-- Button -->
	<button
		type="button"
		class="file-button-btn {classesButton}"
		disabled={$$restProps.disabled}
		on:click={onButtonClick}
		on:keydown
		on:keyup
		on:keypress
	>
		<slot>Select a File</slot>
	</button>
</div>
