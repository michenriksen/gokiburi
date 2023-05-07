import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Enable selection of multiple items.*/
		multiple?: boolean | undefined;
		/** Provide class to set the vertical spacing style.*/
		spacing?: string | undefined;
		/** Provide classes to set the listbox box radius styles.*/
		rounded?: string | undefined;
		/** Provide classes to set the listbox item active background styles.*/
		active?: string | undefined;
		/** Provide classes to set the listbox item hover background styles.*/
		hover?: string | undefined;
		/** Provide classes to set the listbox item padding styles.*/
		padding?: string | undefined;
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
export type ListBoxProps = typeof __propDef.props;
export type ListBoxEvents = typeof __propDef.events;
export type ListBoxSlots = typeof __propDef.slots;
export default class ListBox extends SvelteComponentTyped<ListBoxProps, ListBoxEvents, ListBoxSlots> {}
export {};
