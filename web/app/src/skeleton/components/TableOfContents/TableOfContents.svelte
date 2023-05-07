<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	export let scrollParent = '#page';
	export let target = '#page';
	export let allowedHeadings = 'h2, h3';
	export let label = 'On This Page';
	export let width = 'w-[240px]';
	export let spacing = 'space-y-4';
	export let text = 'text-surface-600-300-token';
	export let hover = 'hover:bg-primary-hover-token';
	export let active = 'bg-primary-active-token !text-on-primary-token';
	export let rounded = 'rounded-token';
	export let regionLabel = 'font-bold';
	export let regionList = '';
	const cLabel = 'p-4 pt-0';
	const cList = 'list-none space-y-1';
	const cListItem = 'px-4 py-2 cursor-pointer';
	let elemScrollParent;
	let allowedHeadingsList = [];
	let filteredHeadingsList = [];
	let activeHeaderId;
	function queryAllowedHeadingsList() {
		const elemTarget = document.querySelector(target);
		allowedHeadingsList = elemTarget?.querySelectorAll(allowedHeadings);
	}
	function generateHeadingList() {
		allowedHeadingsList?.forEach((elem) => {
			if (elem.hasAttribute('data-toc-ignore')) return;
			if (!elem.id) {
				let newId = elem.innerText
					.replaceAll(/[^a-zA-Z0-9 ]/g, '')
					.replaceAll(' ', '-')
					.toLowerCase();
				elem.id = `${newId}`;
			}
			if (!elem.querySelector('.permalink')) {
				elem.innerHTML += `<a href="#${elem.id}" class="permalink">\u{1F517}</a>`;
			}
			filteredHeadingsList.push(elem);
		});
		filteredHeadingsList = [...filteredHeadingsList];
	}
	function setHeadingClasses(headingElem) {
		if (headingElem.tagName === 'H3') return 'ml-3';
		if (headingElem.tagName === 'H4') return 'ml-6';
		if (headingElem.tagName === 'H5') return 'ml-9';
		if (headingElem.tagName === 'H6') return 'ml-12';
		return '';
	}
	function scrollToHeading(headingElem) {
		const elemTarget = document.querySelector(`#${headingElem.id}`);
		elemTarget.scrollIntoView({ behavior: 'smooth' });
	}
	function pageScrollHandler() {
		const headingSizeThreshold = 40;
		let visibleHeadings = [];
		allowedHeadingsList?.forEach((header) => {
			const scrollableTop = elemScrollParent?.getBoundingClientRect().top || 0;
			const headerBoundTop = header.getBoundingClientRect().top;
			const offsetTop = headerBoundTop - scrollableTop + headingSizeThreshold;
			if (offsetTop >= 0) visibleHeadings.push(header);
		});
		activeHeaderId = visibleHeadings[0]?.id;
	}
	onMount(() => {
		queryAllowedHeadingsList();
		generateHeadingList();
		elemScrollParent = document.querySelector(scrollParent);
		elemScrollParent?.addEventListener('scroll', pageScrollHandler);
		pageScrollHandler();
	});
	onDestroy(() => {
		elemScrollParent?.removeEventListener('scroll', pageScrollHandler);
	});
	$: classesBase = `${width} ${spacing} ${$$props.class ?? ''}`;
	$: classesLabel = `${cLabel} ${regionLabel}`;
	$: classesList = `${cList} ${regionList}`;
	$: classesListItem = `${cListItem} ${text} ${hover} ${rounded}`;
</script>

<!-- @component Allows you to quickly navigate the hierarchy of headings for the current page. -->

{#if filteredHeadingsList.length > 0}
	<div class="toc {classesBase}" transition:fade|local={{ duration: 100 }}>
		<nav class="toc-list {classesList}">
			<div class="toc-label {classesLabel}">{label}</div>
			{#each filteredHeadingsList as headingElem, i}
				<!-- prettier-ignore -->
				<li
					class="toc-list-item {classesListItem} {setHeadingClasses(headingElem)} {headingElem.id === activeHeaderId ? active : ''}"
					on:click={() => { scrollToHeading(headingElem); }}
					on:click
					on:keypress
				>
					<!-- {headingElem.innerText} -->
					{headingElem.firstChild?.nodeValue}
				</li>
			{/each}
		</nav>
	</div>
{/if}
