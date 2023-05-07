<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	import { mdiArrowCollapseVertical, mdiArrowExpandVertical, mdiFilterVariant, mdiMagnify } from '@mdi/js';
	import { transitionsOffForDuration } from '$lib/conditionalTransitions';
	import { defaultFilterSettings } from '$lib/filtering';

	import Combobox from '$lib/components/Combobox.svelte';
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import {
		filterCoverageLevel,
		filterPackageStatus,
		filterTestStatus,
		testGroupsCollapsed
	} from '$lib/stores/settings';

	import { debounce } from '$lib/common/utils';
	import type { FilterCoverageLevel, FilterPackageStatus, FilterSettings, FilterTestStatus } from '$lib/common/types';

	const searchinputDebounce = 300;

	export let settings: FilterSettings;
	export let collapse = false;

	let subscriptions: Unsubscriber[] = [];

	$: filterPackageStatus.set(JSON.stringify(settings.packageStatus));
	$: filterTestStatus.set(JSON.stringify(settings.testStatus));
	$: filterCoverageLevel.set(JSON.stringify(settings.coverage));
	$: testGroupsCollapsed.set(collapse ? 'true' : 'false');

	$: collapseIcon = collapse ? mdiArrowExpandVertical : mdiArrowCollapseVertical;

	subscriptions.push(
		filterPackageStatus.subscribe((newSetting) => {
			try {
				const parsed = JSON.parse(newSetting) as FilterPackageStatus[];
				if (parsed !== settings.packageStatus) {
					settings.packageStatus = parsed;
				}
			} catch (err) {
				settings.packageStatus = defaultFilterSettings.packageStatus;
				console.error('failed to parse package status filter settings', err);
			}
		})
	);

	subscriptions.push(
		filterTestStatus.subscribe((newSetting) => {
			try {
				const parsed = JSON.parse(newSetting) as FilterTestStatus[];
				if (parsed !== settings.testStatus) {
					settings.testStatus = parsed;
				}
			} catch (err) {
				settings.testStatus = defaultFilterSettings.testStatus;
				console.error('failed to parse test status filter settings', err);
			}
		})
	);

	subscriptions.push(
		filterCoverageLevel.subscribe((newSetting) => {
			try {
				const parsed = JSON.parse(newSetting) as FilterCoverageLevel[];
				if (parsed !== settings.coverage) {
					settings.coverage = parsed;
				}
			} catch (err) {
				settings.coverage = defaultFilterSettings.coverage;
				console.error('failed to parse coverage level filter settings', err);
			}
		})
	);

	subscriptions.push(
		testGroupsCollapsed.subscribe((newSetting) => {
			const enabled = newSetting === 'true';
			if (collapse !== enabled) {
				collapse = enabled;
			}
		})
	);

	const packageStatusOptions = [
		{ value: 'passing', label: 'Passing' },
		{ value: 'failing', label: 'Failing' },
		{ value: 'noTests', label: 'No Tests' }
	];

	const testStatusOptions = [
		{ value: 'passing', label: 'Passing' },
		{ value: 'failing', label: 'Failing' },
		{ value: 'skipped', label: 'Skipped' }
	];

	const coverageOptions = [
		{ value: 'high', label: 'High' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'low', label: 'Low' },
		{ value: 'none', label: 'No Coverage' }
	];

	const debouncedSearchInput = debounce((value: string) => {
		if (value.length === 0 || value.length >= 3) {
			settings.search = value;
		}
	}, searchinputDebounce);

	function handleSearchInput(event: Event) {
		debouncedSearchInput((event.target as HTMLInputElement).value);
	}

	function toggleCollapse() {
		if (collapse) {
			// If results are currently collapsed, turn transitions off for a second
			// to prevent browser lagging when all test results on the current page
			// expand.
			transitionsOffForDuration(1000);
		}

		testGroupsCollapsed.set(`${!collapse}`);
	}

	onDestroy(() => {
		subscriptions.forEach((unsubscribe) => unsubscribe());
	});
</script>

<div class="card p-4 mb-6 flex-col space-y-6 overflow-x-clip">
	<div class="flex flex-col space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0 items-center">
		<div class="w-full lg:w-1/2">
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim"><SvgIcon path={mdiMagnify} size="1.4em" class="inline" /></div>
				<input
					type="search"
					minlength="3"
					class="invalid:variant-soft-error"
					on:input={handleSearchInput}
					placeholder="Search test names..."
				/>
			</div>
		</div>

		<div
			class="w-full lg:w-1/2 flex flex-row space-x-4 justify-items-stretch justify-end lg:justify-items-end items-center"
		>
			<Combobox
				name="packageStatus"
				label="Package status"
				icon={mdiFilterVariant}
				bind:values={settings.packageStatus}
				options={packageStatusOptions}
				width="w-full lg:w-48"
				showCount={false}
				multiple
				on:change={() => filterPackageStatus.set(JSON.stringify(settings.packageStatus))}
			/>

			<Combobox
				name="testStatus"
				label="Test status"
				icon={mdiFilterVariant}
				bind:values={settings.testStatus}
				options={testStatusOptions}
				width="w-full lg:w-48"
				showCount={false}
				multiple
				on:change={() => filterTestStatus.set(JSON.stringify(settings.testStatus))}
			/>

			<Combobox
				name="coverage"
				width="w-full lg:w-48"
				label="Coverage level"
				icon={mdiFilterVariant}
				bind:values={settings.coverage}
				options={coverageOptions}
				showCount={false}
				multiple
				on:change={() => filterCoverageLevel.set(JSON.stringify(settings.coverage))}
			/>

			<button class="btn-icon btn-sm variant-filled-surface" on:click={toggleCollapse}>
				<span><SvgIcon path={collapseIcon} size="1.4em" class="inline" /></span>
			</button>
		</div>
	</div>
</div>
