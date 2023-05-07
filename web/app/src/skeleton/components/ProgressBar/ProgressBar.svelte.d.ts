import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Specifies the amount completed. Indeterminate when `undefined`.*/
		value?: number | undefined;
		/** Minimum amount the bar represents.*/
		min?: number | undefined;
		/** Maximum amount the bar represents.*/
		max?: number | undefined;
		/** Provide classes to set track height.*/
		height?: string | undefined;
		/** Provide classes to set rounded styles.*/
		rounded?: string | undefined;
		/** Provide arbitrary classes to style the meter element.*/
		meter?: string | undefined;
		/** Provide arbitrary classes to style the track element.*/
		track?: string | undefined;
		/** Provide the ARIA labelledby value.*/
		labelledby?: string | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type ProgressBarProps = typeof __propDef.props;
export type ProgressBarEvents = typeof __propDef.events;
export type ProgressBarSlots = typeof __propDef.slots;
export default class ProgressBar extends SvelteComponentTyped<ProgressBarProps, ProgressBarEvents, ProgressBarSlots> {}
export {};
