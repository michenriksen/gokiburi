import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Set the toast position.*/
		position?: string | undefined;
		/** Maximum toasts that can show at once.*/
		max?: number | undefined;
		/** The duration of the fly in/out animation.*/
		duration?: number | undefined;
		/** Provide classes to set the background color.*/
		background?: string | undefined;
		/** Provide classes to set width styles.*/
		width?: string | undefined;
		/** Provide classes to set the text color.*/
		color?: string | undefined;
		/** Provide classes to set the padding.*/
		padding?: string | undefined;
		/** Provide classes to set toast horizontal spacing.*/
		spacing?: string | undefined;
		/** Provide classes to set the border radius styles.*/
		rounded?: string | undefined;
		/** Provide classes to set the border box shadow.*/
		shadow?: string | undefined;
		/** Provide a class to override the z-index*/
		zIndex?: string | undefined;
		/** Provide styles for the action button.*/
		buttonAction?: string | undefined;
		/** Provide styles for the dismiss button.*/
		buttonDismiss?: string | undefined;
		/** The button label text.*/
		buttonDismissLabel?: string | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type ToastProps = typeof __propDef.props;
export type ToastEvents = typeof __propDef.events;
export type ToastSlots = typeof __propDef.slots;
export default class Toast extends SvelteComponentTyped<ToastProps, ToastEvents, ToastSlots> {}
export {};
