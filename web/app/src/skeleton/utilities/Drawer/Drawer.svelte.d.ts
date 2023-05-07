import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Set the anchor position.*/
		position?: 'left' | 'top' | 'right' | 'bottom' | undefined;
		/** Define the Svelte transition animation duration.*/
		duration?: number | undefined;
		/** Backdrop - Provide classes to set the backdrop background color*/
		bgBackdrop?: string | undefined;
		/** Backdrop - Provide classes to set the blur style.*/
		blur?: string | undefined;
		/** Drawer - Provide classes to set padding.*/
		padding?: string | undefined;
		/** Drawer - Provide classes to set the drawer background color.*/
		bgDrawer?: string | undefined;
		/** Drawer - Provide classes to set border color.*/
		border?: string | undefined;
		/** Drawer - Provide classes to set border radius.*/
		rounded?: string | undefined;
		/** Drawer - Provide classes to set the box shadow.*/
		shadow?: string | undefined;
		/** Drawer - Provide classes to override the width.*/
		width?: string | undefined;
		/** Drawer - Provide classes to override the height.*/
		height?: string | undefined;
		/** Provide a class to override the z-index*/
		zIndex?: string | undefined;
		/** Provide arbitrary classes to the backdrop region.*/
		regionBackdrop?: string | undefined;
		/** Provide arbitrary classes to the drawer region.*/
		regionDrawer?: string | undefined;
		/** Provide an ID of the element labeling the drawer.*/
		labelledby?: string | undefined;
		/** Provide an ID of the element describing the drawer.*/
		describedby?: string | undefined;
	};
	events: {
		keypress: KeyboardEvent;
		/** {{ event }} backdrop - Fires on backdrop interaction.*/
		backdrop: CustomEvent<any>;
	} & {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		default: {};
	};
};
export type DrawerProps = typeof __propDef.props;
export type DrawerEvents = typeof __propDef.events;
export type DrawerSlots = typeof __propDef.slots;
export default class Drawer extends SvelteComponentTyped<DrawerProps, DrawerEvents, DrawerSlots> {}
export {};
