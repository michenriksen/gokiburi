<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { mdiAlertCircle, mdiCheckCircleOutline, mdiCloseCircleOutline, mdiTimerRemoveOutline } from '@mdi/js';

	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import type { Result } from '$lib/common/types';

	const dispatch = createEventDispatcher();
	const iconSize = '1.5em';

	export let result: Result;
	export let active = false;
</script>

<button
	type="button"
	class="btn btn-sm btn-icon"
	class:variant-ghost-success={active && result.pass}
	class:variant-ghost-error={active && !result.pass}
	class:variant-soft-success={!active && result.pass}
	class:variant-soft-error={!active && !result.pass}
	value={result.uuid}
	on:click={() => dispatch('click', result.uuid)}
>
	<span>
		{#if result.pass}
			<SvgIcon path={mdiCheckCircleOutline} class="text-success-500" size={iconSize} />
		{:else if result.error}
			{#if result.error == 'timeout'}
				<SvgIcon path={mdiTimerRemoveOutline} class="text-error-500" size={iconSize} />
			{:else}
				<SvgIcon path={mdiAlertCircle} class="text-error-500" size={iconSize} />
			{/if}
		{:else}
			<SvgIcon path={mdiCloseCircleOutline} class="text-error-500" size={iconSize} />
		{/if}
	</span>
</button>
