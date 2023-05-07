type Direction = 'top' | 'bottom' | 'left' | 'right';
/** Placement https://floating-ui.com/docs/computePosition#placement */
type Placement = Direction | `${Direction}-start` | `${Direction}-end`;
interface Middleware {
	/** Offset options: https://floating-ui.com/docs/offset */
	offset?: number | Record<string, any>;
	/** Shift options: https://floating-ui.com/docs/shift */
	shift?: Record<string, any>;
	/** Flip options: https://floating-ui.com/docs/flip */
	flip?: Record<string, any>;
	/** Arrow options: https://floating-ui.com/docs/arrow */
	arrow?: {
		element: string;
	} & Record<string, any>;
}
export interface PopupSettings {
	/** Provide the event type. */
	event: 'click' | 'hover' | 'hover-click' | 'focus' | 'focus-click';
	/** Match the popup data value `[data-popup]="targetNameHere"` */
	target: string;
	/** Set the placement position. Defaults 'bottom'. */
	placement?: Placement;
	/** Query list of elements that will close the popup. Default: `'a[href], button'`. */
	closeQuery?: string;
	/** Provide additional options and middleware settings. */
	middleware?: Middleware;
	/** Provide an optional callback function to monitor open/close state. */
	state?: (event: { state: boolean }) => void;
}
export {};
