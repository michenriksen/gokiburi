<script lang="ts">
	import { onMount } from 'svelte';
	import { scale, slide } from 'svelte/transition';

	import { ProgressRadial } from '../../skeleton';
	import { mdiChevronRight, mdiFileCodeOutline, mdiPackageVariantClosed, mdiRobotDeadOutline } from '@mdi/js';
	import { renderProfile } from '$lib/coverage';

	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CoverageIcon from '$lib/components/CoverageIcon.svelte';
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import { metadata } from '$lib/stores/metadata';

	import ApiService, { apiErrorHandler } from '$lib/services/api';

	import { formatBytes, truncateFilepath } from '$lib/common/utils';
	import type { ErrorType, Profile, Report } from '$lib/common/types';

	export let uuid: string;
	export let pkg: string;

	let error: ErrorType;
	let errorMsg: string;
	let showErrorDetails = false;
	let loading = true;

	let report: Report | undefined;
	let pkgs: string[];
	let selectedPkg: string;

	let profiles: Profile[];
	let profile: Profile | undefined;
	let selectedProfile: string;

	$: profile = profiles?.find((p: Profile): boolean => p.filename === selectedProfile);

	const loadSelectedPkg = () => {
		if (report) {
			profiles = report.profiles.filter((p: Profile): boolean => p.package === selectedPkg);
			selectedProfile = profiles[0].filename;
		}
	};

	const loadProfile = async () => {
		loading = true;

		[error, report] = await apiErrorHandler(() => ApiService.report(uuid));

		if (report) {
			pkgs = [...new Set(report.profiles.map((p: Profile): string => p.package))];
			selectedPkg = pkg;
			loadSelectedPkg();
		} else {
			if (error instanceof Error) {
				errorMsg = `${error.message} (${error.name})`;
			} else {
				errorMsg = String(error);
			}
		}

		loading = false;
	};

	const toggleErrorDetails = () => {
		showErrorDetails = !showErrorDetails;
	};

	onMount(() => {
		loadProfile();
	});
</script>

<div class="md:container p-0 h-full">
	{#if loading}
		<div class="flex flex-col items-center justify-center space-y-7 mt-40" in:scale>
			<ProgressRadial stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" />
			<h4 class="font-bold text-surface-300 drop-shadow-lg">Loading coverage profile...</h4>
		</div>
	{:else if error}
		<div class="flex flex-col items-center justify-center space-y-7 mt-40" in:scale>
			<SvgIcon path={mdiRobotDeadOutline} size="150px" class="text-red-500 drop-shadow-lg" />
			<h4 class="font-bold text-red-500 drop-shadow-lg">Failed to load coverage report</h4>
			<div class="text-surface-300">
				Please check if {$metadata.appName} is still running and
				<a href="/" class="!text-inherit" on:click|preventDefault={loadProfile}>try again</a>.
			</div>
			<div>
				<button
					type="button"
					class="btn btn-sm variant-ghost-surface block mb-2 mx-auto mt-[100px] opacity-40 hover:opacity-100"
					on:click={toggleErrorDetails}>error details</button
				>
				{#if showErrorDetails}
					<div class="card font-mono font-sm !bg-surface-900 p-4 select-all" transition:slide>
						<ul class="list-none">
							<li>Error: {errorMsg}</li>
							<li>Result UUID: {uuid}</li>
							<li>Package: {pkg}</li>
						</ul>
					</div>
				{/if}
			</div>
		</div>
	{:else if profiles}
		<div class="px-4 pt-6 variant-glass-surface sticky top-0 drop-shadow-lg z-20">
			<div class="flex flex-row space-x-2 items-center">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] tooltip" data-tip="Select package">
					<div class="input-group-shim font-bold relative">
						<span class="badge-icon variant-filled-secondary absolute top-[4px] left-[5px] z-10">{pkgs.length}</span>
						<SvgIcon path={mdiPackageVariantClosed} class="inline-block mx-1" size="1.2em" /> package
					</div>
					<select
						bind:value={selectedPkg}
						on:change={loadSelectedPkg}
						class="select font-mono text-sm pl-4 rounded-s-none"
					>
						{#each pkgs as pkg}
							<option value={pkg}>{pkg}</option>
						{/each}
					</select>
				</div>
				<div class="text-surface-300" aria-hidden><SvgIcon path={mdiChevronRight} size="2.0em" /></div>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] tooltip" data-tip="Select source file">
					<div class="input-group-shim font-bold">
						<span class="badge-icon variant-filled-secondary absolute top-[4px] left-[5px] z-10">{profiles.length}</span
						>
						<SvgIcon path={mdiFileCodeOutline} class="inline-block mx-1" size="1.2em" /> file
					</div>
					<select bind:value={selectedProfile} class="select font-mono text-sm pl-4 rounded-s-none">
						{#each profiles as profile}
							<option value={profile.filename}>{truncateFilepath(profile.filename, 50)} ({profile.coverage}%)</option>
						{/each}
					</select>
				</div>
			</div>
			{#if profile}
				<div class="flex flex-row pb-2 px-2 mt-4 space-x-6 items-center text-sm">
					<div class="font-mono font-bold flex-auto">{profile.filename}</div>
					<div>{profile.lineCount}L</div>
					<div>{formatBytes(profile.size)}</div>
					<div>
						<CoverageIcon percentage={profile.coverage} />
						{profile.coverage}% ({report?.mode})
					</div>
				</div>
			{/if}
		</div>

		<div class="h-full bg-zinc-950">
			{#if profile}
				<div><CodeBlock code={renderProfile(profile)} /></div>
			{/if}
		</div>
	{/if}
</div>
