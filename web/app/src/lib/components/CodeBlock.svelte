<script lang="ts">
	import { onDestroy } from 'svelte';

	import { coverageTheme } from '$lib/stores/settings';

	export let code: string;

	let coverageThemeVal: string;

	const unsubscribe = coverageTheme.subscribe((newSetting) => {
		coverageThemeVal = newSetting;
	});

	onDestroy(() => unsubscribe());
</script>

<div class="relative x-10">
	<div
		class="card p-2 m-2 absolute top-0 right-0 opacity-50 hover:opacity-100 transition-opacity flex flex-row space-x-4 cursor-default invisible md:visible"
	>
		<div class="font-bold">colors:</div>
		<div class="flex flex-row space-x-2 code {coverageThemeVal}">
			<span class="gokiburi-cov-1">lowest</span>
			<span class="gokiburi-cov-1">&#8251;</span>
			<span class="gokiburi-cov-2">&#8251;</span>
			<span class="gokiburi-cov-3">&#8251;</span>
			<span class="gokiburi-cov-4">&#8251;</span>
			<span class="gokiburi-cov-5">&#8251;</span>
			<span class="gokiburi-cov-6">&#8251;</span>
			<span class="gokiburi-cov-7">&#8251;</span>
			<span class="gokiburi-cov-8">&#8251;</span>
			<span class="gokiburi-cov-9">&#8251;</span>
			<span class="gokiburi-cov-10">&#8251;</span>
			<span class="gokiburi-cov-10">highest</span>
		</div>
		<div class="code {coverageThemeVal}"><span class="gokiburi-cov-0">no coverage</span></div>
		<div class="code {coverageThemeVal} !text-surface-400">non-runnable</div>
	</div>
	<pre
		role="code"
		class="code {coverageThemeVal} text-sm !bg-zinc-950 !text-surface-400 font-mono !rounded-none">{@html code}</pre>
</div>

<style lang="postcss">
	div :global(.code.white-to-green .gokiburi-cov-0) {
		@apply !text-red-600;
	}

	div :global(.code.white-to-green .gokiburi-cov-1) {
		color: #ffffff;
	}

	div :global(.code.white-to-green .gokiburi-cov-2) {
		color: #f1f9e5;
	}

	div :global(.code.white-to-green .gokiburi-cov-3) {
		color: #e3f3cb;
	}

	div :global(.code.white-to-green .gokiburi-cov-4) {
		color: #d5edb1;
	}

	div :global(.code.white-to-green .gokiburi-cov-5) {
		color: #c7e797;
	}

	div :global(.code.white-to-green .gokiburi-cov-6) {
		color: #b9e17d;
	}

	div :global(.code.white-to-green .gokiburi-cov-7) {
		color: #abdb63;
	}

	div :global(.code.white-to-green .gokiburi-cov-8) {
		color: #9dd549;
	}

	div :global(.code.white-to-green .gokiburi-cov-9) {
		color: #8fcf2f;
	}

	div :global(.code.white-to-green .gokiburi-cov-10) {
		color: #84cc16;
	}

	div :global(.code.white-to-blue .gokiburi-cov-0) {
		color: #dba507;
	}

	div :global(.code.white-to-blue .gokiburi-cov-1) {
		color: #ffffff;
	}

	div :global(.code.white-to-blue .gokiburi-cov-2) {
		color: #e3f1ff;
	}

	div :global(.code.white-to-blue .gokiburi-cov-3) {
		color: #c7e3ff;
	}

	div :global(.code.white-to-blue .gokiburi-cov-4) {
		color: #abd5ff;
	}

	div :global(.code.white-to-blue .gokiburi-cov-5) {
		color: #8fc7ff;
	}

	div :global(.code.white-to-blue .gokiburi-cov-6) {
		color: #73b9ff;
	}

	div :global(.code.white-to-blue .gokiburi-cov-7) {
		color: #57abff;
	}

	div :global(.code.white-to-blue .gokiburi-cov-8) {
		color: #3b9dff;
	}

	div :global(.code.white-to-blue .gokiburi-cov-9) {
		color: #1f8fff;
	}

	div :global(.code.white-to-blue .gokiburi-cov-10) {
		color: #0381ff;
	}

	div :global(.code.heatmap .gokiburi-cov-0) {
		color: #17b6e9;
	}

	div :global(.code.heatmap .gokiburi-cov-1) {
		color: #ffffff;
	}

	div :global(.code.heatmap .gokiburi-cov-2) {
		color: #fbe0e9;
	}

	div :global(.code.heatmap .gokiburi-cov-3) {
		color: #f7c1d3;
	}

	div :global(.code.heatmap .gokiburi-cov-4) {
		color: #f3a3bd;
	}

	div :global(.code.heatmap .gokiburi-cov-5) {
		color: #ef84a7;
	}

	div :global(.code.heatmap .gokiburi-cov-6) {
		color: #ea6590;
	}

	div :global(.code.heatmap .gokiburi-cov-7) {
		color: #e6467a;
	}

	div :global(.code.heatmap .gokiburi-cov-8) {
		color: #e22864;
	}

	div :global(.code.heatmap .gokiburi-cov-9) {
		color: #cc1b55;
	}

	div :global(.code.heatmap .gokiburi-cov-10) {
		color: #ad1748;
	}
</style>
