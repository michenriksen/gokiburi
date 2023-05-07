import { SvelteComponentTyped } from 'svelte';
import type { Writable } from 'svelte/store';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Provide a unique value, active tiles will be highlighted.*/
		value?: any | undefined;
		/** Provide the element tag. Button or Anchor recommended.*/
		tag?: string | undefined;
		/** Provide the visible text label.*/
		label?: string | undefined;
		/** Provide arbitrary classes to style the icon region.*/
		regionIcon?: string | undefined;
		/** Provide arbitrary classes to style the label region.*/
		regionLabel?: string | undefined;
		selected?: Writable<string> | undefined;
		active?: Writable<string> | undefined;
		hover?: Writable<string> | undefined;
	};
	events: {
		keydown: KeyboardEvent;
		keyup: KeyboardEvent;
		keypress: KeyboardEvent;
		/** {{ event }} click - Fires when the component is clicked.*/
		click: CustomEvent<MouseEvent>;
	} & {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		default: {};
	};
};
export type AppRailTileProps = typeof __propDef.props;
export type AppRailTileEvents = typeof __propDef.events;
export type AppRailTileSlots = typeof __propDef.slots;
/** A navigation tile for the App Rail component. */
export default class AppRailTile extends SvelteComponentTyped<AppRailTileProps, AppRailTileEvents, AppRailTileSlots> {}
export {};
