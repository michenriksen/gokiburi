<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { ListBoxItem } from '../../skeleton';
	import {
		mdiAlertCircleOutline,
		mdiCheckCircleOutline,
		mdiCloseCircleOutline,
		mdiListStatus,
		mdiTimerRemoveOutline
	} from '@mdi/js';
	import { formatDistanceToNowStrict, lightFormat, parseJSON } from 'date-fns';

	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import type { Result } from '$lib/common/types';

	const iconSize = '1.5em';

	export let result: Result;
	export let group: string;

	const resultTime = parseJSON(result.start);

	let relativeTime = formatDistanceToNowStrict(resultTime, { addSuffix: true });
	let relativeTimeInterval: number;

	onMount(() => {
		relativeTimeInterval = window.setInterval(() => {
			relativeTime = formatDistanceToNowStrict(resultTime, { addSuffix: true });
		}, 5000);
	});
	onDestroy(() => {
		window.clearInterval(relativeTimeInterval);
	});
</script>

<ListBoxItem
	bind:group
	name="result"
	value={result.uuid}
	active={result.pass ? 'variant-ghost-success' : 'variant-ghost-error'}
	hover={result.pass ? 'variant-soft-success' : 'variant-soft-error'}
>
	<svelte:fragment slot="lead">
		{#if result.pass}
			<SvgIcon path={mdiCheckCircleOutline} class="text-success-500" size={iconSize} />
		{:else if result.error}
			{#if result.error == 'timeout'}
				<SvgIcon path={mdiTimerRemoveOutline} class="text-error-500" size={iconSize} />
			{:else}j
				<SvgIcon path={mdiAlertCircleOutline} class="text-error-500" size={iconSize} />
			{/if}
		{:else}
			<SvgIcon path={mdiCloseCircleOutline} class="text-error-500" size={iconSize} />
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<SvgIcon path={mdiListStatus} class="inline-block align-[-4px]" />
		<span class="text-sm">
			{#if result.pass}
				{result.passed}/{result.tests}
			{:else if result.error}
				0/0
			{:else}
				{result.failed}/{result.tests}
			{/if}
		</span>
	</svelte:fragment>
	<span title={lightFormat(resultTime, 'H:mm yyyy-MM-dd')}>{relativeTime}</span>
</ListBoxItem>
