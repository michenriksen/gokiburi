import { tick } from 'svelte';

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import CodeBlock from '$lib/components/CodeBlock.svelte';

import { coverageTheme } from '$lib/stores/settings';

describe('CodeBlock', () => {
	describe('color legend', () => {
		it('has a coverage scale', () => {
			render(CodeBlock, { props: { code: '' } });

			expect(screen.getByText('lowest')).toHaveClass('gokiburi-cov-1');

			const scale = screen.getAllByText('※');
			expect(scale.length).toBe(10);
			scale.forEach((el, i) => {
				expect(el).toHaveClass(`gokiburi-cov-${i + 1}`);
			});

			expect(screen.getByText('highest')).toHaveClass('gokiburi-cov-10');
		});

		it('has an example for no coverage', () => {
			render(CodeBlock, { props: { code: '' } });

			expect(screen.getByText('no coverage')).toHaveClass('gokiburi-cov-0');
		});

		it('has an example for non-runnable code', () => {
			render(CodeBlock, { props: { code: '' } });

			expect(screen.getByText('non-runnable')).toHaveClass('!text-surface-400');
		});
	});

	describe('code display', () => {
		it('renders code as raw HTML', () => {
			const { getByRole } = render(CodeBlock, {
				props: { code: '<span class="gokiburi-cov gokiburi-cov-8" data-cov-level="8" data-cov-count="4">code</span>' }
			});

			const code = getByRole('code');

			expect(code.innerHTML).toEqual(
				'<span class="gokiburi-cov gokiburi-cov-8" data-cov-level="8" data-cov-count="4">code</span>'
			);
		});

		describe('when theme setting is changed', () => {
			it('changes the theme', async () => {
				const { getByRole } = render(CodeBlock, { props: { code: '' } });

				coverageTheme.set('heatmap');
				await tick();

				expect(getByRole('code')).toHaveClass('heatmap');
			});
		});
	});
});
