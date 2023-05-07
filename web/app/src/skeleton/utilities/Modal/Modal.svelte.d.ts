import { SvelteComponentTyped } from 'svelte';
import type { ModalComponent } from './types';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Set the modal position within the backdrop container*/
		position?: string | undefined;
		/** Register a list of reusable component modals.*/
		components?: Record<string, ModalComponent> | undefined;
		/** The open/close animation duration. Set '0' (zero) to disable.*/
		duration?: number | undefined;
		/** Set the fly transition opacity.*/
		flyOpacity?: number | undefined;
		/** Set the fly transition X axis value.*/
		flyX?: number | undefined;
		/** Set the fly transition Y axis value.*/
		flyY?: number | undefined;
		/** Provide classes to style the modal background.*/
		background?: string | undefined;
		/** Provide classes to style the modal width.*/
		width?: string | undefined;
		/** Provide classes to style the modal height.*/
		height?: string | undefined;
		/** Provide classes to style the modal padding.*/
		padding?: string | undefined;
		/** Provide classes to style the modal spacing.*/
		spacing?: string | undefined;
		/** Provide classes to style the modal border radius.*/
		rounded?: string | undefined;
		/** Provide classes to style modal box shadow.*/
		shadow?: string | undefined;
		/** Provide a class to override the z-index*/
		zIndex?: string | undefined;
		/** Provide classes for neutral buttons, such as Cancel.*/
		buttonNeutral?: string | undefined;
		/** Provide classes for positive actions, such as Confirm or Submit.*/
		buttonPositive?: string | undefined;
		/** Override the text for the Cancel button.*/
		buttonTextCancel?: string | undefined;
		/** Override the text for the Confirm button.*/
		buttonTextConfirm?: string | undefined;
		/** Override the text for the Submit button.*/
		buttonTextSubmit?: string | undefined;
		/** Provide classes to style the backdrop.*/
		regionBackdrop?: string | undefined;
		/** Provide arbitrary classes to modal header region.*/
		regionHeader?: string | undefined;
		/** Provide arbitrary classes to modal body region.*/
		regionBody?: string | undefined;
		/** Provide arbitrary classes to modal footer region.*/
		regionFooter?: string | undefined;
	};
	events: {
		/** {{ event }} backdrop - Fires on backdrop interaction.*/
		backdrop: CustomEvent<any>;
	} & {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type ModalProps = typeof __propDef.props;
export type ModalEvents = typeof __propDef.events;
export type ModalSlots = typeof __propDef.slots;
export default class Modal extends SvelteComponentTyped<ModalProps, ModalEvents, ModalSlots> {}
export {};
