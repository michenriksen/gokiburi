import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Provide display classes. Set `flex` to stretch full width.*/
		display?: string | undefined;
		/** Provide classes to set the base background color.*/
		background?: string | undefined;
		/** Provide classes to set the border styles.*/
		border?: string | undefined;
		/** Provide classes horizontal spacing between items.*/
		spacing?: string | undefined;
		/** Provide classes to set the border radius.*/
		rounded?: string | undefined;
		/** Provide classes to set the RadioItem padding.*/
		padding?: string | undefined;
		/** Provide classes to set the active item color.*/
		active?: string | undefined;
		/** Provide classes to set the hover style.*/
		hover?: string | undefined;
		/** Provide classes to set the highlighted text color.*/
		color?: string | undefined;
		/** Provide classes to set the highlighted SVG fill color.*/
		fill?: string | undefined;
		/** Provide the ARIA labelledby value.*/
		labelledby?: string | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		default: {};
	};
};
export type RadioGroupProps = typeof __propDef.props;
export type RadioGroupEvents = typeof __propDef.events;
export type RadioGroupSlots = typeof __propDef.slots;
export default class RadioGroup extends SvelteComponentTyped<RadioGroupProps, RadioGroupEvents, RadioGroupSlots> {}
export {};
