import { SvelteComponentTyped } from 'svelte';
import type { ConicStop } from './types';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Provide a data set of color stops and labels.*/
		stops?: ConicStop[] | undefined;
		/** Enable a contextual legend.*/
		legend?: boolean | undefined;
		/** When enabled, the conic gradient will spin.*/
		spin?: boolean | undefined;
		/** Style the conic gradient width.*/
		width?: string | undefined;
		/** Style the legend hover effect.*/
		hover?: string | undefined;
		/** Style the caption region above the gradient.*/
		regionCaption?: string | undefined;
		/** Style the conic gradient region.*/
		regionCone?: string | undefined;
		/** Style the legend region below the gradient.*/
		regionLegend?: string | undefined;
	};
	events: {
		click: MouseEvent;
		keydown: KeyboardEvent;
		keyup: KeyboardEvent;
		keypress: KeyboardEvent;
	} & {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		default: {};
	};
};
export type ConicGradientProps = typeof __propDef.props;
export type ConicGradientEvents = typeof __propDef.events;
export type ConicGradientSlots = typeof __propDef.slots;
export default class ConicGradient extends SvelteComponentTyped<
	ConicGradientProps,
	ConicGradientEvents,
	ConicGradientSlots
> {}
export {};
