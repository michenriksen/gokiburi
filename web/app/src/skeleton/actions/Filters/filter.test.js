import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
// Action
import { filter } from './filter';
// SVG Filters
import Emerald from './svg-filters/Emerald.svelte';
import BlueNight from './svg-filters/BlueNight.svelte';
import XPro from './svg-filters/XPro.svelte';
import Summer84 from './svg-filters/Summer84.svelte';
import Rustic from './svg-filters/Rustic.svelte';
import Apollo from './svg-filters/Apollo.svelte';
import GreenFall from './svg-filters/GreenFall.svelte';
import Noir from './svg-filters/Noir.svelte';
import NoirLight from './svg-filters/NoirLight.svelte';
describe('Actions: Filter', () => {
	it('Tests all SVGs have class of "filter"', async () => {
		render(Emerald);
		render(BlueNight);
		render(XPro);
		render(Summer84);
		render(Rustic);
		render(Apollo);
		render(GreenFall);
		render(NoirLight, Noir);
		const elements = document.getElementsByClassName('filter');
		for (let i = 0; i < elements.length; ++i) {
			const el = elements[i];
			expect(el.getAttribute('class').includes('filter'));
		}
	});
	it('Test the node gets the filter url', async () => {
		const elem = document.createElement('div');
		filter(elem, 'XPro');
		expect(elem.getAttribute('style').includes('filter: url("#Emerald")'));
	});
});
