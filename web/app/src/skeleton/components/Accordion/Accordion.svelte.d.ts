import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Set the auto-collapse mode.*/
		autocollapse?: boolean | undefined;
		/** Set the drawer animation duration in milliseconds.*/
		duration?: number | undefined;
		/** Provide classes to set the vertical spacing between items.*/
		spacing?: string | undefined;
		/** Set the accordion disabled state for all items.*/
		disabled?: boolean | undefined;
		/** Provide classes to set the accordion item padding styles.*/
		padding?: string | undefined;
		/** Provide classes to set the accordion item hover styles.*/
		hover?: string | undefined;
		/** Provide classes to set the accordion item rounded styles.*/
		rounded?: string | undefined;
		/** Set the rotation of the item caret in the open state.*/
		caretOpen?: string | undefined;
		/** Set the rotation of the item caret in the closed state.*/
		caretClosed?: string | undefined;
		/** Provide arbitrary classes to the trigger button region.*/
		regionControl?: string | undefined;
		/** Provide arbitrary classes to the content panel region.*/
		regionPanel?: string | undefined;
		/** Provide arbitrary classes to the caret icon region.*/
		regionCaret?: string | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		default: {};
	};
};
export type AccordionProps = typeof __propDef.props;
export type AccordionEvents = typeof __propDef.events;
export type AccordionSlots = typeof __propDef.slots;
/** The Accordion parent element. */
export default class Accordion extends SvelteComponentTyped<AccordionProps, AccordionEvents, AccordionSlots> {}
export {};
