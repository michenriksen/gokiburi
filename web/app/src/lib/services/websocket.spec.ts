import { get } from 'svelte/store';

import { toastStore } from '../../skeleton';
import WS from 'jest-websocket-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { lastResult, root, state } from '$lib/stores/status';

import NotificationService from '$lib/services/notifications';
import { WSMessageManager } from '$lib/services/websocket';

import { sleep } from '$lib/common/utils';

let manager: WSMessageManager;
let server: WS;

beforeEach(() => {
	server = new WS('ws://localhost:3000/ws', { jsonProtocol: true });
	manager = WSMessageManager.getInstance('ws://localhost:3000/ws');
});

afterEach(() => {
	manager.stop();
	WS.clean();
	vi.clearAllMocks();
	vi.useRealTimers();
});

describe('WSMessageManager', () => {
	describe('when message kind is init', () => {
		it('updates state and root stores', async () => {
			manager.start();
			await server.connected;

			server.send({ kind: 'init', data: { state: 'ready', root: '~/src/github.com/johndoe/project' } });

			expect(get(state)).toBe('ready');
			expect(get(root)).toBe('~/src/github.com/johndoe/project');
		});
	});

	describe('when message kind is state', () => {
		it('updates state store', async () => {
			manager.start();
			await server.connected;

			server.send({ kind: 'state', data: 'running' });

			expect(get(state)).toBe('running');
		});
	});

	describe('when message kind is result', () => {
		it('updates lastResult store', async () => {
			manager.start();
			await server.connected;

			server.send({ kind: 'result', data: { uuid: 'deadbeef', pass: true, tests: 10 } });

			const result = get(lastResult);

			expect(result?.uuid).toBe('deadbeef');
			expect(result?.pass).toBe(true);
			expect(result?.tests).toBe(10);
		});
	});

	describe('when message kind is resultError', () => {
		it('notifies the user and updates state store to ready', async () => {
			NotificationService.notify = vi.fn();

			state.set('running');

			manager.start();
			await server.connected;

			server.send({ kind: 'resultError', data: { uuid: 'deadbeef', pass: false, error: 'warp core breach' } });

			expect(NotificationService.notify).toHaveBeenCalledWith(
				'Tests failed with error: warp core breach',
				'error',
				'deadbeef'
			);

			expect(document.title).toContain('ERROR: warp core breach');
			expect(get(state)).toBe('ready');
		});
	});

	describe('when message kind is resultEmpty', () => {
		it('notifies the user and updates state store to ready', async () => {
			NotificationService.notify = vi.fn();

			state.set('running');

			manager.start();
			await server.connected;

			server.send({ kind: 'resultEmpty', data: { uuid: 'deadbeef', pass: false, packages: [{}, {}] } });

			expect(NotificationService.notify).toHaveBeenCalledWith('No tests found for 2 packages', 'warning', 'deadbeef');

			expect(document.title).toContain('NO TESTS FOUND');

			expect(get(state)).toBe('ready');
		});
	});

	describe('when message kind is notification', () => {
		it('notifies the user with information', async () => {
			NotificationService.notify = vi.fn();

			manager.start();
			await server.connected;

			server.send({ kind: 'notification', data: { body: 'Hello, World!', type: 'info', tag: 'helloworld' } });

			expect(NotificationService.notify).toHaveBeenCalledWith('Hello, World!', 'info', 'helloworld');
		});
	});

	describe('when message kind is unknown', () => {
		it('notifies the user', async () => {
			toastStore.trigger = vi.fn();

			manager.start();
			await server.connected;

			server.send({ kind: 'lolwut' });

			expect(toastStore.trigger).toHaveBeenCalledWith({
				message: `Received unknown "lolwut" message from server`,
				background: 'variant-soft-error'
			});
		});
	});

	describe('when connection closes', () => {
		describe('abnormally', async () => {
			it('updates state store and notifies the user', async () => {
				const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
				NotificationService.notify = vi.fn();

				state.set('ready');

				manager.start();
				await server.connected;

				server.error();

				sleep(50);

				expect(get(state)).toBe('offline');
				expect(NotificationService.notify).toHaveBeenCalledWith(
					'Server connection lost. Trying to reconnect in 5 seconds...',
					'warning',
					'websocketReconnect'
				);
				expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
			});
		});
	});
});
