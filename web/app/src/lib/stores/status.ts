import { writable } from 'svelte/store';

import type { Result, State } from '$lib/common/types';

export const state = writable<State>('init');

export const lastResult = writable<Result | null>(null);

export const root = writable<string | null>(null);
