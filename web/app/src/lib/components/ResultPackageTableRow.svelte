<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	import { CodeBlock } from '../../skeleton';
	import { mdiCheckCircleOutline, mdiClockStart, mdiCloseCircleOutline, mdiConsole, mdiDebugStepOver } from '@mdi/js';
	import { conditionalScale } from '$lib/conditionalTransitions';
	import { format, formatDistanceToNow, isToday } from 'date-fns';

	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import { escapeHtml, escapeRegExp } from '$lib/common/utils';
	import type { FilterSettings, Test } from '$lib/common/types';

	export let test: Test;

	let safeTestName = escapeHtml(test.name);
	let safeHighlightedTestName = safeTestName;
	let searchHit = false;
	let showDetails = false;

	let filterSettings = getContext('filterSettings') as Writable<FilterSettings>;

	const unsubscribe = filterSettings.subscribe((newSettings) => {
		if (newSettings.search.length > 0) {
			highlightSearchQuery(newSettings.search);
		} else if (newSettings.search.length === 0 && searchHit) {
			safeHighlightedTestName = safeTestName;
			searchHit = false;
		}
	});

	function highlightSearchQuery(query: string) {
		try {
			const safeQuery = escapeHtml(query);
			const regex = new RegExp(`(${escapeRegExp(safeQuery)})`, 'gi');
			safeHighlightedTestName = safeTestName.replace(regex, '<mark>$1</mark>');
			searchHit = safeHighlightedTestName.length > safeTestName.length;
		} catch (e) {
			safeHighlightedTestName = safeTestName;
			searchHit = false;
		}
	}

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div in:conditionalScale>
	<div
		class="flex flex-row items-center space-x-4 px-4 py-2 justify-between cursor-pointer hover:bg-primary-800/20"
		class:!variant-soft-primary={showDetails}
		on:click={() => (showDetails = !showDetails)}
		on:keyup
	>
		<div class="flex-none">
			{#if test.skip}
				<SvgIcon path={mdiDebugStepOver} class="text-warning-500 inline-block" size="1.7em" title="Skipped" />
			{:else if test.pass}
				<SvgIcon path={mdiCheckCircleOutline} class="text-success-500 inline-block" size="1.7em" title="Passed" />
			{:else}
				<SvgIcon path={mdiCloseCircleOutline} class="text-error-400 inline-block" size="1.7em" title="Failed" />
			{/if}
		</div>

		<div class="grow font-mono max-w-md md:max-w-none overflow-x-hidden text-ellipsis">
			{@html safeHighlightedTestName}
		</div>

		<div>
			{#key test.elapsed}
				<span class="opacity-50 text-sm">
					{test.elapsed}s
				</span>
			{/key}
		</div>
	</div>
	{#if showDetails}
		{@const time = new Date(test.time)}
		<div class="flex flex-row space-x-4 items-top !variant-soft-primary px-4 py-2" transition:slide={{ duration: 250 }}>
			<div class="flex-none">
				<SvgIcon path={mdiConsole} size="1.7em" title="Test output" class="opacity-70" />
			</div>
			<div class="grow">
				<CodeBlock language="output" code={test.output} />
			</div>
		</div>
		<div
			class="flex flex-row space-x-4 items-center !variant-soft-primary px-4 py-2"
			transition:slide={{ duration: 250 }}
		>
			<div class="flex-none">
				<SvgIcon path={mdiClockStart} size="1.7em" title="Time of test" class="opacity-70" />
			</div>
			<div class="grow text-sm">
				at {format(time, 'HH:mm:ss')}
				{#if !isToday(time)}
					on {format(time, 'PP')}
				{/if}
				<span class="opacity-70">({formatDistanceToNow(time)} ago)</span>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	div :global(mark) {
		@apply bg-yellow-400 text-yellow-900 rounded;
		padding: 1px;
	}
</style>
