<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { scale } from 'svelte/transition';

	import { ListBox } from '../../skeleton';
	import ResultButton from './ResultButton.svelte';
	import { mdiChevronDoubleLeft, mdiChevronDoubleRight, mdiLightbulbOutline, mdiTrashCanOutline } from '@mdi/js';

	import ResultListBoxItem from '$lib/components/ResultListBoxItem.svelte';
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import { dispatchRunTests } from '$lib/stores/events';
	import { currentResult, results } from '$lib/stores/results';
	import { sidebarCollapsed } from '$lib/stores/settings';
	import { state } from '$lib/stores/status';

	import type { Result, State } from '$lib/common/types';

	export let disableClearResults: boolean;

	const dispatch = createEventDispatcher();

	let subscriptions: Unsubscriber[] = [];
	let stateVal: State;
	let resultsVal: Result[] | null;
	let currentResultUuid: string;
	let selectedResultUuid: string;
	let currentResultVal: Result | null;
	let sidebarCollapsedVal = false;

	$: if (selectedResultUuid !== currentResultUuid) {
		const newCurrentResult = resultsVal?.find((r) => r.uuid === selectedResultUuid);

		if (newCurrentResult) {
			currentResult.set(newCurrentResult);
		}
	}

	const toggleSidebar = () => {
		if (sidebarCollapsedVal) {
			sidebarCollapsed.set('false');
		} else {
			sidebarCollapsed.set('true');
		}
	};

	subscriptions.push(
		state.subscribe((newState) => {
			stateVal = newState;
		})
	);

	subscriptions.push(
		results.subscribe((newResults) => {
			resultsVal = newResults;

			if (resultsVal && resultsVal.length > 0) {
				resultsVal.sort((a: Result, b: Result): number => {
					if (a.start > b.start) {
						return -1;
					} else if (a.start < b.start) {
						return 1;
					} else {
						return 0;
					}
				});

				selectedResultUuid = resultsVal[0].uuid;
			}

			dispatch('showingResult', { uuid: selectedResultUuid });
		})
	);

	subscriptions.push(
		sidebarCollapsed.subscribe((newSetting: string) => {
			sidebarCollapsedVal = newSetting === 'true';
		})
	);

	subscriptions.push(
		currentResult.subscribe((newResult) => {
			if (newResult) {
				currentResultVal = newResult;
				selectedResultUuid = newResult.uuid;
			}
		})
	);

	onDestroy(() => {
		subscriptions.forEach((unsubscribe) => unsubscribe());
	});
</script>

<div class="p-4 hidden lg:grid" class:w-fit={sidebarCollapsedVal} class:w-[360px]={!sidebarCollapsedVal}>
	{#if sidebarCollapsedVal}
		<div class="flex flex-col space-y-4 opacity-50 hover:opacity-100 transition-opacity">
			<button on:click={toggleSidebar} type="button" class="btn btn-sm btn-icon variant-ghost-surface">
				<span><SvgIcon path={mdiChevronDoubleRight} /></span>
			</button>

			{#if resultsVal && resultsVal.length > 0}
				<button
					on:click={() => dispatch('clearResults')}
					type="button"
					class="btn btn-sm btn-icon variant-ghost-surface"
					class:hover:variant-ghost-warning={!disableClearResults}
					class:variant-ghost-error={stateVal === 'offline'}
					disabled={disableClearResults || stateVal === 'offline'}
				>
					<span><SvgIcon path={mdiTrashCanOutline} /></span>
				</button>

				{#each resultsVal as result (result.uuid)}
					<div in:scale>
						<ResultButton
							{result}
							active={selectedResultUuid === result.uuid}
							on:click={(e) => (selectedResultUuid = e.detail)}
						/>
					</div>
				{/each}
			{/if}
		</div>
	{:else}
		<div class="flex flex-row items-center space-x-4 mb-12">
			<div class="font-bold uppercase grow">Results</div>
			{#if resultsVal && resultsVal.length > 0}
				<div>
					<button
						on:click={() => dispatch('clearResults')}
						type="button"
						class="btn btn-sm btn-icon tooltip"
						class:variant-ghost-surface={!disableClearResults}
						class:hover:variant-ghost-warning={!disableClearResults}
						class:variant-ghost-error={stateVal === 'offline'}
						disabled={disableClearResults || stateVal === 'offline'}
						data-tip="Clear all results"
					>
						<span><SvgIcon path={mdiTrashCanOutline} /></span>
					</button>
				</div>
			{/if}
			<div>
				<button
					on:click={toggleSidebar}
					type="button"
					class="btn btn-sm btn-icon variant-ghost-surface tooltip tooltip-collapse-sidebar"
					data-tip="Collapse side bar"
				>
					<span><SvgIcon path={mdiChevronDoubleLeft} /></span>
				</button>
			</div>
		</div>

		{#if resultsVal && resultsVal.length > 0}
			<ListBox>
				{#each resultsVal as result (result.uuid)}
					<ResultListBoxItem bind:group={selectedResultUuid} {result} />
				{/each}
			</ListBox>
		{:else}
			<div class="flex flex-col space-y-2 mb-12" class:animate-puls={stateVal === 'running'}>
				<div class="placeholder h-[35px]" />
				<div class="placeholder h-[35px]" />
				<div class="placeholder h-[35px]" />
			</div>

			<div class="flex flex-col space-y-6 items-center italic text-surface-400">
				<div>
					Test results will automatically appear in this sidebar. To view results, modify a Go source file within your
					project or <a
						href="/"
						class="!text-surface-300"
						on:click|once|preventDefault={() => dispatchRunTests('./...')}>run all tests</a
					>.
				</div>

				<div class="text-sm">
					<span class="text-surface-300">
						<SvgIcon path={mdiLightbulbOutline} size="1.2em" class="inline" />
						Tip:
					</span>
					need more screen space? Collapse this sidebar by pressing the
					<span class="text-surface-300 font-bold">&laquo;</span> button at the top.
				</div>
			</div>
		{/if}
	{/if}
</div>
