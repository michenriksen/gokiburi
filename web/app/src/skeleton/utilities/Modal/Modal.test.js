import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { modalStore } from './stores';
import Modal from './Modal.svelte';
// Modal Payloads
const modalAlert = {
	type: 'alert',
	title: 'Welcome to Skeleton.',
	body: 'This is a standard alert modal.'
};
const modalConfirm = {
	type: 'confirm',
	title: 'Please Confirm',
	body: 'Are you sure you wish to proceed?',
	response: (r) => console.log(r)
};
const modalPrompt = {
	type: 'prompt',
	title: 'Enter Name',
	body: 'Provide your first name in the field below.',
	value: 'foobar',
	response: (r) => console.log(r)
};
describe('Modal.svelte', () => {
	it('Renders modal alert', async () => {
		modalStore.trigger(modalAlert);
		const { getByTestId } = render(Modal);
		expect(getByTestId('modal-backdrop')).toBeTruthy();
		expect(getByTestId('modal')).toBeTruthy();
	});
	it('Renders modal confirm', async () => {
		modalStore.trigger(modalConfirm);
		const { getByTestId } = render(Modal);
		expect(getByTestId('modal-backdrop')).toBeTruthy();
		expect(getByTestId('modal')).toBeTruthy();
	});
	it('Renders modal prompt', async () => {
		modalStore.trigger(modalPrompt);
		const { getByTestId } = render(Modal);
		expect(getByTestId('modal-backdrop')).toBeTruthy();
		expect(getByTestId('modal')).toBeTruthy();
	});
});
