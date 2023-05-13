<script lang="ts">
	import '../theme.postcss';
	import '../skeleton/styles/all.css';
	import '../app.postcss';

	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { get } from 'svelte/store';

	import { storePopup } from '../skeleton';
	import { AppShell, Drawer, drawerStore, Toast, toastStore } from '../skeleton';
	import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { mdiHeart } from '@mdi/js';
	import type { DrawerSettings } from '../skeleton';

	import AppBar from '$lib/components/AppBar.svelte';
	import CoverageReport from '$lib/components/CoverageReport.svelte';
	import OfflineAlert from '$lib/components/OfflineAlert.svelte';
	import Settings from '$lib/components/Settings.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SvgIcon from '$lib/components/SvgIcon.svelte';

	import { openSettingsEvent, runTestsEvent } from '$lib/stores/events';
	import { metadata } from '$lib/stores/metadata';
	import { results } from '$lib/stores/results';
	import { notificationsActive, runAllOnInit } from '$lib/stores/settings';
	import { lastResult, state } from '$lib/stores/status';

	import ApiService, { apiErrorHandler } from '$lib/services/api';
	import NotificationService from '$lib/services/notifications';
	import { WSMessageManager } from '$lib/services/websocket';

	import { pluralize, setPageTitle } from '$lib/common/utils';
	import type { State } from '$lib/common/types';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset });

	const meta = get(metadata);

	const settingsDrawer: DrawerSettings = {
		id: 'settings',
		position: 'right',
		width: 'w-5/6 md:w-1/3'
	};

	let wsMessageManager: WSMessageManager;
	let stateVal: State = 'init';
	let notificationsActiveVal: boolean;
	let isClearingResults: boolean;
	let subscriptions: Unsubscriber[] = [];

	$: if (notificationsActiveVal) {
		if (!NotificationService.browserNotificationsGranted()) {
			NotificationService.requestBrowserNotifications()
				.then((granted: boolean) => {
					if (granted) {
						notificationsActive.set('true');
					} else {
						notificationsActive.set('false');
						notificationsActiveVal = false;
						toastStore.trigger({
							message: 'Browser notification permission request was denied.',
							background: 'variant-soft-error'
						});
					}
				})
				.catch((error) => {
					notificationsActive.set('false');
					notificationsActiveVal = false;
					console.error(error);
					toastStore.trigger({
						message: 'An error occurred when asking for browser notification permissions.',
						background: 'variant-soft-error'
					});
				});
		} else {
			notificationsActive.set('true');
		}
	} else {
		notificationsActive.set('false');
	}

	subscriptions.push(
		state.subscribe((newState) => {
			if (stateVal === 'init' && newState === 'ready' && get(runAllOnInit) === 'true') {
				if (window.location.pathname === '/' && !import.meta.hot) {
					run('./...');
					return;
				}
			}

			stateVal = newState;

			switch (stateVal) {
				case 'running':
					setPageTitle('▶ RUNNING...');
					break;
				case 'paused':
					setPageTitle('❚❚ PAUSED');
					break;
				case 'closing':
					setPageTitle('⏻ CLOSING...');
					break;
			}
		})
	);

	subscriptions.push(
		lastResult.subscribe(async (newResult) => {
			if (!newResult) {
				return;
			}

			if (newResult.pass) {
				NotificationService.notify(
					`Ran ${pluralize(newResult.tests, 'test', 'tests')} with 0 failures.`,
					'pass',
					newResult.uuid
				);
				setPageTitle(`✓ PASS: ${pluralize(newResult.tests, 'test', 'tests')}`);
			} else {
				NotificationService.notify(
					`Ran ${pluralize(newResult.tests, 'test', 'tests')} with ${pluralize(
						newResult.failed,
						'failure',
						'failures'
					)}.`,
					'fail',
					newResult.uuid
				);
				setPageTitle(`✖ FAIL: ${pluralize(newResult.failed, 'failure', 'failures')}`);
			}

			fetchResults();
		})
	);

	subscriptions.push(
		notificationsActive.subscribe((newSetting: string) => {
			notificationsActiveVal = newSetting === 'true';
		})
	);

	subscriptions.push(
		runTestsEvent.subscribe((pkg: string) => {
			if (pkg !== '' && stateVal === 'ready') {
				run(pkg);
				runTestsEvent.set('');
			}
		})
	);

	subscriptions.push(
		openSettingsEvent.subscribe((opened: boolean) => {
			if (opened === true) {
				drawerStore.open(settingsDrawer);
			}
		})
	);

	async function pause() {
		state.set('paused');

		wsMessageManager.stop();

		await apiErrorHandler(() => ApiService.pause());
	}

	async function resume() {
		state.set('init');
		setPageTitle('READY...');

		wsMessageManager.start();

		await apiErrorHandler(() => ApiService.resume());
	}

	async function run(pkg: string) {
		if (stateVal === 'running') {
			toastStore.trigger({
				message: 'Skipping test run as another is already in progress.',
				background: 'variant-soft-warning'
			});

			return;
		}

		state.set('running');

		await apiErrorHandler(() => ApiService.run(pkg));
	}

	async function fetchResults() {
		const [, newResults] = await apiErrorHandler(() => ApiService.results());

		if (newResults !== undefined) {
			results.set(newResults);
		}
	}

	async function clearResults() {
		isClearingResults = true;
		await apiErrorHandler(() => ApiService.clearResults());
		results.set(null);
		isClearingResults = false;
	}

	onMount(() => {
		wsMessageManager = WSMessageManager.getInstance(`ws://${window.location.host}/ws`);
		wsMessageManager.start();
		fetchResults();
	});

	onDestroy(() => {
		if (wsMessageManager) {
			wsMessageManager.stop();
		}

		subscriptions.forEach((unsubscribe) => unsubscribe());
	});
</script>

<Drawer>
	{#if $drawerStore.id === 'coverageReport'}
		<CoverageReport uuid={$drawerStore.meta.uuid} pkg={$drawerStore.meta.pkg} />
	{:else if $drawerStore.id === 'settings'}
		<Settings />
	{/if}
</Drawer>

<AppShell
	slotSidebarLeft="h-full bg-surface-900 border-r border-surface-500/30"
	slotPageContent="snap-y snap-mandatory"
>
	<svelte:fragment slot="header">
		<OfflineAlert />
		<AppBar on:pause={pause} on:resume={resume} />
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		<Sidebar
			on:clearResults={clearResults}
			on:run={(e) => run(e.detail)}
			on:showingResult={() => stateVal === 'running' && state.set('ready')}
			disableClearResults={isClearingResults || stateVal === 'offline' || stateVal === 'running'}
		/>
	</svelte:fragment>

	<slot />

	<footer
		class="flex flex-row space-x-2 items-center mt-[100px] py-8 text-sm text-center text-surface-500 hover:text-surface-400 justify-center border-t border-surface-700 transition-colors"
	>
		<div>
			{meta.appName} <span class:text-warning-400={meta.isDevVersion}>v{meta.version}</span>
		</div>
		<div>|</div>
		<div>
			made with <SvgIcon path={mdiHeart} class="inline-block" /> by
			<a class="!text-inherit" href="https://michenriksen.com" target="_blank">Michael Henriksen</a>
		</div>
		<div>|</div>
		<div>
			<a class="!text-inherit" href={meta.issuesUrl} target="_blank">report issue</a>
		</div>
		<div>|</div>
		<div>
			<a class="!text-inherit" href={meta.projectUrl} target="_blank">source</a>
		</div>
	</footer>

	<Toast position="br" max={2} />
</AppShell>
