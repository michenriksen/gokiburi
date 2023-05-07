import { describe, expect, it, vi } from 'vitest';
import { Autocomplete } from '../../index.ts';
import { render } from '@testing-library/svelte';
// keeping this as an array of `as const`s gives us autocompletion, and type safety
const options = [
	{ label: 'Vanilla', value: 'vanilla', keywords: 'plain, basic', meta: { healthy: false } },
	{ label: 'Chocolate', value: 'chocolate', keywords: 'dark, white', meta: { healthy: false } },
	{ label: 'Strawberry', value: 'strawberry', keywords: 'fruit', meta: { healthy: true } },
	{
		label: 'Neapolitan',
		value: 'neapolitan',
		keywords: 'mix, strawberry, chocolate, vanilla',
		meta: { healthy: false }
	},
	{ label: 'Pineapple', value: 'pineapple', keywords: 'fruit', meta: { healthy: true } },
	{ label: 'Peach', value: 'peach', keywords: 'fruit', meta: { healthy: true } }
];
// NB: be very careful picking options. Make sure none of the search terms match the keywords of unintended options.
describe('Autocomplete.svelte', () => {
	it('Shows all the options when no search term is provided', () => {
		const { getByText } = render(Autocomplete, { props: { options, input: '' } });
		options.forEach((option) => {
			expect(getByText(option.label)).toBeTruthy();
		});
	});
	it('Shows only the options that match the search term', () => {
		const matchingOptions = ['Neapolitan', 'Pineapple'];
		const notMatchingOptions = options.filter((option) => !matchingOptions.includes(option.label));
		const { getByText, queryByText } = render(Autocomplete, { props: { options, input: 'ne' } });
		matchingOptions.forEach((option) => {
			expect(getByText(option)).toBeTruthy();
		});
		notMatchingOptions.forEach((option) => {
			expect(queryByText(option.label)).toBeFalsy();
		});
	});
	it('Searches in keywords', () => {
		const matchingOptions = ['Strawberry', 'Peach', 'Pineapple'];
		const notMatchingOptions = options.filter((option) => !matchingOptions.includes(option.label));
		const { getByText, queryByText } = render(Autocomplete, { props: { options, input: 'fruit' } });
		matchingOptions.forEach((option) => {
			expect(getByText(option)).toBeTruthy();
		});
		notMatchingOptions.forEach((option) => {
			expect(queryByText(option.label)).toBeFalsy();
		});
	});
	it('Shows a message when no options match the search term', () => {
		const { getByText, rerender } = render(Autocomplete, { props: { options, input: 'nonexistent' } });
		expect(getByText('No Results Found.')).toBeTruthy();
		// ensures custom message is set
		rerender({ options, input: 'nonexistent', emptyState: 'custom message' });
		expect(getByText('custom message')).toBeTruthy();
	});
	it('Fires the selection event when an option is selected', () => {
		let selectedOption;
		const selectionHandler = vi.fn((e) => (selectedOption = e.detail));
		const { getByText, component } = render(Autocomplete, {
			props: { options, input: 'ne' }
		});
		component.$on('selection', selectionHandler);
		getByText('Neapolitan').click();
		expect(selectionHandler).toHaveBeenCalled();
		expect(selectedOption).toEqual(options.find((o) => o.label === 'Neapolitan'));
	});
	describe('whitelist', () => {
		it('only shows items in the whitelist when no search term is present', () => {
			// doesn't include 'pineapple'
			const whitelist = ['neapolitan', 'chocolate', 'peach', 'strawberry', 'vanilla'];
			const { getByText, queryByText } = render(Autocomplete, { props: { options, input: '', whitelist } });
			options.forEach((option) => {
				if (!whitelist.includes(option.value)) {
					expect(queryByText(option.label)).toBeFalsy();
				} else {
					expect(getByText(option.label)).toBeTruthy();
				}
			});
		});
		it('only shows items in the whitelist when searching', () => {
			// doesn't include 'pineapple'
			const whitelist = ['neapolitan', 'chocolate', 'peach', 'strawberry', 'vanilla'];
			const { getByText, queryByText } = render(Autocomplete, { props: { options, input: 'ne', whitelist } });
			const matchingOptions = ['Neapolitan'];
			const notMatchingOptions = options.filter((option) => !matchingOptions.includes(option.label));
			matchingOptions.forEach((option) => {
				expect(getByText(option)).toBeTruthy();
			});
			notMatchingOptions.forEach((option) => {
				expect(queryByText(option.label)).toBeFalsy();
			});
		});
		it('shows the empty message if the only matching elements are not in the whitelist', () => {
			const whitelist = ['neapolitan', 'chocolate', 'peach', 'strawberry', 'vanilla'];
			const { queryByText } = render(Autocomplete, { props: { options, input: 'pineapple', whitelist } });
			expect(queryByText('No Results Found.')).toBeTruthy();
		});
	});
	describe('blacklist', () => {
		it('does not show items in the blacklist when no search term is present', () => {
			const blacklist = ['pineapple'];
			const { getByText, queryByText } = render(Autocomplete, { props: { options, input: '', blacklist } });
			options.forEach((option) => {
				if (blacklist.includes(option.value)) {
					expect(queryByText(option.label)).toBeFalsy();
				} else {
					expect(getByText(option.label)).toBeTruthy();
				}
			});
		});
		it('does not show items in the blacklist when searching', () => {
			const blacklist = ['pineapple'];
			const { getByText, queryByText } = render(Autocomplete, { props: { options, input: 'ne', blacklist } });
			const matchingOptions = ['Neapolitan'];
			const notMatchingOptions = options.filter((option) => !matchingOptions.includes(option.label));
			matchingOptions.forEach((option) => {
				expect(getByText(option)).toBeTruthy();
			});
			notMatchingOptions.forEach((option) => {
				expect(queryByText(option.label)).toBeFalsy();
			});
		});
		it('shows the empty message if the only matching options are in the blacklist', () => {
			const blacklist = ['pineapple'];
			const { queryByText } = render(Autocomplete, { props: { options, input: 'pineapple', blacklist } });
			expect(queryByText('No Results Found.')).toBeTruthy();
		});
	});
});
