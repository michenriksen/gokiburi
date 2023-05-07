<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { fade, scale } from 'svelte/transition';

	import { drawerStore } from '../../skeleton';
	import ResultPackageTableGroup from './ResultPackageTableGroup.svelte';
	import { mdiCheckCircleOutline, mdiCloseCircleOutline } from '@mdi/js';
	import { filterTests } from '$lib/filtering';
	import type { DrawerSettings } from '../../skeleton';

	import CoverageIcon from '$lib/components/CoverageIcon.svelte';
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import { coverageShowBadges } from '$lib/stores/settings';

	import { pluralize } from '$lib/common/utils';
	import type { FilterSettings, Package, Test } from '$lib/common/types';

	export let uuid: string;
	export let pkg: Package;
	export let filter: FilterSettings;
	export let collapsed = false;

	let subscriptions: Unsubscriber[] = [];
	let coverageShowBadgesVal = true;
	let hasTests = pkg.tests && pkg.tests.length > 0;
	let filteredTests: Test[] = [];
	let failingTests: Test[] = [];
	let passingTests: Test[] = [];
	let skippedTests: Test[] = [];

	$: {
		filteredTests = filterTests(pkg.tests, filter);

		failingTests = [];
		passingTests = [];
		skippedTests = [];

		for (const test of filteredTests) {
			if (test.skip) {
				skippedTests.push(test);
			} else if (test.pass) {
				passingTests.push(test);
			} else {
				failingTests.push(test);
			}
		}
	}

	subscriptions.push(
		coverageShowBadges.subscribe((newSetting) => {
			coverageShowBadgesVal = newSetting === 'true';
		})
	);

	const openCoverageReport = (pkg: string) => {
		const settings: DrawerSettings = {
			id: 'coverageReport',
			meta: { uuid: uuid, pkg: pkg }
		};

		drawerStore.open(settings);
	};

	onDestroy(() => {
		subscriptions.forEach((unsubscribe) => unsubscribe());
	});
</script>

<div class="mb-10 snap-always snap-start" class:opacity-70={!hasTests} in:fade>
	<div class="card card-variant-surface p-4 flex flex-row items-center space-x-4 justify-between rounded-b-none">
		<div class="flex-none">
			{#if pkg.pass}
				<SvgIcon path={mdiCheckCircleOutline} class="text-success-500 inline-block" size="1.5em" />
			{:else}
				<SvgIcon path={mdiCloseCircleOutline} class="text-error-400 inline-block" size="1.5em" />
			{/if}
		</div>

		<div class="grow font-mono break-all">
			{pkg.name}
			{#if !hasTests}has no tests{/if}
		</div>

		<div class="flex-none">
			{#key pkg.coverage}
				{#if hasTests}
					<div class="flex flex-row space-x-1 mr-4 hidden md:inline-block">
						<span class="badge variant-soft-primary">{pluralize(pkg.tests.length, 'test', 'tests')}</span>
						{#if pkg.failed}<span class="badge variant-soft-error">{pkg.failed} failing</span>{/if}
						{#if pkg.skipped}<span class="badge variant-soft-warning">{pkg.skipped} skipped</span>{/if}
					</div>
					{#if coverageShowBadgesVal}
						<button on:click={() => openCoverageReport(pkg.name)} class="btn btn-sm variant-ghost-surface" in:scale>
							<span>
								<CoverageIcon percentage={pkg.coverage} />
								{pkg.coverage}%
							</span>
						</button>
					{:else}
						<button on:click={() => openCoverageReport(pkg.name)} class="btn btn-sm variant-ghost-surface"
							>view code coverage</button
						>
					{/if}
				{/if}
			{/key}
		</div>
	</div>

	<div class="relative max-h-[670px] overflow-y-auto border-x border-surface-700">
		{#if failingTests.length > 0 && filter.testStatus.includes('failing')}
			<ResultPackageTableGroup
				tests={failingTests}
				header={pluralize(failingTests.length, 'failing test', 'failing tests')}
				headerClass="variant-glass-error"
				{collapsed}
			/>
		{/if}

		{#if passingTests.length > 0 && filter.testStatus.includes('passing')}
			<ResultPackageTableGroup
				tests={passingTests}
				header={pluralize(passingTests.length, 'passing test', 'passing tests')}
				headerClass="variant-glass-success"
				{collapsed}
			/>
		{/if}

		{#if skippedTests.length > 0 && filter.testStatus.includes('skipped')}
			<ResultPackageTableGroup
				tests={skippedTests}
				header={pluralize(skippedTests.length, 'skipped test', 'skipped tests')}
				headerClass="variant-glass-warning"
				{collapsed}
			/>
		{/if}
	</div>

	{#if hasTests}
		<div class="flex flex-row p-4 items-center justify-end space-x-4 card rounded-t-none text-sm">
			{#key pkg.tests.length}
				<div in:scale>{pluralize(pkg.tests.length, 'test', 'tests')}</div>
			{/key}

			{#key pkg.failed}
				<div in:scale>{pkg.failed} failing</div>
			{/key}

			{#key pkg.skipped}
				<div in:scale>{pkg.skipped} skipped</div>
			{/key}

			{#key pkg.elapsed}
				<div in:scale>{pkg.elapsed}s</div>
			{/key}
		</div>
	{/if}
</div>
