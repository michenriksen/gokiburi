import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Query selector for the scrollable page element.*/
		scrollParent?: string | undefined;
		/** Query selector for the element to scan for headings.*/
		target?: string | undefined;
		/** Query selector for the allowed headings. From H2-H6.*/
		allowedHeadings?: string | undefined;
		/** Set the label text.*/
		label?: string | undefined;
		/** Set the component width style.*/
		width?: string | undefined;
		/** Set the vertical spacing styles.*/
		spacing?: string | undefined;
		/** Set the row text color styles.*/
		text?: string | undefined;
		/** Set the row hover styles.*/
		hover?: string | undefined;
		/** Set the active row styles*/
		active?: string | undefined;
		/** Set the row border radius styles.*/
		rounded?: string | undefined;
		/** Provide arbitrary styles for the label element.*/
		regionLabel?: string | undefined;
		/** Provide arbitrary styles for the list element.*/
		regionList?: string | undefined;
	};
	events: {
		click: MouseEvent;
		keypress: KeyboardEvent;
	} & {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type TableOfContentsProps = typeof __propDef.props;
export type TableOfContentsEvents = typeof __propDef.events;
export type TableOfContentsSlots = typeof __propDef.slots;
/** Allows you to quickly navigate the hierarchy of headings for the current page. */
export default class TableOfContents extends SvelteComponentTyped<
	TableOfContentsProps,
	TableOfContentsEvents,
	TableOfContentsSlots
> {}
export {};
