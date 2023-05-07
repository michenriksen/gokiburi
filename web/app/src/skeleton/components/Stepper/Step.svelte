<!-- Reference: https://dribbble.com/shots/16221169-Figma-Material-Ui-components-Steppers-and-sliders -->
<script>
	import { getContext, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	export let locked = false;
	export let regionHeader = '';
	export let regionContent = '';
	export let regionNavigation = '';
	export let state = getContext('state');
	export let dispatchParent = getContext('dispatchParent');
	export let stepTerm = getContext('stepTerm');
	export let gap = getContext('gap');
	export let justify = getContext('justify');
	export let buttonBack = getContext('buttonBack');
	export let buttonBackType = getContext('buttonBackType');
	export let buttonBackLabel = getContext('buttonBackLabel');
	export let buttonNext = getContext('buttonNext');
	export let buttonNextType = getContext('buttonNextType');
	export let buttonNextLabel = getContext('buttonNextLabel');
	export let buttonComplete = getContext('buttonComplete');
	export let buttonCompleteType = getContext('buttonCompleteType');
	export let buttonCompleteLabel = getContext('buttonCompleteLabel');
	const stepIndex = $state.total;
	$state.total++;
	const cBase = 'space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cContent = 'space-y-4';
	const cNavigation = 'flex';
	async function onNext() {
		await new Promise((resolve) => setTimeout(resolve));
		if (locked) return;
		$state.current++;
		dispatchParent('next', { step: stepIndex, state: $state });
		dispatchParent('step', { step: stepIndex, state: $state });
	}
	function onBack() {
		$state.current--;
		dispatchParent('back', { step: stepIndex, state: $state });
		dispatchParent('step', { step: stepIndex, state: $state });
	}
	function onComplete() {
		dispatchParent('complete', { step: stepIndex, state: $state });
	}
	$: classesBase = `${cBase} ${$$props.class ?? ''}`;
	$: classesHeader = `${cHeader} ${regionHeader}`;
	$: classesContent = `${cContent} ${regionContent}`;
	$: classesNavigation = `${cNavigation} ${justify} ${gap} ${regionNavigation}`;
	onDestroy(() => {
		$state.total--;
	});
</script>

{#if stepIndex === $state.current}
	<div class="step {classesBase}" data-testid="step">
		<!-- Slot: Header -->
		<header class="step-header {classesHeader}">
			<slot name="header">{stepTerm} {stepIndex + 1}</slot>
		</header>
		<!-- Slot: Default -->
		<div class="step-content {classesContent}">
			<slot>({stepTerm} {stepIndex + 1} Content)</slot>
		</div>
		<!-- Navigation -->
		{#if $state.total > 1}
			<div class="step-navigation {classesNavigation}" transition:fade|local={{ duration: 100 }}>
				<button type={buttonBackType} class="btn {buttonBack}" on:click={onBack} disabled={$state.current === 0}
					>{@html buttonBackLabel}</button
				>
				{#if stepIndex < $state.total - 1}
					<button type={buttonNextType} class="btn {buttonNext}" on:click={onNext} disabled={locked}>
						{#if locked}
							<svg class="w-3 aspect-square" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
								<path
									d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"
								/>
							</svg>
						{/if}
						<span>{@html buttonNextLabel}</span>
					</button>
				{:else}
					<button type={buttonCompleteType} class="btn {buttonComplete}" on:click={onComplete} disabled={locked}>
						{@html buttonCompleteLabel}
					</button>
				{/if}
			</div>
		{/if}
	</div>
{/if}
