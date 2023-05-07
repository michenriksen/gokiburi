<script lang="ts">
	import { onDestroy } from 'svelte';

	import { mdiLightningBoltCircle } from '@mdi/js';

	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import { state } from '$lib/stores/status';

	import type { State } from '$lib/common/types';

	let stateVal: State = 'init';

	const unsubscribe = state.subscribe((newState) => {
		stateVal = newState;
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if stateVal === 'offline'}
	<div
		class="bg-red-800 drop-shadow-lg px-6 py-2 border-b border-red-900 flex flex-row space-x-6 items-center justify-center"
	>
		<div><SvgIcon path={mdiLightningBoltCircle} size="1.6em" class="animate-pulse" /></div>
		<div class="text-lg uppercase">Backend API Unresponsive</div>
	</div>
{/if}
