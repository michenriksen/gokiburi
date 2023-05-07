import { get } from 'svelte/store';

import { coverageHighMin, coverageMediumMin } from './stores/settings';

import type { FilterSettings, Package, Test } from '$lib/common/types';

const coverageHighMinVal = parseFloat(get(coverageHighMin));
const coverageMediumMinVal = parseFloat(get(coverageMediumMin));

/**
 * Default filter settings.
 */
export const defaultFilterSettings: FilterSettings = {
	search: '',
	packageStatus: ['failing', 'passing'],
	testStatus: ['failing', 'passing', 'skipped'],
	coverage: ['high', 'medium', 'low', 'none']
};

/**
 * Filter packages according to the provided settings.
 *
 * @remarks If a search term is provided, all other settings are ignored.
 *
 * @param pkgs - Packages to filter.
 * @param settings - Settings to filter by.
 *
 * @returns Filtered packages.
 */
export function filterPackages(pkgs: Package[], settings: FilterSettings): Package[] {
	if (pkgs === undefined) {
		return [];
	}

	if (!settings) {
		return pkgs;
	}

	if (settings.search !== '') {
		const search = settings.search.toLowerCase();

		return pkgs.filter((pkg: Package): boolean => {
			return pkg.tests.some((test: Test): boolean => test.name.toLowerCase().includes(search));
		});
	}

	return pkgs.filter((pkg: Package): boolean => {
		return Object.keys(settings).every((key: string): boolean => {
			switch (key) {
				case 'search':
					return (
						pkg.name.toLowerCase().includes(settings.search.toLowerCase()) ||
						pkg.tests.some((test: Test): boolean => test.name.toLowerCase().includes(settings.search.toLowerCase()))
					);
				case 'packageStatus':
					if (pkg.tests.length === 0) {
						return settings.packageStatus.includes('noTests');
					}

					return settings.packageStatus.includes(pkg.pass ? 'passing' : 'failing');
				case 'coverage':
					if (pkg.coverage >= coverageHighMinVal) {
						return settings.coverage.includes('high');
					} else if (pkg.coverage >= coverageMediumMinVal) {
						return settings.coverage.includes('medium');
					} else if (pkg.coverage > 0) {
						return settings.coverage.includes('low');
					} else {
						return settings.coverage.includes('none');
					}
				default:
					return true;
			}
		});
	});
}

/**
 * Filter tests according to the provided settings.
 *
 * @remarks If a search term is provided, all other settings are ignored.
 *
 * @param tests - Tests to filter.
 * @param settings - Settings to filter by.
 *
 * @returns Filtered tests.
 */
export function filterTests(tests: Test[], settings: FilterSettings): Test[] {
	if (tests === undefined) {
		return [];
	}

	if (!settings) {
		return tests;
	}

	if (settings.search !== '') {
		const search = settings.search.toLowerCase();

		return tests.filter((test: Test): boolean => {
			return test.name.toLowerCase().includes(search);
		});
	}

	return tests.filter((test: Test): boolean => {
		return Object.keys(settings).every((key: string): boolean => {
			switch (key) {
				case 'search':
					return test.name.toLowerCase().includes(settings[key].toLowerCase());
				case 'testStatus':
					if (test.skip) {
						return settings.testStatus.includes('skipped');
					}

					return settings.testStatus.includes(test.pass ? 'passing' : 'failing');
				default:
					return true;
			}
		});
	});
}
