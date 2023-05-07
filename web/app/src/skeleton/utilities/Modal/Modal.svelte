<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	const dispatch = createEventDispatcher();
	import { focusTrap } from '../../actions/FocusTrap/focusTrap';
	import { modalStore } from './stores';
	export let position = 'items-center';
	export let components = {};
	export let duration = 150;
	export let flyOpacity = 0;
	export let flyX = 0;
	export let flyY = 100;
	export let background = 'bg-surface-100-800-token';
	export let width = 'w-modal';
	export let height = 'h-auto';
	export let padding = 'p-4';
	export let spacing = 'space-y-4';
	export let rounded = 'rounded-container-token';
	export let shadow = 'shadow-xl';
	export let zIndex = 'z-[999]';
	export let buttonNeutral = 'variant-ghost-surface';
	export let buttonPositive = 'variant-filled';
	export let buttonTextCancel = 'Cancel';
	export let buttonTextConfirm = 'Confirm';
	export let buttonTextSubmit = 'Submit';
	export let regionBackdrop = 'bg-surface-backdrop-token';
	export let regionHeader = 'text-2xl font-bold';
	export let regionBody = 'max-h-[200px] overflow-hidden';
	export let regionFooter = 'flex justify-end space-x-2';
	const cBackdrop = 'fixed top-0 left-0 right-0 bottom-0';
	const cTransitionLayer = 'w-full h-full p-4 overflow-y-auto flex justify-center';
	const cModal = 'block';
	const cModalImage = 'w-full h-auto';
	let promptValue;
	const buttonTextDefaults = {
		buttonTextCancel,
		buttonTextConfirm,
		buttonTextSubmit
	};
	let currentComponent;
	modalStore.subscribe((modals) => {
		if (!modals.length) return;
		if (modals[0].type === 'prompt') promptValue = modals[0].value;
		buttonTextCancel = modals[0].buttonTextCancel || buttonTextDefaults.buttonTextCancel;
		buttonTextConfirm = modals[0].buttonTextConfirm || buttonTextDefaults.buttonTextConfirm;
		buttonTextSubmit = modals[0].buttonTextSubmit || buttonTextDefaults.buttonTextSubmit;
		currentComponent = typeof modals[0].component === 'string' ? components[modals[0].component] : modals[0].component;
	});
	function onBackdropInteraction(event) {
		if (!(event.target instanceof Element)) return;
		const classList = event.target.classList;
		if (classList.contains('modal-backdrop') || classList.contains('modal-transition')) {
			if ($modalStore[0].response) $modalStore[0].response(void 0);
			modalStore.close();
			dispatch('backdrop', event);
		}
	}
	function onClose() {
		if ($modalStore[0].response) $modalStore[0].response(false);
		modalStore.close();
	}
	function onConfirm() {
		if ($modalStore[0].response) $modalStore[0].response(true);
		modalStore.close();
	}
	function onPromptSubmit(event) {
		event.preventDefault();
		if ($modalStore[0].response) $modalStore[0].response(promptValue);
		modalStore.close();
	}
	function onKeyDown(event) {
		if (!$modalStore.length) return;
		if (event.code === 'Escape') onClose();
	}
	$: cPosition = $modalStore[0]?.position ?? position;
	$: classesBackdrop = `${cBackdrop} ${regionBackdrop} ${zIndex} ${$$props.class ?? ''} ${
		$modalStore[0]?.backdropClasses ?? ''
	}`;
	$: classesTransitionLayer = `${cTransitionLayer} ${cPosition ?? ''}`;
	$: classesModal = `${cModal} ${background} ${width} ${height} ${padding} ${spacing} ${rounded} ${shadow} ${
		$modalStore[0]?.modalClasses ?? ''
	}`;
	$: parent = {
		position,
		// ---
		duration,
		flyOpacity,
		flyX,
		flyY,
		// ---
		background,
		width,
		height,
		padding,
		spacing,
		rounded,
		shadow,
		// ---
		buttonNeutral,
		buttonPositive,
		buttonTextCancel,
		buttonTextConfirm,
		buttonTextSubmit,
		// ---
		regionBackdrop,
		regionHeader,
		regionBody,
		regionFooter,
		// ---
		onClose
	};
</script>

<svelte:window on:keydown={onKeyDown} />

{#if $modalStore.length > 0}
	{#key $modalStore}
		<!-- Backdrop -->
		<div
			class="modal-backdrop {classesBackdrop}"
			data-testid="modal-backdrop"
			on:mousedown={onBackdropInteraction}
			on:touchstart={onBackdropInteraction}
			transition:fade={{ duration }}
			use:focusTrap={true}
		>
			<!-- Transition Layer -->
			<div
				class="modal-transition {classesTransitionLayer}"
				transition:fly={{ duration, opacity: flyOpacity, x: flyX, y: flyY }}
			>
				{#if $modalStore[0].type !== 'component'}
					<!-- Modal: Presets -->
					<div
						class="modal {classesModal}"
						data-testid="modal"
						role="dialog"
						aria-modal="true"
						aria-label={$modalStore[0].title ?? ''}
						transition:fly={{ duration, opacity: 0, y: 100 }}
					>
						<!-- Header -->
						{#if $modalStore[0]?.title}
							<header class="modal-header {regionHeader}">{@html $modalStore[0].title}</header>
						{/if}
						<!-- Body -->
						{#if $modalStore[0]?.body}
							<article class="modal-body {regionBody}">{@html $modalStore[0].body}</article>
						{/if}
						<!-- Image -->
						{#if $modalStore[0]?.image && typeof $modalStore[0]?.image === 'string'}
							<img class="modal-image {cModalImage}" src={$modalStore[0]?.image} alt="Modal" />
						{/if}
						<!-- Type -->
						{#if $modalStore[0].type === 'alert'}
							<!-- Template: Alert -->
							<footer class="modal-footer {regionFooter}">
								<button type="button" class="btn {buttonNeutral}" on:click={onClose}>{buttonTextCancel}</button>
							</footer>
						{:else if $modalStore[0].type === 'confirm'}
							<!-- Template: Confirm -->
							<footer class="modal-footer {regionFooter}">
								<button type="button" class="btn {buttonNeutral}" on:click={onClose}>{buttonTextCancel}</button>
								<button type="button" class="btn {buttonPositive}" on:click={onConfirm}>{buttonTextConfirm}</button>
							</footer>
						{:else if $modalStore[0].type === 'prompt'}
							<!-- Template: Prompt -->
							<form class="space-y-4" on:submit={onPromptSubmit}>
								<input
									class="modal-prompt-input input"
									name="prompt"
									type="text"
									bind:value={promptValue}
									{...$modalStore[0].valueAttr}
								/>
								<footer class="modal-footer {regionFooter}">
									<button type="button" class="btn {buttonNeutral}" on:click={onClose}>{buttonTextCancel}</button>
									<button type="submit" class="btn {buttonPositive}">{buttonTextSubmit}</button>
								</footer>
							</form>
						{/if}
					</div>
				{:else}
					<!-- Modal: Components -->
					<!-- Note: keep `contents` class to allow widths from children -->
					<div
						class="modal contents {$modalStore[0].modalClasses ?? ''}"
						data-testid="modal-component"
						role="dialog"
						aria-modal="true"
						aria-label={$modalStore[0].title ?? ''}
					>
						<svelte:component this={currentComponent?.ref} {...currentComponent?.props} {parent}>
							{#if currentComponent?.slot}
								{@html currentComponent?.slot}
							{/if}
						</svelte:component>
					</div>
				{/if}
			</div>
		</div>
	{/key}
{/if}
