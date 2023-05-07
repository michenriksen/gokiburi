<script lang="ts">
	import { ListBox, ListBoxItem, popup } from '../../skeleton';
	import {
		mdiCheckboxBlankOutline,
		mdiCheckboxMultipleBlankOutline,
		mdiCheckboxMultipleOutline,
		mdiCheckboxOutline,
		mdiMenuDown
	} from '@mdi/js';
	import type { PopupSettings } from '../../skeleton';

	import SvgIcon from '$lib/components/SvgIcon.svelte';

	type Option = {
		value: string;
		label: string;
	};

	export let options: Option[] = [];
	export let values: string[] = [];
	export let name = 'combobox';
	export let label = 'Items';
	export let icon = '';
	export let multiple = false;
	export let width = 'w-48';
	export let showToggleAll = true;
	export let showCount = true;

	let popupTarget = name + '-combobox';

	$: toggleAllLabel = values.length === 0 ? 'Select all' : 'Clear all';

	let popupCombobox: PopupSettings = {
		middleware: {
			offset: {
				mainAxis: 10,
				crossAxis: -13
			}
		},
		event: 'focus-click',
		target: popupTarget,
		placement: 'bottom',
		closeQuery: ''
	};

	function toggleAll() {
		if (values.length === 0) {
			values = options.map((opt) => opt.value);
		} else {
			values.length = 0;
		}
	}
</script>

<button class="btn variant-filled-surface {width} justify-between pr-3" use:popup={popupCombobox}>
	<div class="text-sm">
		{#if icon}<SvgIcon path={icon} class="inline-block pr-1 relative -top-[1px]" size="1.4em" />{/if}
		{label}
	</div>
	<div class="opacity-50">
		{#if showCount}<span class="text-sm">{values.length}/{options.length}</span>{/if}
		<SvgIcon path={mdiMenuDown} class="inline-block" size="1.4em" />
	</div>
</button>

<div class="card w-48 shadow-xl p-2 z-40" data-popup={popupTarget}>
	<ListBox {multiple} active="variant-filled-secondary" rounded="rounded" {...$$restProps}>
		{#if multiple && showToggleAll}
			<ListBoxItem
				group={[]}
				value=""
				name={name + '-toggleAll'}
				class="text-sm font-bold"
				active="hover:variant-soft-warning"
				hover="hover:variant-soft-warning"
				on:click={toggleAll}
			>
				<svelte:fragment slot="lead">
					{#if values.length === 0}
						<SvgIcon path={mdiCheckboxMultipleOutline} size="1.4em" class="inline-block" />
					{:else}
						<SvgIcon path={mdiCheckboxMultipleBlankOutline} size="1.4em" class="inline-block" />
					{/if}
				</svelte:fragment>
				{toggleAllLabel}
			</ListBoxItem>
		{/if}
		{#each options as option (option.value)}
			<ListBoxItem bind:group={values} {name} value={option.value} class="text-sm items-center">
				<svelte:fragment slot="lead">
					{#if values.includes(option.value)}
						<SvgIcon path={mdiCheckboxOutline} size="1.4em" />
					{:else}
						<SvgIcon path={mdiCheckboxBlankOutline} size="1.4em" />
					{/if}
				</svelte:fragment>
				{option.label}
			</ListBoxItem>
		{/each}
	</ListBox>
</div>
