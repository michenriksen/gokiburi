<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';

	import SvgIcon from './SvgIcon.svelte';
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
	import { transitionsOffForDuration } from '$lib/conditionalTransitions';

	import ResultPackageTableRow from '$lib/components/ResultPackageTableRow.svelte';

	import { pluralize } from '$lib/common/utils';
	import type { FilterSettings, Test } from '$lib/common/types';

	const previewLimit = 30;

	export let tests: Test[];
	export let header = 'Tests';
	export let headerClass = '';
	export let collapsed = false;

	let preview: Test[] = [];
	let filterSettings = getContext('filterSettings') as Writable<FilterSettings>;
	let collapseIcon = mdiChevronUp;
	let search = '';

	const unsubscribe = filterSettings.subscribe((newSettings) => {
		search = newSettings.search;
	});

	$: if (tests.length > previewLimit) {
		preview = tests.slice(0, previewLimit);
	} else {
		preview = [];
	}

	$: showTests = !collapsed || search.length > 0;
	$: collapseIcon = showTests ? mdiChevronDown : mdiChevronUp;

	function loadAll() {
		transitionsOffForDuration(500);
		preview = [];
	}

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div>
	<div
		class="sticky top-0 py-2 shadow-md font-semibold cursor-pointer {headerClass}"
		on:click={() => (collapsed = !collapsed)}
		on:keydown
	>
		<div class="flex flex-row space-x-4 items-center justify-center">
			<span>{header}</span>
			<span>
				<SvgIcon path={collapseIcon} />
			</span>
		</div>
	</div>

	{#if showTests}
		<div class="divide-y divide-surface-700">
			{#if preview.length > 0}
				{#each preview as test}
					<ResultPackageTableRow {test} />
				{/each}
				<div
					class="relative py-4 font-semibold text-surface-300 cursor-pointer bg-surface-700 hover:bg-secondary-900"
					on:click|once={loadAll}
					on:keyup
				>
					<div class="absolute w-full -top-10 h-10 bg-gradient-to-t from-surface-900 z-20" />
					<div class="flex flex-row space-x-4 items-center justify-center">
						<span>Load {pluralize(tests.length - preview.length, 'more test', 'more tests')}</span>
						<span>
							<SvgIcon path={mdiChevronDown} />
						</span>
					</div>
				</div>
			{:else}
				{#each tests as test (test.package + test.name)}
					<ResultPackageTableRow {test} />
				{/each}
			{/if}
		</div>
	{/if}
</div>
