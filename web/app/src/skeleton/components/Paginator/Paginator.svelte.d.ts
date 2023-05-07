import { SvelteComponentTyped } from 'svelte';
import type { PaginationSettings } from './types';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Pass the page setting object.*/
		settings?: PaginationSettings | undefined;
		/** Sets selection and buttons to disabled state on-demand.*/
		disabled?: boolean | undefined;
		/** Provide classes to style the select input.*/
		select?: string | undefined;
		/** Provide classes to set flexbox justification.*/
		justify?: string | undefined;
		/** Provide classes to style page info text.*/
		text?: string | undefined;
		/** Set the text for the amount selection input.*/
		amountText?: string | undefined;
		/** Provide arbitrary classes to the next/previous buttons.*/
		buttonClasses?: string | undefined;
		/** Set the text label for the Previous button.*/
		buttonTextPrevious?: string | undefined;
		/** Set the text label for the Next button.*/
		buttonTextNext?: string | undefined;
	};
	events: {
		/** {{ length: number }} amount - Fires when the amount selection input changes.*/
		amount: CustomEvent<any>;
		/** {{ offset: number }} page Fires when the next/back buttons are pressed.*/
		page: CustomEvent<any>;
	} & {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type PaginatorProps = typeof __propDef.props;
export type PaginatorEvents = typeof __propDef.events;
export type PaginatorSlots = typeof __propDef.slots;
export default class Paginator extends SvelteComponentTyped<PaginatorProps, PaginatorEvents, PaginatorSlots> {}
export {};
