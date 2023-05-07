import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Initials only - Provide up to two text characters.*/
		initials?: string | undefined;
		/** Initials only - Provide classes to set the SVG text fill color.*/
		fill?: string | undefined;
		/** Provide the avatar image element source.*/
		src?: string | undefined;
		/** Image only. Provide an Svelte action reference, such as `filter`.*/
		action?: any;
		/** Image only. Provide Svelte action params, such as Apollo.*/
		actionParams?: string | undefined;
		/** Provide classes to set background styles.*/
		background?: string | undefined;
		/** Provide classes to set avatar width.*/
		width?: string | undefined;
		/** Provide classes to set border styles.*/
		border?: string | undefined;
		/** Provide classes to set rounded style.*/
		rounded?: string | undefined;
		/** Provide classes to set shadow styles.*/
		shadow?: string | undefined;
		/** Provide classes to set cursor styles.*/
		cursor?: string | undefined;
	};
	events: {
		click: MouseEvent;
		keydown: KeyboardEvent;
		keyup: KeyboardEvent;
		keypress: KeyboardEvent;
	} & {
		[evt: string]: CustomEvent<any>;
	};
	slots: {};
};
export type AvatarProps = typeof __propDef.props;
export type AvatarEvents = typeof __propDef.events;
export type AvatarSlots = typeof __propDef.slots;
export default class Avatar extends SvelteComponentTyped<AvatarProps, AvatarEvents, AvatarSlots> {}
export {};
