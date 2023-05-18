/**
 * Represents the result of a single Go test.
 */
export interface Test {
	time: string;
	name: string;
	package: string;
	pass: boolean;
	skip: boolean;
	elapsed: number; // Seconds.
	output: string;
}

/**
 * Represents the test results of a Go package.
 */
export interface Package {
	time: string;
	name: string;
	pass: boolean;
	passed: number;
	skipped: number;
	failed: number;
	coverage: number;
	elapsed: number; // Seconds.
	tests: Test[];
}

/**
 * Represents the test results of one or more Go packages.
 */
export interface Result {
	uuid: string;
	error: string;
	pass: boolean;
	start: string;
	duration: number;
	exitCode: number;
	output: string;
	targets: string[];
	passed: number;
	failed: number;
	skipped: number;
	tests: number;
	packages: Package[] | null;
}

/**
 * Represents the position in a source file of the beginning and
 * end of a block as reported by the coverage profile.
 */
export interface ProfileBoundary {
	offset: number;
	start: boolean;
	count: number;
	norm: number;
	index: number;
}

/**
 * Represents a profile of a single file in a coverage report.
 */
export interface Profile {
	filename: string;
	package: string;
	path: string;
	content: string;
	size: number;
	coverage: number;
	lineCount: number;
	boundaries: ProfileBoundary[];
}

/**
 * Represents a coverage report for a test run.
 */
export interface Report {
	mode: CoverageMode;
	profiles: Profile[];
	time: string;
}

/*
 * Coverage modes supported by Go.
 */
type CoverageMode = 'set' | 'count' | 'atomic';

/**
 * States the application can be in:
 *
 * - init:    Initializing components.
 * - ready:   Ready and waiting to run tests.
 * - paused:  Automatic test runs is paused.
 * - running: Test run is in progress.
 * - closing: Shutting down.
 * - offline: Backend API is unresponsive.
 */
export type State = 'init' | 'ready' | 'paused' | 'running' | 'closing' | 'offline';

/**
 * Notification emitted by the backend in the status response.
 */
export interface ServerNotification {
	type: NotificationType;
	body: string;
	tag: string;
}

/**
 * Response from the `GET /api/status` API endpoint.
 */
export interface Status {
	state: State;
	lastResult?: Result;
	root?: string;
	notification?: ServerNotification;
}

/**
 * WebSocket message kinds.
 */
export type WSMessageKind =
	| 'keepalive' // Dummy message to keep connection alive.
	| 'init' // initial message with UI initialization data.
	| 'state' // Server state change.
	| 'result' // New test result.
	| 'resultError' // New test result with error.
	| 'resultEmpty' // New test result with no tests.
	| 'notification' // Server notification.
	| 'connectionClosed'; // Connection closed by server.

/**
 * WebSocket message.
 */
export interface WSMessage {
	kind: WSMessageKind;
	data?: unknown;
}

/**
 * Metadata about the application.
 */
export interface Metadata {
	appName: string;
	version: string;
	isDevVersion: boolean;
	environment: string;
	projectUrl: string;
	issuesUrl: string;
}

/**
 * Possible values for browser notifications setting.
 *
 * - pass:  Browser notification when tests pass.
 * - fail:  Browser notification when tests fail.
 * - error: Browser notification when tests encounter errors.
 * - all:   Browser notification on all events.
 *
 * Error notifications will always be emitted.
 */
export type NotifyOnSetting = 'pass' | 'fail' | 'error' | 'all';

/**
 * Possible values for sound notifications setting.
 *
 * - pass:  Sound when tests pass.
 * - fail:  Sound when tests fail.
 * - error: Sound when tests encounter errors.
 * - all:   Sound on all events.
 *
 * Sound notifications will always be emitted on error.
 */
export type AudioNotifyOnSetting = 'pass' | 'fail' | 'error' | 'all';

/**
 * Possible values for code coverage theme.
 *
 * white-to-green: scale from white to green and red for no coverage.
 * white-to-blue: scale from white to blue and yellow for no coverage (color blind friendly).
 * heatmap: scale from white to berry red and blue for no coverage.
 */
export type CoverageThemeSetting = 'white-to-green' | 'white-to-blue' | 'heatmap';

/**
 * Possible browser notification types.
 *
 * - pass:    adds a green check mark icon to the notification.
 * - fail:    adds a red cross icon to the notification.
 * - error:   adds a red exclamation mark icon to the notification.
 * - warning: adds a yellow exclamation mark icon to the notification.
 * - info:    adds a neutral information icon to the notification.
 */
export type NotificationType = 'pass' | 'fail' | 'error' | 'warning' | 'info';

/**
 * Represents any object containing a `time` field expected to contain a
 * parsable timestamp.
 *
 *  Used for generic sorting functions, etc.
 */
export interface Timestamped {
	time: string;
}

/**
 * Possible filter options for package status.
 */
export type FilterPackageStatus = 'passing' | 'failing' | 'noTests';

/**
 * Possible filter options for test status.
 */
export type FilterTestStatus = 'passing' | 'failing' | 'skipped';

/**
 * Possible filter options for coverage level.
 */
export type FilterCoverageLevel = 'high' | 'medium' | 'low' | 'none';

/**
 * Settings for filtering a {@link Result}.
 */
export type FilterSettings = {
	search: string;
	packageStatus: FilterPackageStatus[];
	testStatus: FilterTestStatus[];
	coverage: FilterCoverageLevel[];
};

export type ErrorType = Error | null | undefined | unknown;

export type Placement =
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'right'
	| 'right-start'
	| 'right-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'left-start'
	| 'left-end';

export type DebounceFn = <T extends (...args: Args) => unknown, Args extends unknown[]>(
	fn: T,
	delay: number
) => (...args: Args) => void;
