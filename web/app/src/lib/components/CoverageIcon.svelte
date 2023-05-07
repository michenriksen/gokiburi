<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	import {
		mdiCircleOutline,
		mdiCircleSlice1,
		mdiCircleSlice2,
		mdiCircleSlice3,
		mdiCircleSlice4,
		mdiCircleSlice5,
		mdiCircleSlice6,
		mdiCircleSlice7,
		mdiCircleSlice8
	} from '@mdi/js';

	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import { coverageHighMin, coverageMediumMin, coverageUseColor } from '$lib/stores/settings';

	export let percentage = 0.0;
	export let iconSize = '1.5em';
	export let positive = false;
	export let warning = false;
	export let negative = false;

	let subscriptions: Unsubscriber[] = [];
	let coverageUseColorVal = true;
	let coverageHighMinVal = 80;
	let coverageMediumMinVal = 60;
	let isHigh = false;
	let isMedium = false;
	let isLow = false;

	subscriptions.push(
		coverageUseColor.subscribe((newSetting) => {
			coverageUseColorVal = newSetting === 'true';
		})
	);

	subscriptions.push(
		coverageHighMin.subscribe((newSetting) => {
			coverageHighMinVal = parseFloat(newSetting);
		})
	);

	subscriptions.push(
		coverageMediumMin.subscribe((newSetting) => {
			coverageMediumMinVal = parseFloat(newSetting);
		})
	);

	$: {
		isHigh = coverageUseColorVal && (positive || percentage >= coverageHighMinVal);
		isMedium = coverageUseColorVal && (warning || (!isHigh && percentage >= coverageMediumMinVal));
		isLow = coverageUseColorVal && (negative || percentage < coverageMediumMinVal);
	}

	onDestroy(() => {
		subscriptions.forEach((unsubscribe) => unsubscribe());
	});
</script>

<span
	class:text-inherit={!coverageUseColorVal}
	class:text-success-500={isHigh}
	class:text-warning-500={isMedium}
	class:text-error-400={isLow}
>
	{#if percentage >= 100}
		<SvgIcon path={mdiCircleSlice8} size={iconSize} class="inline-block" />
	{:else if percentage >= 87.5}
		<SvgIcon path={mdiCircleSlice7} size={iconSize} class="inline-block" />
	{:else if percentage >= 75}
		<SvgIcon path={mdiCircleSlice6} size={iconSize} class="inline-block" />
	{:else if percentage >= 62.5}
		<SvgIcon path={mdiCircleSlice5} size={iconSize} class="inline-block" />
	{:else if percentage >= 50}
		<SvgIcon path={mdiCircleSlice4} size={iconSize} class="inline-block" />
	{:else if percentage >= 37.5}
		<SvgIcon path={mdiCircleSlice3} size={iconSize} class="inline-block" />
	{:else if percentage >= 25}
		<SvgIcon path={mdiCircleSlice2} size={iconSize} class="inline-block" />
	{:else if percentage >= 12.5}
		<SvgIcon path={mdiCircleSlice1} size={iconSize} class="inline-block" />
	{:else}
		<SvgIcon path={mdiCircleOutline} size={iconSize} class="inline-block" />
	{/if}
</span>
