import { toastStore } from '../../skeleton';
import type { ToastSettings } from '../../skeleton';

import { state } from '$lib/stores/status';

import type { ErrorType, Report, Result } from '$lib/common/types';

/**
 * Custom error for unexpected API responses.
 */
export class StatusError extends Error {
	status: number;
	statusText: string;

	/**
	 * Constructs a new StatusError.
	 *
	 * @param status - HTTP status code from server
	 * @param statusText HTTP status text from server
	 */
	constructor(status: number, statusText: string) {
		super(`${status} ${statusText}`);
		this.name = 'StatusError';
		this.status = status;
		this.statusText = statusText;
	}
}

/**
 * Custom error for invalid data responses from the API.
 *
 * API responds with `422 Unprocessable Entity` and a JSON body containing
 * validation messages if request data validation fails.
 */
export class UnprocessableEntityError extends StatusError {
	messages: Record<string, string>;

	/**
	 * Constructs a new UnprocessableEntityError.
	 *
	 * @param messages - the JSON response body
	 */
	constructor(messages: Record<string, string>) {
		super(422, 'Unprocessable Entity');
		this.name = 'UnprocessableEntityError';
		this.messages = messages;
	}
}

/**
 * Custom error for API connection errors.
 */
export class ConnectionError extends Error {
	constructor(message: string | undefined) {
		super(message);
		this.name = 'ConnectionError';
	}
}

export default {
	/**
	 * Fetches test run results from the API.
	 *
	 * Performs a GET request to `/api/results`.
	 *
	 * @returns A list of test run results.
	 *
	 * @throws {@link StatusError}
	 * Thrown if API responds with a non-2xx status.
	 *
	 * @throws {@link ConnectionError}
	 * Thrown if API is unresponsive.
	 */
	async results(): Promise<Result[] | null> {
		const resp = await performRequest(new Request('/api/results'));

		return resp.json().catch(() => ({}));
	},

	/**
	 * Fetches a coverage report for a test run from the API.
	 *
	 * Performs a GET request to `/api/results/:uuid/report`.
	 *
	 * @returns A coverage report for all files in a test.
	 *
	 * @throws {@link StatusError}
	 * Thrown if API responds with a non-2xx status.
	 *
	 * @throws {@link ConnectionError}
	 * Thrown if API is unresponsive.
	 */
	async report(uuid: string): Promise<Report> {
		const resp = await performRequest(new Request(`/api/results/${uuid}/report`));

		return resp.json().catch(() => ({}));
	},

	/**
	 * Instruct the backend to pause automatic test runs.
	 *
	 * Performs a PUT request to `/api/state/pause`.
	 *
	 * @throws {@link StatusError}
	 * Thrown if API responds with a non-2xx status.
	 *
	 * @throws {@link ConnectionError}
	 * Thrown if API is unresponsive.
	 */
	async pause() {
		const req = new Request('/api/state/pause', {
			method: 'PUT'
		});

		await performRequest(req);
	},

	/**
	 * Instruct the backend to resume automatic test runs.
	 *
	 * Performs a PUT request to `/api/state/resume`.
	 *
	 * @throws {@link StatusError}
	 * Thrown if API responds with a non-2xx status.
	 *
	 * @throws {@link ConnectionError}
	 * Thrown if API is unresponsive.
	 */
	async resume() {
		const req = new Request('/api/state/resume', {
			method: 'PUT'
		});

		await performRequest(req);
	},

	/**
	 * Instruct the backend to run tests for a Go package.
	 *
	 * Performs a POST request to `/api/run`.
	 *
	 * @param pkg - Go package target (e.g. `./...`)
	 *
	 * @throws {@link UnprocessableEntityError}
	 * Thrown if the Go package target is invalid.
	 *
	 * @throws {@link StatusError}
	 * Thrown if API responds with a non-2xx status.
	 *
	 * @throws {@link ConnectionError}
	 * Thrown if API is unresponsive.
	 */
	async run(pkg: string) {
		const req = new Request('/api/run', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ package: pkg })
		});

		await performRequest(req);
	},

	/**
	 * Clear all test run data on the server.
	 *
	 * @throws {@link StatusError}
	 * Thrown if API responds with a non-2xx status.
	 *
	 * @throws {@link ConnectionError}
	 * Thrown if API is unresponsive.
	 */
	async clearResults() {
		const req = new Request('/api/results', {
			method: 'DELETE'
		});

		await performRequest(req);
	}
};

export async function apiErrorHandler<T>(fn: () => Promise<T>): Promise<[ErrorType, T | undefined]> {
	try {
		const result = await fn();
		return [null, result];
	} catch (error) {
		if (error instanceof ConnectionError) {
			state.set('offline');
		} else if (error instanceof StatusError) {
			toastStore.trigger(<ToastSettings>{
				message: `Received bad response from API: ${error.message}`,
				background: 'variant-soft-error'
			});
		} else {
			toastStore.trigger(<ToastSettings>{
				message: `Unexpected error when fetching data from API: ${error}`,
				background: 'variant-soft-error'
			});
		}

		return [error, undefined];
	}
}

const performRequest = async (req: Request): Promise<Response> => {
	let resp: Response;

	try {
		resp = await fetch(req);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new ConnectionError(message);
	}

	if (!resp.ok) {
		if (resp.status == 422) {
			throw new UnprocessableEntityError(await resp.json().catch(() => ({})));
		}

		throw new StatusError(resp.status, resp.statusText);
	}

	return new Promise((resolve) => {
		resolve(resp);
	});
};
