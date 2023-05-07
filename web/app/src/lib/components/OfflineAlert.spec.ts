import { tick } from 'svelte';

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import OfflineAlert from '$lib/components/OfflineAlert.svelte';

import { state } from '$lib/stores/status';

describe('OfflineAlert', () => {
	describe('when application state is init', () => {
		it('is does not render', () => {
			state.set('init');
			render(OfflineAlert, {});
			expect(screen.queryByText('Backend API Unresponsive')).toBeNull();
		});
	});

	describe('when application state is ready', () => {
		it('is does not render', () => {
			state.set('ready');
			render(OfflineAlert, {});
			expect(screen.queryByText('Backend API Unresponsive')).toBeNull();
		});
	});

	describe('when application state is running', () => {
		it('is does not render', () => {
			state.set('running');
			render(OfflineAlert, {});
			expect(screen.queryByText('Backend API Unresponsive')).toBeNull();
		});
	});

	describe('when application state is paused', () => {
		it('is does not render', () => {
			state.set('paused');
			render(OfflineAlert, {});
			expect(screen.queryByText('Backend API Unresponsive')).toBeNull();
		});
	});

	describe('when application state is offline', () => {
		it('renders', () => {
			state.set('offline');
			render(OfflineAlert, {});
			expect(screen.getByText('Backend API Unresponsive')).toBeInTheDocument();
		});

		describe('when the application state is offline but changes to ready', () => {
			it('does not render', async () => {
				render(OfflineAlert, {});
				state.set('offline');
				await tick();

				expect(screen.queryByText('Backend API Unresponsive')).toBeInTheDocument();

				state.set('ready');
				await tick();

				expect(screen.queryByText('Backend API Unresponsive')).toBeNull();
			});
		});
	});
});
