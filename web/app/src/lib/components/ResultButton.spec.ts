import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import ResultButton from '$lib/components/ResultButton.svelte';

describe('ResultButton', () => {
	describe('when given a passing result', () => {
		it('renders as success variant', () => {
			const { getByRole } = render(ResultButton, { props: { result: { uuid: 'deadbeef', pass: true } } });

			expect(getByRole('button')).toHaveClass('variant-soft-success');
		});

		describe('when set as active', () => {
			it('renders as bordered success variant', () => {
				const { getByRole } = render(ResultButton, {
					props: { active: true, result: { uuid: 'deadbeef', pass: true } }
				});

				expect(getByRole('button')).toHaveClass('variant-ghost-success');
			});
		});

		describe('when clicked', () => {
			it('emits a click event with result UUID', () => {
				const handleClick = vi.fn();
				const { component, getByRole } = render(ResultButton, {
					props: { result: { uuid: 'deadbeef', pass: true } }
				});
				component.$on('click', handleClick);

				const btn = getByRole('button');

				fireEvent.click(btn);

				const expectedEvent = new CustomEvent('click', {
					detail: 'deadbeef'
				});

				expect(handleClick).toHaveBeenCalledWith(expectedEvent);
			});
		});
	});

	describe('when given a failing result', () => {
		it('renders as error variant', () => {
			const { getByRole } = render(ResultButton, { props: { result: { uuid: 'deadbeef', pass: false } } });

			expect(getByRole('button')).toHaveClass('variant-soft-error');
		});

		describe('when set as active', () => {
			it('renders as bordered error variant', () => {
				const { getByRole } = render(ResultButton, {
					props: { active: true, result: { uuid: 'deadbeef', pass: false } }
				});

				expect(getByRole('button')).toHaveClass('variant-ghost-error');
			});
		});

		describe('when clicked', () => {
			it('emits a click event with result UUID', () => {
				const handleClick = vi.fn();
				const { component, getByRole } = render(ResultButton, {
					props: { result: { uuid: 'deadbeef', pass: false } }
				});
				component.$on('click', handleClick);

				const btn = getByRole('button');

				fireEvent.click(btn);

				const expectedEvent = new CustomEvent('click', {
					detail: 'deadbeef'
				});

				expect(handleClick).toHaveBeenCalledWith(expectedEvent);
			});
		});
	});
});
