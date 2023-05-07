<script lang="ts">
	import { scale } from 'svelte/transition';

	import {
		mdiCloseCircleOutline,
		mdiDebugStepOver,
		mdiListStatus,
		mdiPackageVariantClosed,
		mdiTimerOutline
	} from '@mdi/js';

	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import { formatDuration, pluralize } from '$lib/common/utils';
	import type { Result } from '$lib/common/types';

	export let result: Result;
</script>

<div class="logo-cloud grid-cols-1 lg:!grid-cols-5 gap-1 mb-6">
	<div class="logo-item !text-primary-600">
		<span><SvgIcon path={mdiPackageVariantClosed} size="2.5em" /></span>
		<span in:scale>{pluralize(result.packages?.length || 0, 'Package', 'Packages')}</span>
	</div>
	<div class="logo-item !text-primary-600">
		<span><SvgIcon path={mdiListStatus} size="2.5em" /></span>
		<span in:scale>{pluralize(result.tests, 'Test', 'Tests')}</span>
	</div>
	<div class="logo-item" class:!text-error-400={result.failed > 0} class:!text-primary-600={result.failed == 0}>
		<span><SvgIcon path={mdiCloseCircleOutline} size="2.5em" /></span>
		<span in:scale>{result.failed} Failing</span>
	</div>
	<div class="logo-item" class:!text-warning-500={result.skipped > 0} class:!text-primary-600={result.skipped == 0}>
		<span><SvgIcon path={mdiDebugStepOver} size="2.5em" /></span>
		<span in:scale>{result.skipped} Skipped</span>
	</div>
	<div class="logo-item !text-primary-600">
		<span><SvgIcon path={mdiTimerOutline} size="2.5em" /></span>
		<span in:scale>{formatDuration(result.duration)}</span>
	</div>
</div>
