import { type Writable } from 'svelte/store';
import type { PopupSettings } from './types';
export declare const storePopup: Writable<any>;
export declare function popup(
	node: HTMLElement,
	args: PopupSettings
):
	| {
			update(newArgs: PopupSettings): void;
			destroy(): void;
	  }
	| undefined;
