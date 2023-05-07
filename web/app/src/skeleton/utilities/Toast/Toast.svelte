<script>
	import { crossfade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import { toastStore } from './stores';
	export let position = 'b';
	export let max = 3;
	export let duration = 250;
	export let background = 'variant-filled-secondary';
	export let width = 'max-w-[640px]';
	export let color = '';
	export let padding = 'p-4';
	export let spacing = 'space-x-4';
	export let rounded = 'rounded-container-token';
	export let shadow = 'shadow-lg';
	export let zIndex = 'z-[888]';
	export let buttonAction = 'btn variant-filled';
	export let buttonDismiss = 'btn-icon btn-icon-sm variant-filled';
	export let buttonDismissLabel = '\u2715';
	const cWrapper = 'flex fixed top-0 left-0 right-0 bottom-0 pointer-events-none';
	const cSnackbar = 'flex flex-col space-y-2';
	const cToast = 'flex justify-between items-center pointer-events-auto';
	const cToastActions = 'flex items-center space-x-2';
	let cPosition;
	let cAlign;
	let animAxis = { x: 0, y: 0 };
	switch (position) {
		case 't':
			cPosition = 'justify-center items-start';
			cAlign = 'items-center';
			animAxis = { x: 0, y: -100 };
			break;
		case 'b':
			cPosition = 'justify-center items-end';
			cAlign = 'items-center';
			animAxis = { x: 0, y: 100 };
			break;
		case 'l':
			cPosition = 'justify-start items-center';
			cAlign = 'items-start';
			animAxis = { x: -100, y: 0 };
			break;
		case 'r':
			cPosition = 'justify-end items-center';
			cAlign = 'items-end';
			animAxis = { x: 100, y: 0 };
			break;
		case 'tl':
			cPosition = 'justify-start items-start';
			cAlign = 'items-start';
			animAxis = { x: -100, y: 0 };
			break;
		case 'tr':
			cPosition = 'justify-end items-start';
			cAlign = 'items-end';
			animAxis = { x: 100, y: 0 };
			break;
		case 'bl':
			cPosition = 'justify-start items-end';
			cAlign = 'items-start';
			animAxis = { x: -100, y: 0 };
			break;
		case 'br':
			cPosition = 'justify-end items-end';
			cAlign = 'items-end';
			animAxis = { x: 100, y: 0 };
			break;
	}
	function onAction(index) {
		$toastStore[index]?.action?.response();
		toastStore.close($toastStore[index].id);
	}
	$: classesWrapper = `${cWrapper} ${cPosition} ${zIndex} ${$$props.class || ''}`;
	$: classesSnackbar = `${cSnackbar} ${cAlign} ${padding}`;
	$: classesToast = `${cToast} ${width} ${color} ${padding} ${spacing} ${rounded} ${shadow}`;
	$: filteredToasts = Array.from($toastStore).slice(0, max);
	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * duration),
		fallback(node) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;
			return {
				duration,
				easing: cubicInOut,
				css: (t, u) => `
					transform: ${transform} scale(${t}) translate(${u * animAxis.x}%, ${u * animAxis.y}%);
					opacity: ${t}
				`
			};
		}
	});
</script>

{#if $toastStore.length}
	<!-- Wrapper -->
	<div class="snackbar-wrapper {classesWrapper}" data-testid="snackbar-wrapper">
		<!-- List -->
		<div class="snackbar {classesSnackbar}">
			{#each filteredToasts as t, i (t)}
				<div animate:flip={{ duration }} in:receive={{ key: t.id }} out:send={{ key: t.id }}>
					<!-- Toast -->
					<div
						class="toast {classesToast} {t.background ?? background} {t.classes}"
						role="alert"
						aria-live="polite"
						data-testid="toast"
					>
						<div class="text-base">{@html t.message}</div>
						<div class="toast-actions {cToastActions}">
							{#if t.action}<button class={buttonAction} on:click={() => onAction(i)}>{@html t.action.label}</button
								>{/if}
							<button class={buttonDismiss} on:click={() => toastStore.close(t.id)}>{buttonDismissLabel}</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
