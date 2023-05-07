import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import RangeSlider from './RangeSlider.svelte';
describe('RangeSlider.svelte', () => {
	it('Renders with minimal props', async () => {
		const { getByTestId } = render(RangeSlider, { props: { name: 'testRangeSlider' } });
		expect(getByTestId('range-slider')).toBeTruthy();
	});
	it('Renders with all props', async () => {
		const { getByTestId } = render(RangeSlider, {
			props: {
				min: 0,
				max: 20,
				step: 5,
				value: 10,
				ticked: true,
				accent: 'bg-primary-500',
				// a11y
				id: 'testRangeSlider1',
				name: 'testRangeSlider1',
				label: 'testRangeSliderLabel1'
			}
		});
		expect(getByTestId('range-slider')).toBeTruthy();
	});
	it('Ticks enabled', async () => {
		const { getByTestId } = render(RangeSlider, {
			props: { name: 'testName', ticked: true }
		});
		expect(getByTestId('range-slider').querySelector('datalist')).toBeTruthy();
	});
	it('Disabled state', async () => {
		const { getByTestId } = render(RangeSlider, {
			props: { name: 'testName', disabled: true }
		});
		expect(getByTestId('range-slider').querySelector('input')?.disabled).eq(true);
	});
});
