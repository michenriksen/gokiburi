import { escapeHtml } from '$lib/common/utils';
import type { Profile, ProfileBoundary } from '$lib/common/types';

/**
 * Render a code coverage profile for a file as safe HTML.
 *
 * Renders the file's content with code coverage blocks wrapped in `span`
 * tags like so:
 *
 *     <span class="gokiburi-cov-8" data-cov-level="8" data-cov-count="6">...</span>
 *
 * The number in the `gokiburi-cov-*` class will be between 0 and 10 and describes
 * the level of relative coverage, where 0 means no coverage and 10 means the
 * highest coverage. The level will also be available in the `data-cov-level`
 * attribute.
 *
 * The value in the `data-cov-count` is the number of times the wrapped code
 * block was invoked in tests.
 *
 * All special HTML characters will be escaped, except for the safe code block
 * coverage tags.
 */
export function renderProfile(profile: Profile): string {
	// Decode Base64 encoded file content from profile.
	const content = window.atob(profile.content);

	// Sort the profile boundaries by index in ascending order.
	const sortedBoundaries = profile.boundaries.sort((a: ProfileBoundary, b: ProfileBoundary): number => {
		return a.index - b.index;
	});

	// Initialize result array.
	const result: string[] = [];
	let offset = 0;

	// Iterate through boundaries and create result array.
	for (const boundary of sortedBoundaries) {
		// Add escaped content between current offset and boundary offset.
		result.push(escapeHtml(content.slice(offset, boundary.offset)));

		if (boundary.start) {
			const level = normLevel(boundary.count, boundary.norm);
			// Add opening span tag.
			result.push(
				`<span class="gokiburi-cov gokiburi-cov-${level}" data-cov-level="${level}" data-cov-count="${boundary.count}">`
			);
		} else {
			// Add closing span tag.
			result.push('</span>');
		}

		// Update the offset.
		offset = boundary.offset;
	}

	// Add remaining content.
	result.push(escapeHtml(content.slice(offset)));

	// Join the result array into a single string.
	return result.join('');
}

/**
 * Converts a profile block norm float value to number between 0 - 10 as a string.
 */
function normLevel(count: number, norm: number): string {
	if (count === 0) {
		return '0';
	}

	const level = Math.floor(norm * 9) + 1;
	return level > 10 ? '10' : level.toString();
}
