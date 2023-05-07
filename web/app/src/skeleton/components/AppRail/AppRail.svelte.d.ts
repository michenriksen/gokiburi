import { SvelteComponentTyped } from 'svelte';
import { type Writable } from 'svelte/store';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Provide a writable store to maintain navigation selection.*/
		selected?: Writable<any> | undefined;
		/** Provide classes to set the background color.*/
		background?: string | undefined;
		/** Provide classes to set the background color.*/
		border?: string | undefined;
		/** Provide classes to set the tile active tile background.*/
		active?: string | undefined;
		/** Provide classes to set the tile hover background color.*/
		hover?: string | undefined;
		/** Provide classes to set the width.*/
		width?: string | undefined;
		/** Provide classes to set the height.*/
		height?: string | undefined;
		/** Provide a class to set the grid gap.*/
		gap?: string | undefined;
		/** Provide arbitrary classes to the lead region.*/
		regionLead?: string | undefined;
		/** Provide arbitrary classes to the default region.*/
		regionDefault?: string | undefined;
		/** Provide arbitrary classes to the trail region.*/
		regionTrail?: string | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		lead: {};
		default: {};
		trail: {};
	};
};
export type AppRailProps = typeof __propDef.props;
export type AppRailEvents = typeof __propDef.events;
export type AppRailSlots = typeof __propDef.slots;
/** A vertical navigation rail component. */
export default class AppRail extends SvelteComponentTyped<AppRailProps, AppRailEvents, AppRailSlots> {}
export {};
