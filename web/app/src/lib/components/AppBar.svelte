<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { scale } from 'svelte/transition';

	import { AppBar, SlideToggle } from '../../skeleton';
	import {
		mdiAutorenew,
		mdiBellOffOutline,
		mdiBellRingOutline,
		mdiCog,
		mdiDotsHorizontal,
		mdiLightningBoltCircle,
		mdiMotionPauseOutline,
		mdiMotionPlayOutline
	} from '@mdi/js';

	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import { dispatchOpenSettings, dispatchRunTests } from '$lib/stores/events';
	import { metadata } from '$lib/stores/metadata';
	import { audioContextUnlocked } from '$lib/stores/settings';
	import { root, state } from '$lib/stores/status';

	import AudioService from '$lib/services/audio';

	import type { State } from '$lib/common/types';

	const dispatch = createEventDispatcher();

	let subscriptions: Unsubscriber[] = [];
	let stateVal: State = 'init';
	let rootVal: string | null = null;
	let audioContextUnlockedVal = false;

	subscriptions.push(
		state.subscribe((newState) => {
			stateVal = newState;
		})
	);

	subscriptions.push(
		root.subscribe((newRoot) => {
			rootVal = newRoot;
		})
	);

	subscriptions.push(
		audioContextUnlocked.subscribe((newSetting) => {
			audioContextUnlockedVal = newSetting;
		})
	);

	onDestroy(() => {
		subscriptions.forEach((unsubscribe) => unsubscribe());
	});

	const toggleAudio = () => {
		if (!audioContextUnlockedVal) {
			AudioService.activate();
		} else {
			AudioService.deactivate();
		}
	};
</script>

<AppBar class="shadow-xl" gap="gap-10">
	<svelte:fragment slot="lead">
		<div class="flex flex-row space-x-4 items-center">
			<strong class="text-xl uppercase">{$metadata.appName}</strong>
			{#key rootVal}
				{#if rootVal}
					<div
						class="font-mono tooltip tooltip-right cursor-default"
						data-tip="Current directory being watched"
						in:scale
					>
						{rootVal}
					</div>
				{:else}
					<div class="opacity-40">initializing...</div>
				{/if}
			{/key}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<div
			class="flex flex-row space-x-2 sm:mr-4 tooltip tooltip-notifications"
			data-tip={audioContextUnlockedVal ? 'Turn off sound notifications' : 'Turn on sound notifications'}
		>
			{#if audioContextUnlockedVal}
				<SvgIcon path={mdiBellRingOutline} class="text-success-500" size="1.5em" />
			{:else}
				<SvgIcon path={mdiBellOffOutline} class="text-warning-500" size="1.5em" />
			{/if}

			<SlideToggle
				name="notifications-slider"
				size="sm"
				checked={audioContextUnlockedVal}
				on:change={toggleAudio}
				active="bg-success-500"
			/>
		</div>

		<div class="flex flex-row space-x-2">
			{#if stateVal === 'paused'}
				<span class="badge-icon bg-warning-700 shadow-inner">&nbsp;</span>
				<span class="uppercase text-sm font-bold hidden sm:inline">Paused</span>
			{:else if stateVal === 'offline' || stateVal === 'closing'}
				<span class="badge-icon bg-red-800 shadow-inner">&nbsp;</span>
				<span class="uppercase text-sm font-bold text-error hidden sm:inline">Offline</span>
			{:else if stateVal === 'init'}
				<span class="badge-icon bg-success-700 shadow-inner">&nbsp;</span>
				<span class="uppercase text-sm font-bold hidden sm:inline">Init</span>
			{:else}
				<span class="badge-icon bg-success-700 animate-pulse shadow-inner">&nbsp;</span>
				<span class="uppercase text-sm font-bold hidden sm:inline">Live</span>
			{/if}
		</div>

		<div class="flex flow-row space-x-2">
			{#if stateVal === 'paused'}
				<button
					class="btn btn-sm btn-icon variant-ghost-surface hover:variant-ghost-succes tooltip"
					on:click={() => dispatch('resume')}
					data-tip="Resume automatic test runs"
				>
					<span><SvgIcon path={mdiMotionPlayOutline} size="1.5em" /></span>
				</button>
			{:else if stateVal === 'offline' || stateVal === 'closing'}
				<button class="btn btn-sm btn-icon variant-ghost-error tooltip" disabled>
					<span><SvgIcon path={mdiLightningBoltCircle} size="1.5em" /></span>
				</button>
			{:else if stateVal === 'init'}
				<button class="btn btn-sm btn-icon variant-ghost-surface" disabled>
					<span><SvgIcon path={mdiDotsHorizontal} size="1.5em" /></span>
				</button>
			{:else}
				<button
					class="btn btn-sm btn-icon variant-ghost-surface hover:variant-ghost-warning tooltip"
					on:click={() => dispatch('pause')}
					data-tip="Pause automatic test runs"
				>
					<span><SvgIcon path={mdiMotionPauseOutline} size="1.5em" /></span>
				</button>
			{/if}
		</div>

		<!-- Tooltip is put on container div because putting the tooltip directly
         on the button causes it to spin around when button is animated. -->
		<div class="tooltip tooltip-runall" data-tip={stateVal === 'running' ? 'Running...' : 'Run all tests'}>
			<button
				class="btn btn-sm btn-icon"
				class:variant-ghost-surface={stateVal !== 'offline'}
				class:hover:variant-ghost-success={stateVal !== 'offline'}
				class:variant-ghost-error={stateVal === 'offline' || stateVal === 'closing'}
				class:animate-spin={stateVal === 'running'}
				disabled={stateVal !== 'ready'}
				on:click={() => dispatchRunTests('./...')}
			>
				<span><SvgIcon path={mdiAutorenew} size="1.5em" /></span>
			</button>
		</div>

		<div>
			<button
				class="btn btn-sm btn-icon variant-ghost-surface tooltip"
				data-tip="Settings"
				disabled={stateVal === 'init'}
				on:click={() => dispatchOpenSettings()}
			>
				<span><SvgIcon path={mdiCog} size="1.5em" /></span>
			</button>
		</div>
	</svelte:fragment>
</AppBar>
