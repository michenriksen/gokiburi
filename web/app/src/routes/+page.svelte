<script lang="ts">
	import { onDestroy, setContext } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { mdiAlertCircle } from '@mdi/js';

	import { Paginator, CodeBlock } from '../skeleton';
	import { filterPackages } from '$lib/filtering';
	import { defaultFilterSettings } from '$lib/filtering';

	import ResultFilter from '$lib/components/ResultFilter.svelte';
	import ResultPackageTable from '$lib/components/ResultPackageTable.svelte';
	import ResultStats from '$lib/components/ResultStats.svelte';
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import { currentResult } from '$lib/stores/results';
	import { packagesPerPage } from '$lib/stores/settings';
	import { state } from '$lib/stores/status';

	import type { FilterSettings, Package, Result, State, Test } from '$lib/common/types';
	import ResultEmptyState from '$lib/components/ResultEmptyState.svelte';
	import { formatDuration } from '$lib/common/utils';

	let subscriptions: Unsubscriber[] = [];
	let resultVal: Result | null;
	let allPackages: Package[];
	let filteredPackages: Package[];
	let paginatedPackages: Package[];
	let packagesPerPageVal = 50;
	let stateVal: State;

	let pageSettings = {
		offset: 0,
		limit: packagesPerPageVal,
		size: 0,
		amounts: [15, 25, 50, 75, 100]
	};

	let filterSettings = defaultFilterSettings;

	let collapseTestGroups = false;

	let filterSettingsStore = writable<FilterSettings>(filterSettings);
	setContext('filterSettings', filterSettingsStore);

	$: {
		filteredPackages = filterPackages(allPackages, filterSettings);
		paginatedPackages = filteredPackages.slice(
			pageSettings.offset * pageSettings.limit,
			pageSettings.offset * pageSettings.limit + pageSettings.limit
		);
		pageSettings.size = filteredPackages.length;
		filterSettingsStore.set(filterSettings);
	}

	subscriptions.push(
		currentResult.subscribe((result) => {
			if (result) {
				resultVal = result;

				if (result.packages) {
					allPackages = result.packages
						.map((pkg: Package): Package => {
							pkg.tests.sort(sortTests);
							return pkg;
						})
						.sort(sortPackages);
				}
			}
		})
	);

	subscriptions.push(
		packagesPerPage.subscribe((newSetting) => {
			pageSettings.limit = packagesPerPageVal = parseInt(newSetting);
		})
	);

	subscriptions.push(
		state.subscribe((newState) => {
			stateVal = newState;
		})
	);

	onDestroy(() => {
		subscriptions.forEach((unsubscribe) => unsubscribe());
	});

	// Sorts packages by number of failed tests and then alphabetically by name.
	function sortPackages(a: Package, b: Package): number {
		if (a.failed !== b.failed) {
			return b.failed - a.failed;
		}

		return a.name.localeCompare(b.name);
	}

	function sortTests(a: Test, b: Test): number {
		if (a.pass !== b.pass) {
			return a.pass ? 1 : -1;
		}

		return a.name.localeCompare(b.name);
	}
</script>

<div class="py-4 px-10">
	{#if resultVal}
		{#if resultVal.error !== ''}
			<div class="card variant-filled-error mt-6">
				<header class="card-header pb-4 flex flex-row space-x-4 justify-between">
					<div class="flex-none"><SvgIcon path={mdiAlertCircle} class="inline-block" size="1.5em" /></div>
					<div class="text-lg grow">Error: {resultVal.error}</div>
				</header>
				<section><CodeBlock language="output" rounded="none" code={window.atob(resultVal.output)} /></section>
				<footer class="card-footer flex flex-row p-4 items-center justify-end space-x-4 text-sm">
					<div>exit code: {resultVal.exitCode}</div>
					<div>{formatDuration(resultVal.duration)}</div>
				</footer>
			</div>
		{:else}
			{#key resultVal.uuid}
				<ResultStats bind:result={resultVal} />
			{/key}

			{#if paginatedPackages}
				<ResultFilter bind:settings={filterSettings} bind:collapse={collapseTestGroups} />

				{#each paginatedPackages as pkg (pkg.name)}
					<ResultPackageTable {pkg} bind:uuid={resultVal.uuid} filter={filterSettings} collapsed={collapseTestGroups} />
				{/each}

				<Paginator
					amountText="Packages per page"
					on:amount={(val) => packagesPerPage.set(val.detail.toString())}
					bind:settings={pageSettings}
				/>
			{/if}
		{/if}
	{:else}
		<ResultEmptyState />
	{/if}
</div>
