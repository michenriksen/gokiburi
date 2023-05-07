import { render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import ResultListBoxItem from '$lib/components/ResultListBoxItem.svelte';

const startTime = '2023-01-01T13:37:00.511Z';

describe('ResultListBoxItem', () => {
	describe('when given a passing result', () => {
		it('renders as success variant', () => {
			const { getByRole } = render(ResultListBoxItem, {
				props: { result: { uuid: 'deadbeef', pass: true, start: startTime }, group: 'beefdead' }
			});

			expect(getByRole('option')).toHaveClass('variant-soft-success');
		});

		it('displays result relative time', () => {
			vi.setSystemTime('2023-01-01T11:37:00.511Z');

			const { getByRole } = render(ResultListBoxItem, {
				props: { result: { uuid: 'deadbeef', pass: true, start: startTime }, group: 'beefdead' }
			});

			expect(getByRole('option')).toHaveTextContent('2 hours');
		});

		it('displays number of passing and total tests', () => {
			const { getByRole } = render(ResultListBoxItem, {
				props: { result: { uuid: 'deadbeef', pass: true, start: startTime, passed: 13, tests: 37 }, group: 'beefdead' }
			});

			expect(getByRole('option')).toHaveTextContent('13/37');
		});

		describe('when selected', () => {
			it('renders as bordered success variant', () => {
				const { getByRole } = render(ResultListBoxItem, {
					props: { result: { uuid: 'deadbeef', pass: true, start: startTime }, group: 'deadbeef' }
				});

				expect(getByRole('option')).toHaveClass('variant-ghost-success');
			});
		});
	});

	describe('when given failed result', () => {
		it('renders as error variant', () => {
			const { getByRole } = render(ResultListBoxItem, {
				props: { result: { uuid: 'deadbeef', pass: false, start: startTime }, group: 'beefdead' }
			});

			expect(getByRole('option')).toHaveClass('variant-soft-error');
		});

		it('displays result relative time', () => {
			vi.setSystemTime('2023-01-01T11:37:00.511Z');

			const { getByRole } = render(ResultListBoxItem, {
				props: { result: { uuid: 'deadbeef', pass: false, start: startTime }, group: 'beefdead' }
			});

			expect(getByRole('option')).toHaveTextContent('2 hours');
		});

		it('displays number of failing and total tests', () => {
			const { getByRole } = render(ResultListBoxItem, {
				props: { result: { uuid: 'deadbeef', pass: false, start: startTime, failed: 13, tests: 37 }, group: 'beefdead' }
			});

			expect(getByRole('option')).toHaveTextContent('13/37');
		});

		describe('when selected', () => {
			it('renders as bordered error variant', () => {
				const { getByRole } = render(ResultListBoxItem, {
					props: { result: { uuid: 'deadbeef', pass: false, start: startTime }, group: 'deadbeef' }
				});

				expect(getByRole('option')).toHaveClass('variant-ghost-error');
			});
		});
	});
});
