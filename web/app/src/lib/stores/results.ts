import { writable } from 'svelte/store';

import type { Result } from '$lib/common/types';

export const results = writable<Result[] | null>(null);

export const currentResult = writable<Result | null>(null);
