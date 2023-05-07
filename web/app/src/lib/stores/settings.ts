import { type Writable, writable } from 'svelte/store';

import { localStorageStore } from '../../skeleton';

import type {
	AudioNotifyOnSetting,
	CoverageThemeSetting,
	FilterCoverageLevel,
	FilterPackageStatus,
	FilterTestStatus,
	NotifyOnSetting
} from '$lib/common/types';

const defaultFilterPackageStatus: FilterPackageStatus[] = ['failing', 'passing'];
const defaultFilterTestStatus: FilterTestStatus[] = ['failing', 'passing', 'skipped'];
const defaultFilterCoverageLevel: FilterCoverageLevel[] = ['high', 'medium', 'low', 'none'];

export const runAllOnInit: Writable<string> = localStorageStore('settings.runAllOnLoad', 'true');

export const filterPackageStatus: Writable<string> = localStorageStore(
	'settings.filterPackageStatus',
	JSON.stringify(defaultFilterPackageStatus)
);

export const filterTestStatus: Writable<string> = localStorageStore(
	'settings.filterTestStatus',
	JSON.stringify(defaultFilterTestStatus)
);

export const filterCoverageLevel: Writable<string> = localStorageStore(
	'settings.filterCoverageLevel',
	JSON.stringify(defaultFilterCoverageLevel)
);

export const testGroupsCollapsed: Writable<string> = localStorageStore('settings.testGroupsCollapsed', 'false');

export const packagesPerPage: Writable<string> = localStorageStore('settings.packagesPerPage', '50');

export const sidebarCollapsed: Writable<string> = localStorageStore('settings.sidebarCollapsed', 'false');

export const audioContextUnlocked = writable<boolean>(false);

export const audioNotifyOn: Writable<AudioNotifyOnSetting> = localStorageStore('settings.audioNotifyOn', 'all');

export const audioVolume: Writable<string> = localStorageStore('settings.audioVolume', '1');

export const notificationsActive: Writable<string> = localStorageStore('settings.notificationsActive', 'false');

export const notifyOn: Writable<NotifyOnSetting> = localStorageStore('settings.notifyOn', 'all');

export const coverageShowBadges: Writable<string> = localStorageStore('settings.coverageShowBadges', 'true');

export const coverageUseColor: Writable<string> = localStorageStore('settings.coverageUseColor', 'true');

export const coverageHighMin: Writable<string> = localStorageStore('settings.coveragePositiveMin', '75');

export const coverageMediumMin: Writable<string> = localStorageStore('settings.coverageWarningMin', '50');

export const coverageTheme: Writable<CoverageThemeSetting> = localStorageStore(
	'settings.coverageTheme',
	'white-to-green'
);
