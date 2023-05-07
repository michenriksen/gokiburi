import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { toastStore } from './stores';
import Toast from './Toast.svelte';
// Toast Payload
const toastMessage = {
	message: 'Your Message Here',
	autohide: true,
	timeout: 5000,
	action: {
		label: 'Greeting',
		response: () => alert('Hello, Skeleton')
	}
};
describe('Toast.svelte', () => {
	it('Renders modal alert', async () => {
		toastStore.trigger(toastMessage);
		const { getByTestId } = render(Toast);
		expect(getByTestId('toast')).toBeTruthy();
	});
	it('Renders only the configured max toasts at a time', async () => {
		toastStore.trigger({ message: '1' });
		toastStore.trigger({ message: '2' });
		const { getAllByTestId } = render(Toast, { max: 1 });
		expect(getAllByTestId('toast').length).toBe(1);
	});
});
