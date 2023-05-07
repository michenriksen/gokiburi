import { writable } from 'svelte/store';

export const runTestsEvent = writable<string>('');
export const openSettingsEvent = writable<boolean>(false);

/**
 * Dispatch event to run tests for given package.
 *
 * @param pkg - Go package name.
 */
export function dispatchRunTests(pkg: string) {
	runTestsEvent.set(pkg);
}

/**
 * Dispatch event to open settings drawer.
 */
export function dispatchOpenSettings() {
	openSettingsEvent.set(true);
}
