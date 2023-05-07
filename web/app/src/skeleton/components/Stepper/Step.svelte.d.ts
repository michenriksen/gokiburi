import { SvelteComponentTyped } from 'svelte';
import type { Writable } from 'svelte/store';
declare const __propDef: {
	props: {
		[x: string]: any;
		locked?: boolean | undefined;
		/** Provide arbitrary classes to the step header region.*/
		regionHeader?: string | undefined;
		/** Provide arbitrary classes to the step content region.*/
		regionContent?: string | undefined;
		/** Provide arbitrary classes to the step navigation region.*/
		regionNavigation?: string | undefined;
		state?: Writable<any> | undefined;
		dispatchParent?: any;
		stepTerm?: string | undefined;
		gap?: string | undefined;
		justify?: string | undefined;
		buttonBack?: string | undefined;
		buttonBackType?: 'button' | 'reset' | 'submit' | undefined;
		buttonBackLabel?: string | undefined;
		buttonNext?: string | undefined;
		buttonNextType?: 'button' | 'reset' | 'submit' | undefined;
		buttonNextLabel?: string | undefined;
		buttonComplete?: string | undefined;
		buttonCompleteType?: 'button' | 'reset' | 'submit' | undefined;
		buttonCompleteLabel?: string | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		header: {};
		default: {};
	};
};
export type StepProps = typeof __propDef.props;
export type StepEvents = typeof __propDef.events;
export type StepSlots = typeof __propDef.slots;
export default class Step extends SvelteComponentTyped<StepProps, StepEvents, StepSlots> {}
export {};
