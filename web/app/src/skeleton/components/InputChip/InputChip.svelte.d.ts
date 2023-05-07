import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Bind the input value.*/
		input?: string | undefined;
		/** Set a unique select input name.*/
		name: string;
		/** An array of values.*/
		value?: any[] | undefined;
		/** Provide a whitelist of accepted values.*/
		whitelist?: string[] | undefined;
		/** Maximum number of chips. Set -1 to disable.*/
		max?: number | undefined;
		/** Set the minimum character length.*/
		minlength?: number | undefined;
		/** Set the maximum character length.*/
		maxlength?: number | undefined;
		/** When enabled, allows for uppercase values.*/
		allowUpperCase?: boolean | undefined;
		/** When enabled, allows for duplicate values.*/
		allowDuplicates?: boolean | undefined;
		/** Provide a custom validator function.*/
		validation?: ((...args: any[]) => boolean) | undefined;
		/** The duration of the animated fly effect.*/
		duration?: number | undefined;
		/** Set the required state for this input field.*/
		required?: boolean | undefined;
		/** Provide classes or a variant to style the chips.*/
		chips?: string | undefined;
		/** {{ event: Event, input: any  }} invalid - Fires when the input value is invalid.*/
		invalid?: string | undefined;
		/** Provide classes to set padding styles.*/
		padding?: string | undefined;
		/** Provide classes to set border radius styles.*/
		rounded?: string | undefined;
	};
	events: {
		/** Bind the input value.*/
		input: Event;
		click: MouseEvent;
		keypress: KeyboardEvent;
		keydown: KeyboardEvent;
		keyup: KeyboardEvent;
	} & {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type InputChipProps = typeof __propDef.props;
export type InputChipEvents = typeof __propDef.events;
export type InputChipSlots = typeof __propDef.slots;
export default class InputChip extends SvelteComponentTyped<InputChipProps, InputChipEvents, InputChipSlots> {}
export {};
