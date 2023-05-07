<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	import { SlideToggle } from '../../skeleton';
	import { mdiVolumeHigh, mdiVolumeLow, mdiVolumeMedium, mdiVolumeMute } from '@mdi/js';

	import CoverageIcon from '$lib/components/CoverageIcon.svelte';
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import {
		audioContextUnlocked,
		audioNotifyOn,
		audioVolume,
		coverageHighMin,
		coverageMediumMin,
		coverageShowBadges,
		coverageTheme,
		coverageUseColor,
		notificationsActive,
		notifyOn,
		runAllOnInit
	} from '$lib/stores/settings';

	import audio from '$lib/services/audio';

	import type { AudioNotifyOnSetting, CoverageThemeSetting, NotifyOnSetting } from '$lib/common/types';

	const coverageSteps = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].reverse();

	let subscriptions: Unsubscriber[] = [];
	let runAllOnInitVal: boolean;
	let audioContextUnlockedVal: boolean;
	let audioNotifyOnVal: AudioNotifyOnSetting;
	let audioVolumeVal: number;
	let notificationsActiveVal: boolean;
	let notifyOnVal: NotifyOnSetting;
	let coverageShowBadgesVal: boolean;
	let coverageUseColorVal: boolean;
	let coverageMediumMinVal: number;
	let coverageHighMinVal: number;
	let coverageThemeVal: CoverageThemeSetting;

	subscriptions.push(
		runAllOnInit.subscribe((newSetting) => {
			runAllOnInitVal = newSetting === 'true';
		})
	);

	subscriptions.push(
		audioContextUnlocked.subscribe((newSetting) => {
			audioContextUnlockedVal = newSetting;
		})
	);

	subscriptions.push(
		audioNotifyOn.subscribe((newSetting) => {
			audioNotifyOnVal = newSetting;
		})
	);

	subscriptions.push(
		audioVolume.subscribe((newSetting) => {
			const f = parseFloat(newSetting);

			if (f >= 0 && f <= 1) {
				audioVolumeVal = f;
			} else {
				audioVolumeVal = 1;
			}
		})
	);

	subscriptions.push(
		notificationsActive.subscribe((newSetting) => {
			notificationsActiveVal = newSetting === 'true';
		})
	);

	subscriptions.push(
		notifyOn.subscribe((newSetting) => {
			notifyOnVal = newSetting;
		})
	);

	subscriptions.push(
		coverageShowBadges.subscribe((newSetting) => {
			coverageShowBadgesVal = newSetting === 'true';
		})
	);

	subscriptions.push(
		coverageUseColor.subscribe((newSetting) => {
			coverageUseColorVal = newSetting === 'true';
		})
	);

	subscriptions.push(
		coverageMediumMin.subscribe((newMin) => {
			coverageMediumMinVal = parseInt(newMin);
		})
	);

	subscriptions.push(
		coverageHighMin.subscribe((newMin) => {
			coverageHighMinVal = parseInt(newMin);
		})
	);

	subscriptions.push(
		coverageTheme.subscribe((newSetting) => {
			coverageThemeVal = newSetting;
		})
	);

	onDestroy(() => {
		subscriptions.forEach((unsubscribe) => unsubscribe());
	});

	const toggleAudio = () => {
		if (!audioContextUnlockedVal) {
			audio.activate();
		} else {
			audio.deactivate();
		}
	};
</script>

<div class="p-4 flex flex-col space-y-10">
	<div class="flex flex-col space-y-4">
		<div class="text-xl border-b border-surface-500">Settings</div>

		<SlideToggle
			name="runalloninit-slider"
			size="sm"
			bind:checked={runAllOnInitVal}
			on:change={() => runAllOnInit.set(runAllOnInitVal ? 'true' : 'false')}
			active="bg-success-500"
		>
			<strong>Run all tests on initial load and resume</strong>
		</SlideToggle>
	</div>

	<div class="flex flex-col space-y-4">
		<div class="text-xl border-b border-surface-500">Sound notifications</div>
		{#if !audio.hasAudio()}
			<div class="text-sm text-error-500">Your browser does not support audio playback.</div>
		{:else}
			<SlideToggle
				name="soundnotifications-slider"
				size="sm"
				checked={audioContextUnlockedVal}
				on:change={toggleAudio}
				active="bg-success-500"
			>
				<strong>Play sound notifications</strong>
			</SlideToggle>

			<select
				class="select"
				bind:value={audioNotifyOnVal}
				on:change={() => audioNotifyOn.set(audioNotifyOnVal)}
				disabled={!audioContextUnlockedVal}
			>
				<option value="all">on test results, errors, and warnings</option>
				<option value="pass">on test passes, errors, and warnings</option>
				<option value="fail">on test failures, errors, and warnings</option>
				<option value="error">on errors and warnings</option>
			</select>

			<label class="label" class:opacity-50={!audioContextUnlockedVal}>
				<span>
					Volume
					{#if audioVolumeVal >= 0.6}
						<SvgIcon path={mdiVolumeHigh} class="inline-block" size="1.2em" />
					{:else if audioVolumeVal >= 0.25}
						<SvgIcon path={mdiVolumeMedium} class="inline-block" size="1.2em" />
					{:else if audioVolumeVal > 0}
						<SvgIcon path={mdiVolumeLow} class="inline-block" size="1.2em" />
					{:else}
						<SvgIcon path={mdiVolumeMute} class="inline-block" size="1.2em" />
					{/if}
				</span>
				<input
					type="range"
					bind:value={audioVolumeVal}
					min="0"
					max="1"
					step="0.1"
					on:change={() => audioVolume.set(audioVolumeVal.toString())}
					disabled={!audioContextUnlockedVal}
				/>
			</label>

			<div class="label flex flex-row space-x-4 items-center" class:opacity-50={!audioContextUnlockedVal}>
				<span class="flex-auto">Preview sounds:</span>
				<button
					class="btn btn-sm variant-ghost-surface hover:variant-ghost-success"
					disabled={!audioContextUnlockedVal || audio.playing()}
					on:click={() => audio.play('pass', true)}><SvgIcon path={mdiVolumeHigh} class="mr-2" /> Tests pass</button
				>
				<button
					class="btn btn-sm variant-ghost-surface hover:variant-ghost-error"
					disabled={!audioContextUnlockedVal || audio.playing()}
					on:click={() => audio.play('fail', true)}
					><SvgIcon path={mdiVolumeHigh} class="mr-2" /> Tests fail / error</button
				>
				<button
					class="btn btn-sm variant-ghost-surface hover:variant-ghost-warning"
					disabled={!audioContextUnlockedVal || audio.playing()}
					on:click={() => audio.play('warning', true)}><SvgIcon path={mdiVolumeHigh} class="mr-2" />Warning</button
				>
			</div>
		{/if}
	</div>

	<div class="flex flex-col space-y-4">
		<div class="text-xl border-b border-surface-500">Browser notifications</div>

		<SlideToggle
			name="notifications-slider"
			size="sm"
			bind:checked={notificationsActiveVal}
			on:change={() => notificationsActive.set(notificationsActiveVal ? 'true' : 'false')}
			active="bg-success-500"
		>
			<strong>Send browser notifications</strong>
		</SlideToggle>

		<select
			class="select"
			bind:value={notifyOnVal}
			on:change={() => notifyOn.set(notifyOnVal)}
			disabled={!notificationsActiveVal}
		>
			<option value="all">on test results, errors, and warnings</option>
			<option value="pass">on test passes, errors, and warnings</option>
			<option value="fail">on test failures, errors, and warnings</option>
			<option value="error">on test errors and warnings</option>
		</select>
	</div>

	<div class="flex flex-col space-y-4">
		<div class="text-xl border-b border-surface-500">Code coverage</div>

		<label class="label">
			<span>Coverage scale theme</span>
			<select class="select" bind:value={coverageThemeVal} on:change={() => coverageTheme.set(coverageThemeVal)}>
				<option value="white-to-green">white to green, red for no coverage</option>
				<option value="white-to-blue">white to blue, yellow for no coverage (color blind friendly)</option>
				<option value="heatmap">white to berry red, blue for no coverage (heat map)</option>
			</select>
		</label>

		<SlideToggle
			name="coverageShowBadges-slider"
			size="sm"
			bind:checked={coverageShowBadgesVal}
			on:change={() => coverageShowBadges.set(coverageShowBadgesVal ? 'true' : 'false')}
			active="bg-success-500"
		>
			<strong>Show coverage badges</strong>
		</SlideToggle>

		<div class:opacity-50={!coverageShowBadgesVal}>
			<SlideToggle
				name="coverageUseColor-slider"
				size="sm"
				bind:checked={coverageUseColorVal}
				on:change={() => coverageUseColor.set(coverageUseColorVal ? 'true' : 'false')}
				active="bg-success-500"
				disabled={!coverageShowBadgesVal}
			>
				<strong>Colorize coverage badges</strong>
			</SlideToggle>
		</div>

		<div class:opacity-50={!coverageShowBadgesVal || !coverageUseColorVal}>
			<label class="label">
				<span>Show high coverage badges</span>
				<div class="flex flex-row space-x-4 items-center">
					<select
						class="select"
						disabled={!coverageShowBadgesVal || !coverageUseColorVal}
						bind:value={coverageHighMinVal}
						on:change={() => coverageHighMin.set(coverageHighMinVal.toString())}
					>
						{#each coverageSteps as step}
							<option value={step} disabled={step <= coverageMediumMinVal}>when coverage is at least {step}%</option>
						{/each}
					</select>
					<button class="btn btn-sm variant-ghost-surface font-bold cursor-default tooltip" data-tip="Preview">
						<span>
							<CoverageIcon bind:percentage={coverageHighMinVal} positive={true} />
							{coverageHighMinVal}%
						</span>
					</button>
				</div>
			</label>
		</div>

		<div class:opacity-50={!coverageShowBadgesVal || !coverageUseColorVal}>
			<label class="label">
				<span>Show medium coverage badges</span>
				<div class="flex flex-row space-x-4 items-center">
					<select
						class="select"
						disabled={!coverageShowBadgesVal || !coverageUseColorVal}
						bind:value={coverageMediumMinVal}
						on:change={() => coverageMediumMin.set(coverageMediumMinVal.toString())}
					>
						{#each coverageSteps as step}
							<option value={step} disabled={step >= coverageHighMinVal}>when coverage is at least {step}%</option>
						{/each}
					</select>
					<button
						class="btn btn-sm variant-ghost-surface font-bold cursor-default float-right tooltip"
						data-tip="Preview"
					>
						<span>
							<CoverageIcon bind:percentage={coverageMediumMinVal} warning={true} />
							{coverageMediumMinVal}%
						</span>
					</button>
				</div>
			</label>
		</div>

		<div class="flex flex-row space-x-4 items-center" class:opacity-50={!coverageShowBadgesVal || !coverageUseColorVal}>
			<span class="flex-auto italic">
				Low coverage badges when coverage is below {coverageMediumMinVal}%
			</span>
			<button class="btn btn-sm variant-ghost-surface font-bold cursor-default flex-none tooltip" data-tip="Preview">
				<span>
					<CoverageIcon percentage={coverageMediumMinVal - 5} negative={true} />
					{coverageMediumMinVal - 5}%
				</span>
			</button>
		</div>
	</div>
</div>
