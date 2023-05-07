import type { ScaleParams, TransitionConfig } from 'svelte/transition';
import { scale } from 'svelte/transition';

import { transitionsActive } from '$lib/stores/transitions';

import { sleep } from '$lib/common/utils';

const lockName = 'stores.transitionsActive';

let transitionsActiveVal = true;

transitionsActive.subscribe((newSetting) => {
	transitionsActiveVal = newSetting;
});

/**
 * Turn transitions off.
 *
 * Instructs aware components to not use transitions.
 * until enabled again with {@line transitionsOn()} or
 * {@link transitionsOffForDuration}.
 *
 * @returns - Promise that resolves to true if lock was acquired and
 * transitions were turned off.
 */
export function transitionsOff(): Promise<boolean> {
	return new Promise((resolve) => {
		navigator.locks.request(lockName, { ifAvailable: true }, (lock) => {
			if (lock) {
				transitionsActive.set(false);
				return resolve(true);
			}
			resolve(false);
		});
	});
}

/**
 * Turn transitions on.
 *
 * Instructs aware components to use transitions.
 *
 * @returns - Promise that resolves to true if lock was acquired and
 * transitions were turned on.
 */
export function transitionsOn(): Promise<boolean> {
	return new Promise((resolve) => {
		navigator.locks.request(lockName, { ifAvailable: true }, (lock) => {
			if (lock) {
				transitionsActive.set(true);
				return resolve(true);
			}
			resolve(false);
		});
	});
}

/**
 * Turn transitions off for a duration.
 *
 * Instructs aware components to not use transitions for the given duration,
 * which is useful for situations where many transitions would otherwise happen
 * at once.
 *
 * Calling this function will lock the transitions off until the duration has
 * passed, to prevent another call to {@link transitionsOn} or
 * {@link transitionsOffForDuration} with a shorter duration from prematurely
 * re-enabling transitions.
 *
 * @param duration - Duration in milliseconds to turn transitions off for.
 *
 * @returns - Promise that resolves to true if lock was acquired and
 * transitions were turned off for duration.
 */
export function transitionsOffForDuration(duration: number): Promise<boolean> {
	return new Promise((resolve) => {
		navigator.locks.request(lockName, { ifAvailable: true }, async (lock) => {
			if (lock) {
				transitionsActive.set(false);
				await sleep(duration);
				transitionsActive.set(true);
				return resolve(true);
			}
			resolve(false);
		});
	});
}

/**
 * Conditional scale transition.
 *
 * Returns a scale transition if transitions are enabled, otherwise returns
 * an empty object.
 */
export function conditionalScale(node: Element, params?: ScaleParams | undefined): TransitionConfig {
	return transitionsActiveVal ? scale(node, params) : {};
}
