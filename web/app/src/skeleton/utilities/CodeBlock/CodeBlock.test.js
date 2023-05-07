import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CodeBlock from './CodeBlock.svelte';
describe('CodeBlock.svelte', () => {
	it('Renders with minimal props', async () => {
		const { getByTestId } = render(CodeBlock, {
			props: {
				language: 'html',
				code: '<p>Hello World</p>'
			}
		});
		expect(getByTestId('code-block')).toBeTruthy();
	});
	it('Renders with all props', async () => {
		const { getByTestId } = render(CodeBlock, {
			props: {
				language: 'js',
				code: `<div>Test</div>`,
				background: 'bg-slate-800'
			}
		});
		expect(getByTestId('code-block')).toBeTruthy();
	});
});
