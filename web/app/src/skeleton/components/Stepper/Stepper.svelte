<script>
	import { createEventDispatcher, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	const dispatchParent = createEventDispatcher();
	export let gap = 'gap-4';
	export let stepTerm = 'Step';
	export let badge = 'variant-filled-surface';
	export let active = 'variant-filled';
	export let border = 'border-surface-400-500-token';
	export let start = 0;
	export let justify = 'justify-between';
	export let buttonBack = 'variant-ghost';
	export let buttonBackType = 'button';
	export let buttonBackLabel = '&larr; Back';
	export let buttonNext = 'variant-filled';
	export let buttonNextType = 'button';
	export let buttonNextLabel = 'Next &rarr;';
	export let buttonComplete = 'variant-filled-primary';
	export let buttonCompleteType = 'button';
	export let buttonCompleteLabel = 'Complete';
	export let regionHeader = '';
	export let regionContent = '';
	let state = writable({ current: start, total: 0 });
	setContext('state', state);
	setContext('dispatchParent', dispatchParent);
	setContext('stepTerm', stepTerm);
	setContext('gap', gap);
	setContext('justify', justify);
	setContext('buttonBack', buttonBack);
	setContext('buttonBackType', buttonBackType);
	setContext('buttonBackLabel', buttonBackLabel);
	setContext('buttonNext', buttonNext);
	setContext('buttonNextType', buttonNextType);
	setContext('buttonNextLabel', buttonNextLabel);
	setContext('buttonComplete', buttonComplete);
	setContext('buttonCompleteType', buttonCompleteType);
	setContext('buttonCompleteLabel', buttonCompleteLabel);
	const cBase = 'space-y-4';
	const cHeader = 'flex items-center border-t mt-[15px]';
	const cHeaderStep = '-mt-[15px] transition-all duration-300';
	const cContent = '';
	$: isActive = (step) => step === $state.current;
	$: classesBase = `${cBase} ${$$props.class ?? ''}`;
	$: classesHeader = `${cHeader} ${border} ${gap} ${regionHeader}`;
	$: classesHeaderStep = `${cHeaderStep}`;
	$: classesBadge = (step) => (isActive(step) ? active : badge);
	$: classesContent = `${cContent} ${regionContent}`;
</script>

<div class="stepper {classesBase}" data-testid="stepper">
	<!-- Header -->
	{#if $state.total}
		<header class="stepper-header {classesHeader}" transition:fade|local={{ duration: 100 }}>
			{#each Array.from(Array($state.total).keys()) as step}
				<div class="stepper-header-step {classesHeaderStep}" class:flex-1={isActive(step)}>
					<span class="badge {classesBadge(step)}">{isActive(step) ? `${stepTerm} ${step + 1}` : step + 1}</span>
				</div>
			{/each}
		</header>
	{/if}
	<!-- Content -->
	<div class="stepper-content {classesContent}">
		<slot />
	</div>
</div>
