<script lang="ts">
	import { onDestroy } from 'svelte';
	import { mdiLightbulbOutline } from '@mdi/js';

	import { dispatchRunTests, dispatchOpenSettings } from '$lib/stores/events';
	import { state } from '$lib/stores/status';
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	let animatePlaceholders = false;

	const unsubscribe = state.subscribe((newState) => {
		if (newState === 'running') {
			animatePlaceholders = true;
		}
	});

	onDestroy(() => unsubscribe());
</script>

<div class="logo-cloud grid-cols-1 lg:!grid-cols-5 gap-1 mb-6" class:animate-pulse={animatePlaceholders}>
	<div class="logo-item">
		<span><div class="placeholder-circle w-10" /></span>
		<span><div class="placeholder w-20" /></span>
	</div>
	<div class="logo-item">
		<span><div class="placeholder-circle w-10" /></span>
		<span><div class="placeholder w-20" /></span>
	</div>
	<div class="logo-item">
		<span><div class="placeholder-circle w-10" /></span>
		<span><div class="placeholder w-20" /></span>
	</div>
	<div class="logo-item">
		<span><div class="placeholder-circle w-10" /></span>
		<span><div class="placeholder w-20" /></span>
	</div>
	<div class="logo-item">
		<span><div class="placeholder-circle w-10" /></span>
		<span><div class="placeholder w-20" /></span>
	</div>
</div>

<div class="card p-4 mb-6 flex-col space-y-6 overflow-x-clip" class:animate-pulse={animatePlaceholders}>
	<div class="flex flex-col space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0 items-center">
		<div class="w-full lg:w-1/2 placeholder h-10" />
		<div
			class="w-full lg:w-1/2 flex flex-row space-x-4 justify-items-stretch justify-end lg:justify-items-end items-center"
		>
			<div class="placeholder w-48 h-10" />
			<div class="placeholder w-48 h-10" />
			<div class="placeholder w-48 h-10" />
			<div class="placeholder-circle w-10" />
		</div>
	</div>
</div>

<div class="mb-10" class:animate-pulse={animatePlaceholders}>
	<div class="card card-variant-surface p-4 flex flex-row items-center space-x-4 justify-between rounded-b-none">
		<div class="flex-none">
			<div class="placeholder-circle w-7" />
		</div>

		<div class="grow">
			<div class="placeholder w-[60%]" />
		</div>

		<div class="flex flex-row space-x-1 items-center hidden md:inline-block">
			<div class="placeholder w-8 inline-block" />
			<div class="placeholder w-8 inline-block" />
			<div class="placeholder w-9 inline-block" />
		</div>
	</div>

	<div>
		<div class="sticky top-0 py-2 shadow-md font-semibold">
			<div class="flex flex-row space-x-4 items-center justify-center">
				<div class="placeholder w-[200px]" />
			</div>
		</div>

		{#each Array(5) as _}
			{@const titleW = Math.floor(Math.random() * 30) + 10}

			<div class="divide-y divide-surface-700">
				<div class="flex flex-row items-center space-x-4 px-4 py-2 justify-between">
					<div class="flex-none">
						<div class="placeholder-circle w-7" />
					</div>

					<div class="grow max-w-md md:max-w-none overflow-x-hidden">
						<div class="placeholder" style="width: {titleW}%" />
					</div>

					<div class="placeholder w-12" />
				</div>
			</div>
		{/each}

		<div class="flex flex-row p-4 items-center justify-end space-x-4 card rounded-t-none text-sm">
			<div class="placeholder w-[50px]" />
			<div class="placeholder w-[50px]" />
			<div class="placeholder w-[50px]" />
			<div class="placeholder w-[50px]" />
		</div>
	</div>
</div>

<div class="flex flex-col space-y-6 italic text-surface-400 items-center">
	<div class="text-center">
		<div class="text-lg font-semibold">No test results are available at the moment</div>
		<p>
			To view results, either modify a Go source file within your project or
			<a href="/" class="!text-surface-300" on:click|preventDefault={() => dispatchRunTests('./...')}>run all tests</a>.
		</p>
	</div>

	<div class="text-sm">
		<span class="text-surface-300">
			<SvgIcon path={mdiLightbulbOutline} size="1.2em" class="inline" />
			Tip:
		</span>
		you can activate automatic run of all tests on page load in
		<a href="/" class="!text-inherit" on:click|preventDefault={() => dispatchOpenSettings()}>the settings</a>.
	</div>
</div>
