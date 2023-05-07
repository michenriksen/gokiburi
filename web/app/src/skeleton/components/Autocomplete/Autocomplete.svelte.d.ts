import { SvelteComponentTyped } from 'svelte';
import type { AutocompleteOption } from './types';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Bind the input value.*/
		input?: unknown;
		/** Define values for the list*/
		options?: AutocompleteOption[] | undefined;
		/** Provide allowlist values*/
		allowlist?: unknown[] | undefined;
		/** Provide denylist values*/
		denylist?: unknown[] | undefined;
		/** Provide a HTML markup to display when no match is found.*/
		emptyState?: string | undefined;
		/** Provide arbitrary classes to nav element.*/
		regionNav?: string | undefined;
		/** Provide arbitrary classes to each list.*/
		regionList?: string | undefined;
		/** Provide arbitrary classes to each list item.*/
		regionItem?: string | undefined;
		/** Provide arbitrary classes to each button.*/
		regionButton?: string | undefined;
		/** Provide arbitrary classes to empty message.*/
		regionEmpty?: string | undefined;
		/** DEPRECATED: replace with allowlist*/
		whitelist?: unknown[] | undefined;
		/** DEPRECATED: replace with denylist*/
		blacklist?: unknown[] | undefined;
		/** DEPRECATED: Set the animation duration. Use zero to disable.*/
		duration?: number | undefined;
	};
	events: {
		click: MouseEvent;
		keypress: KeyboardEvent;
		/** {AutocompleteOption} selection - Fire on option select.*/
		selection: CustomEvent<any>;
	} & {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type AutocompleteProps = typeof __propDef.props;
export type AutocompleteEvents = typeof __propDef.events;
export type AutocompleteSlots = typeof __propDef.slots;
export default class Autocomplete extends SvelteComponentTyped<
	AutocompleteProps,
	AutocompleteEvents,
	AutocompleteSlots
> {}
export {};
