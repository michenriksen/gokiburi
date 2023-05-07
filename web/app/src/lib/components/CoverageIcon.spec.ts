import { tick } from 'svelte';

import {
	mdiCircleOutline,
	mdiCircleSlice1,
	mdiCircleSlice2,
	mdiCircleSlice3,
	mdiCircleSlice4,
	mdiCircleSlice5,
	mdiCircleSlice6,
	mdiCircleSlice7,
	mdiCircleSlice8
} from '@mdi/js';
import { render } from '@testing-library/svelte';
import { renderComponentToString } from '$lib/tests/helpers';
import { afterEach, describe, expect, it } from 'vitest';

import CoverageIcon from '$lib/components/CoverageIcon.svelte';
import SvgIcon from '$lib/components/SvgIcon.svelte';

import { coverageHighMin, coverageMediumMin, coverageUseColor } from '$lib/stores/settings';

afterEach(() => {
	coverageUseColor.set('true');
});

describe('CoverageIcon', () => {
	describe('when coverage is 100 and above', () => {
		it('renders coverage icon eight', async () => {
			const results = render(CoverageIcon, { props: { percentage: 100 } });
			const icon = renderComponentToString(SvgIcon, { path: mdiCircleSlice8, size: '1.5em', class: 'inline-block' });
			expect(results.container.innerHTML).toContain(icon);
			results.component.$set({ percentage: 105 });
			await tick();
			expect(results.container.innerHTML).toContain(icon);
		});
	});

	describe('when coverage is 87.5 and above', () => {
		it('renders coverage icon seven', async () => {
			const results = render(CoverageIcon, { props: { percentage: 87.5 } });
			const icon = renderComponentToString(SvgIcon, { path: mdiCircleSlice7, size: '1.5em', class: 'inline-block' });
			expect(results.container.innerHTML).toContain(icon);
			results.component.$set({ percentage: 92 });
			await tick();
			expect(results.container.innerHTML).toContain(icon);
		});
	});

	describe('when coverage is 75 and above', () => {
		it('renders coverage icon six', async () => {
			const results = render(CoverageIcon, { props: { percentage: 75 } });
			const icon = renderComponentToString(SvgIcon, { path: mdiCircleSlice6, size: '1.5em', class: 'inline-block' });
			expect(results.container.innerHTML).toContain(icon);
			results.component.$set({ percentage: 80 });
			await tick();
			expect(results.container.innerHTML).toContain(icon);
		});
	});

	describe('when coverage is 62.5 and above', () => {
		it('renders coverage icon five', async () => {
			const results = render(CoverageIcon, { props: { percentage: 62.5 } });
			const icon = renderComponentToString(SvgIcon, { path: mdiCircleSlice5, size: '1.5em', class: 'inline-block' });
			expect(results.container.innerHTML).toContain(icon);
			results.component.$set({ percentage: 67 });
			await tick();
			expect(results.container.innerHTML).toContain(icon);
		});
	});

	describe('when coverage is 50 and above', () => {
		it('renders coverage icon four', async () => {
			const results = render(CoverageIcon, { props: { percentage: 50 } });
			const icon = renderComponentToString(SvgIcon, { path: mdiCircleSlice4, size: '1.5em', class: 'inline-block' });
			expect(results.container.innerHTML).toContain(icon);
			results.component.$set({ percentage: 55 });
			await tick();
			expect(results.container.innerHTML).toContain(icon);
		});
	});

	describe('when coverage is 37.5 and above', () => {
		it('renders coverage icon three', async () => {
			const results = render(CoverageIcon, { props: { percentage: 37.5 } });
			const icon = renderComponentToString(SvgIcon, { path: mdiCircleSlice3, size: '1.5em', class: 'inline-block' });
			expect(results.container.innerHTML).toContain(icon);
			results.component.$set({ percentage: 42 });
			await tick();
			expect(results.container.innerHTML).toContain(icon);
		});
	});

	describe('when coverage is 25 and above', () => {
		it('renders coverage icon two', async () => {
			const results = render(CoverageIcon, { props: { percentage: 25 } });
			const icon = renderComponentToString(SvgIcon, { path: mdiCircleSlice2, size: '1.5em', class: 'inline-block' });
			expect(results.container.innerHTML).toContain(icon);
			results.component.$set({ percentage: 30 });
			await tick();
			expect(results.container.innerHTML).toContain(icon);
		});
	});

	describe('when coverage is 12.5 and above', () => {
		it('renders coverage icon one', async () => {
			const results = render(CoverageIcon, { props: { percentage: 12.5 } });
			const icon = renderComponentToString(SvgIcon, { path: mdiCircleSlice1, size: '1.5em', class: 'inline-block' });
			expect(results.container.innerHTML).toContain(icon);
			results.component.$set({ percentage: 17 });
			await tick();
			expect(results.container.innerHTML).toContain(icon);
		});
	});

	describe('when coverage is 0 and above', () => {
		it('renders coverage icon zero', async () => {
			const results = render(CoverageIcon, { props: { percentage: 0 } });
			const icon = renderComponentToString(SvgIcon, { path: mdiCircleOutline, size: '1.5em', class: 'inline-block' });
			expect(results.container.innerHTML).toContain(icon);
			results.component.$set({ percentage: 5 });
			await tick();
			expect(results.container.innerHTML).toContain(icon);
		});
	});

	describe('positive coverage', () => {
		describe('when coverage is equal to or above positive coverage minimum', () => {
			it('renders a green coverage icon', async () => {
				coverageHighMin.set('80');
				const results = render(CoverageIcon, { props: { percentage: 80 } });
				expect(results.container.innerHTML).toContain('<span class="text-success-500">');
				results.component.$set({ percentage: 85 });
				await tick();
				expect(results.container.innerHTML).toContain('<span class="text-success-500">');
			});

			describe('when use color setting is false', () => {
				it('renders a neutral coverage icon', () => {
					coverageHighMin.set('80');
					coverageUseColor.set('false');
					const { container } = render(CoverageIcon, { props: { percentage: 80 } });
					expect(container.innerHTML).toContain('<span class="text-inherit">');
				});
			});
		});

		describe('when coverage is below positive coverage minimum', () => {
			it('does not render a green coverage icon', () => {
				coverageHighMin.set('80');
				const { container } = render(CoverageIcon, { props: { percentage: 75 } });
				expect(container.innerHTML).not.toContain('<span class="text-success-500">');
			});
		});
	});

	describe('warning coverage', () => {
		describe('when coverage is equal to or above warning coverage minimum', () => {
			it('renders a yellow coverage icon', async () => {
				coverageMediumMin.set('65');
				const results = render(CoverageIcon, { props: { percentage: 65 } });
				expect(results.container.innerHTML).toContain('<span class="text-warning-500">');
				results.component.$set({ percentage: 65 });
				await tick();
				expect(results.container.innerHTML).toContain('<span class="text-warning-500">');
			});

			describe('when use color setting is false', () => {
				it('renders a neutral coverage icon', () => {
					coverageMediumMin.set('65');
					coverageUseColor.set('false');
					const { container } = render(CoverageIcon, { props: { percentage: 65 } });
					expect(container.innerHTML).toContain('<span class="text-inherit">');
				});
			});
		});

		describe('when coverage is below warning coverage minimum', () => {
			it('does not render a yellow coverage icon', () => {
				coverageMediumMin.set('65');
				const { container } = render(CoverageIcon, { props: { percentage: 60 } });
				expect(container.innerHTML).not.toContain('<span class="text-warning-500">');
			});
		});
	});

	describe('negative coverage', () => {
		describe('when coverage is below warning coverage minimum', () => {
			it('renders a red coverage icon', async () => {
				coverageMediumMin.set('65');
				const results = render(CoverageIcon, { props: { percentage: 40 } });
				expect(results.container.innerHTML).toContain('<span class="text-error-400">');
				results.component.$set({ percentage: 60 });
				await tick();
				expect(results.container.innerHTML).toContain('<span class="text-error-400">');
			});

			describe('when use color setting is false', () => {
				it('renders a neutral coverage icon', () => {
					coverageMediumMin.set('65');
					coverageUseColor.set('false');
					const { container } = render(CoverageIcon, { props: { percentage: 40 } });
					expect(container.innerHTML).toContain('<span class="text-inherit">');
				});
			});
		});
	});
});
