<script lang="ts">
	import { mdiCompassOutline, mdiRobotDeadOutline } from '@mdi/js';
	import { page } from '$app/stores';

	import SvgIcon from '$lib/components/SvgIcon.svelte';
</script>

<div class="min-h-full min-w-full flex items-center justify-center">
	<div class="flex flex-col space-y-6 p-6 text-center">
		{#if $page.status === 404}
			<SvgIcon
				path={mdiCompassOutline}
				size="200px"
				class="text-primary-700 m-auto animate-[spin_3s_ease-in-out_alternate_infinite]"
			/>
			<h3>Page not found</h3>
		{:else}
			<SvgIcon path={mdiRobotDeadOutline} size="200px" class="text-error-400 m-auto" />
			<h3>Something went wrong</h3>
			<p class="opacity-50 text-sm font-mono">{$page.status} {$page.error?.message}</p>
		{/if}
	</div>
</div>
