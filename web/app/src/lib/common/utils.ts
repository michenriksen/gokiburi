import { get } from 'svelte/store';

import { metadata } from '$lib/stores/metadata';

import type { Timestamped } from '$lib/common/types';

const meta = get(metadata);

/**
 * Pattern for matching characters that need
 * escaping in a HTML context.
 */
const unsafeHtmlCharRegexp = /[&<>"'/]/g;

/**
 * Special HTML characters mapped to their
 * HTML entities.
 */
const entityMap: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;'
};

/**
 * Format nanoseconds to a human readable duration.
 *
 * @param nanoseconds - Duration in nanoseconds.
 *
 * @returns A human-readable string representation of duration like `1m32s`.
 *
 * @throws Error if given a negative number.
 */
export function formatDuration(nanoseconds: number): string {
	if (nanoseconds < 0) {
		throw new Error('duration must be a positive number');
	}

	const timeUnits = [
		{ unit: 'h', value: 60 * 60 * 1000 * 1000 * 1000 },
		{ unit: 'm', value: 60 * 1000 * 1000 * 1000 },
		{ unit: 's', value: 1000 * 1000 * 1000 },
		{ unit: 'ms', value: 1000 * 1000 }
	];

	let result = '';

	for (const { unit, value } of timeUnits) {
		if (nanoseconds >= value) {
			const count = Math.floor(nanoseconds / value);
			nanoseconds %= value;
			result += `${count}${unit}`;
		}
	}

	if (!result) {
		result = '0ms';
	}

	return result;
}

/**
 * Pluralize a word with number.
 *
 * Pluralizes a word correctly depending on the number given.
 *
 * @param num - A number of something.
 * @param singular - Word in its singular form.
 * @param plural - Word in its plural form.
 *
 * @returns A string consisting of number followed by the singular
 * or plural word, like `0 bugs`, `1 feature`, `4 files`.
 */
export function pluralize(num: number, singular: string, plural: string): string {
	let word = plural;

	if (num === 1) {
		word = singular;
	}

	return num + ' ' + word;
}

/**
 * Escape special HTML characters in a string.
 *
 * Makes an unsafe string safe to render directly in HTML by escaping
 * special characters to their HTML entities.
 *
 * @param unsafe - Untrusted string.
 *
 * @returns A safe string with special HTML characters like `<`, `>`, `"`, etc.
 * converted to their HTML entities.
 */
export function escapeHtml(unsafe: string): string {
	return unsafe.replace(unsafeHtmlCharRegexp, (s: string) => {
		return entityMap[s];
	});
}

/**
 * Escape special characters in a string for use in a RegExp.
 *
 * Makes an unsafe string safe to use in a RegExp by escaping special
 * characters.
 *
 * @param unsafe - Untrusted string.
 *
 * @returns A safe string with special RegExp characters like `*`, `+`, `?`,
 * etc. converted to their escaped form.
 */
export function escapeRegExp(unsafe: string): string {
	return unsafe.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string.
}

/**
 * Sort array of timestamped objects by time in descending order.
 *
 * Can be given to `Array.sort` as the sorter function.
 *
 * @param a - Object with a `time` field.
 * @param b - Object with a `time` field.
 *
 * @returns
 * -1 if a.time is older than b.time, 1 if a.time is earlier than
 * b.time, and 0 if times are equal.
 */
export function sortByTime(a: Timestamped, b: Timestamped): number {
	if (a.time < b.time) {
		return -1;
	} else if (a.time > b.time) {
		return 1;
	} else {
		return 0;
	}
}

/**
 * Format bytes as human-readable text.
 *
 * @remarks Adapted from {@link https://stackoverflow.com/a/14919494}.
 *
 * @param bytes - Number of bytes.
 * @param si - True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp - Number of decimal places to display.
 *
 * @returns Formatted string.
 */
export function formatBytes(bytes: number, si = false, dp = 1): string {
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}

	const units = si
		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10 ** dp;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

	return bytes.toFixed(dp) + ' ' + units[u];
}

/**
 * Truncate a file path with an ellipsis in the middle if its length exceeds a
 * specified maximum, ensuring that the base filename is never truncated.
 *
 * @param path - The file path to be truncated.
 * @param maxLength - The maximum allowed length for the truncated file path.
 *
 * @returns
 * Truncated file path with an ellipsis in the middle if the input length
 * exceeds maxLength, or the original file path if it doesn't exceed maxLength
 * or if the base filename's length is equal to or greater than maxLength.
 */
export function truncateFilepath(path: string, maxLength: number): string {
	const lastSlashIndex = path.lastIndexOf('/');
	const dirname = path.slice(0, lastSlashIndex);
	const basename = path.slice(lastSlashIndex + 1);

	if (path.length <= maxLength || basename.length >= maxLength) {
		return path;
	}

	const remainingLength = maxLength - basename.length - 1; // Subtract 1 for the ellipsis character
	const halfRemainingLength = remainingLength / 2;
	const start = dirname.slice(0, Math.ceil(halfRemainingLength));
	const end = dirname.slice(-Math.floor(halfRemainingLength));

	return `${start}…${end}/${basename}`;
}

/**
 * Build a query string from key-value pairs.
 *
 * @param params - Key-value pairs to be encoded as a query string.
 *
 * @returns A query string, like `foo=bar&baz=qux`.
 */
export function buildQueryString(params: { [key: string]: string | number | boolean }): string {
	const searchParams = new URLSearchParams();

	for (const key in params) {
		if (Object.prototype.hasOwnProperty.call(params, key)) {
			searchParams.append(key, params[key].toString());
		}
	}

	return searchParams.toString();
}

/**
 * Debounce a function by the specified wait time.
 *
 * @param func - Function to debounce.
 * @param wait - Milliseconds to wait before invoking the function.
 *
 * @returns A debounced version of the given function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func(...args);
			timeoutId = null;
		}, wait);
	};
}

/**
 * Sleep for the specified duration.
 *
 * @param duration - Milliseconds to sleep.
 * @returns A promise that resolves after the specified duration.
 */
export function sleep(duration: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
}

/**
 * Set the page title.
 *
 * @param title - Page title.
 */
export function setPageTitle(title: string): void {
	document.title = `${title} | ${meta.appName}`;
}
