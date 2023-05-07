import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
	props: {
		[x: string]: any;
		/** Provide classes to style the stepper header gap.*/
		gap?: string | undefined;
		/** Provide the verbiage that represents "Step".*/
		stepTerm?: string | undefined;
		/** Provide classes to style the stepper header badges.*/
		badge?: string | undefined;
		/** Provide classes to style the stepper header active step badge.*/
		active?: string | undefined;
		/** Provide classes to style the stepper header border.*/
		border?: string | undefined;
		/** Provide the initially selected step*/
		start?: number | undefined;
		/** Set the justification for the step navigation buttons.*/
		justify?: string | undefined;
		/** Provide arbitrary classes to style the back button.*/
		buttonBack?: string | undefined;
		/** Set the type of the back button.*/
		buttonBackType?: 'button' | 'reset' | 'submit' | undefined;
		/** Provide the HTML label content for the back button.*/
		buttonBackLabel?: string | undefined;
		/** Provide arbitrary classes to style the next button.*/
		buttonNext?: string | undefined;
		/** Set the type of the next button.*/
		buttonNextType?: 'button' | 'reset' | 'submit' | undefined;
		/** Provide the HTML label content for the next button.*/
		buttonNextLabel?: string | undefined;
		/** Provide arbitrary classes to style the complete button.*/
		buttonComplete?: string | undefined;
		/** Set the type of the complete button.*/
		buttonCompleteType?: 'button' | 'reset' | 'submit' | undefined;
		/** Provide the HTML label content for the complete button.*/
		buttonCompleteLabel?: string | undefined;
		/** Provide arbitrary classes to the stepper header region.*/
		regionHeader?: string | undefined;
		/** Provide arbitrary classes to the stepper content region.*/
		regionContent?: string | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		default: {};
	};
};
export type StepperProps = typeof __propDef.props;
export type StepperEvents = typeof __propDef.events;
export type StepperSlots = typeof __propDef.slots;
export default class Stepper extends SvelteComponentTyped<StepperProps, StepperEvents, StepperSlots> {}
export {};
