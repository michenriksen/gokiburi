import { writable } from 'svelte/store';

export const transitionsActive = writable<boolean>(true);
