import { SvelteComponentTyped } from 'svelte';
import type { Writable } from 'svelte/store';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Set open by default on load.*/
		open?: boolean | undefined;
		/** Provide a unique input id. Auto-generated by default*/
		id?: string | undefined;
		/** Set the auto-collapse mode.*/
		autocollapse?: boolean | undefined;
		/** The writable store that houses the auto-collapse active item UUID.*/
		active?: Writable<string | null> | undefined;
		/** Set the drawer animation duration.*/
		duration?: number | undefined;
		/** Set the disabled state for this item.*/
		disabled?: boolean | undefined;
		/** Provide classes to set the accordion item padding styles.*/
		padding?: string | undefined;
		/** Provide classes to set the accordion item hover styles.*/
		hover?: string | undefined;
		/** Provide classes to set the accordion item rounded styles.*/
		rounded?: string | undefined;
		/** Provide arbitrary classes to the trigger button region.*/
		caretOpen?: string | undefined;
		/** Provide arbitrary classes to content panel region.*/
		caretClosed?: string | undefined;
		/** Provide arbitrary classes to the trigger button region.*/
		regionControl?: string | undefined;
		/** Provide arbitrary classes to content panel region.*/
		regionPanel?: string | undefined;
		/** Provide arbitrary classes caret icon region.*/
		regionCaret?: string | undefined;
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
		lead: {};
		summary: {};
		content: {};
	};
};
export type AccordionItemProps = typeof __propDef.props;
export type AccordionItemEvents = typeof __propDef.events;
export type AccordionItemSlots = typeof __propDef.slots;
/** The Accordion child element. */
export default class AccordionItem extends SvelteComponentTyped<
	AccordionItemProps,
	AccordionItemEvents,
	AccordionItemSlots
> {}
export {};
