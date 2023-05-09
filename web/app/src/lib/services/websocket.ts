import { toastStore } from '../../skeleton';

import { lastResult, root, state } from '$lib/stores/status';

import NotificationService from '$lib/services/notifications';

import { pluralize, setPageTitle } from '$lib/common/utils';
import type { Result, ServerNotification, State, WSMessage } from '$lib/common/types';

const CODE_CLOSE_NORMAL = 1000;
const CODE_CLOSE_GOING_AWAY = 1001;

function isAbnormalClose(code: number): boolean {
	return code !== CODE_CLOSE_NORMAL && code !== CODE_CLOSE_GOING_AWAY;
}

/**
 * WSMessageManager handles WebSocket connection and messages.
 */
export class WSMessageManager {
	private static instance: WSMessageManager;
	private url: string;
	private _connection: WebSocket | null = null;
	private stopCalled = false;

	private constructor(url: string) {
		this.url = url;
	}

	/**
	 * Get WebSocket Manager instance.
	 *
	 * Instantiates a new singleton Websocket Manager with given URL if one is not
	 * already instantiated.
	 *
	 * @param url - WebSocket URL.
	 *
	 * @throws Error if WebSocket Manager is already instantiated with a different
	 * URL than the one provided.
	 */
	public static getInstance(url: string): WSMessageManager {
		if (!WSMessageManager.instance) {
			WSMessageManager.instance = new WSMessageManager(url);
		}

		if (WSMessageManager.instance.url !== url) {
			throw new Error('WebSocket Manager already instantiated with different URL');
		}

		return WSMessageManager.instance;
	}

	/**
	 * Subscribe to WebSocket messages and handle them.
	 */
	public start() {
		this.stopCalled = false;
		const conn = this.connection();

		this.removeEventListeners(conn);

		conn.addEventListener('open', () => this.log('connection opened'));
		conn.addEventListener('message', (event) => this.handleMessage(event));
		conn.addEventListener('close', (event) => this.handleClose(event));
	}

	/**
	 * Unsubscribe from WebSocket messages and close connection.
	 */
	public stop() {
		this.stopCalled = true;

		if (this._connection) {
			this.removeEventListeners(this._connection);

			if (this._connection.readyState === WebSocket.OPEN) {
				this._connection.close();
			}
		}

		this._connection = null;
	}

	private handleMessage(event: MessageEvent) {
		const message = JSON.parse(event.data) as WSMessage;

		switch (message.kind) {
			case 'keepalive':
				break;
			case 'init':
				this.handleInit(message);
				break;
			case 'state':
				this.handleState(message);
				break;
			case 'result':
				this.handleResult(message);
				break;
			case 'resultError':
				this.handleResultError(message);
				break;
			case 'resultEmpty':
				this.handleResultEmpty(message);
				break;
			case 'notification':
				this.handleNotification(message);
				break;
			default:
				toastStore.trigger({
					message: `Received unknown "${message.kind}" message from server`,
					background: 'variant-soft-error'
				});
				break;
		}
	}

	private handleInit(message: WSMessage) {
		this.log(`received init message`);

		if (!message.data) {
			this.log('init message missing data, ignoring');
			return;
		}

		const data = message.data as InitData;

		state.set(data.state);
		root.set(data.root);
	}

	private handleState(message: WSMessage) {
		this.log(`received state message`);

		if (!message.data) {
			this.log('state message missing data, ignoring');
			return;
		}

		state.set(message.data as State);
	}

	private handleResult(message: WSMessage) {
		this.log(`received result message`);

		if (!message.data) {
			this.log('result message missing data, ignoring');
			return;
		}

		lastResult.set(message.data as Result);
	}

	private handleResultError(message: WSMessage) {
		this.log(`received resultError message`);

		if (!message.data) {
			this.log('resultError message missing data, ignoring');
			return;
		}

		const result = message.data as Result;

		NotificationService.notify(`Tests failed with error: ${result.error}`, 'error', result.uuid);
		setPageTitle(`✖ ERROR: ${result.error}`);
		state.set('ready');
	}

	private handleResultEmpty(message: WSMessage) {
		this.log(`received resultEmpty message`);

		if (!message.data) {
			this.log('resultEmpty message missing data, ignoring');
			return;
		}

		const result = message.data as Result;

		NotificationService.notify(
			`No tests found for ${pluralize(result.packages?.length || 0, 'package', 'packages')}`,
			'warning',
			result.uuid
		);
		setPageTitle('? NO TESTS FOUND');
		state.set('ready');
	}

	private handleNotification(message: WSMessage) {
		this.log(`received notification message`);

		if (!message.data) {
			this.log('notification message missing data, ignoring');
			return;
		}

		const notification = message.data as ServerNotification;

		NotificationService.notify(notification.body, notification.type, notification.tag);
	}

	private handleClose(event: CloseEvent) {
		state.set('offline');

		if (!this.stopCalled && isAbnormalClose(event.code)) {
			this.stop();

			this.log(`connection closed abnormally with code ${event.code}: ${event.reason || '<no reason>'}`);
			this.log(`resetting connection and trying again`);

			NotificationService.notify(
				'Server connection lost. Trying to reconnect in 5 seconds...',
				'warning',
				'websocketReconnect'
			);

			setTimeout(() => this.start(), 5000);
			return;
		}

		this.log(`connection closed with code ${event.code}: ${event.reason || '<no reason>'}`);
	}

	private connection(): WebSocket {
		if (!this._connection || this._connection.readyState !== WebSocket.OPEN) {
			this._connection = new WebSocket(this.url);
		}

		return this._connection;
	}

	private log(msg: string) {
		console.debug(`%c[WebSocket Message Manager] %c${msg}`, 'color: #a2a2a2', '');
	}

	private removeEventListeners(conn: WebSocket) {
		conn.onopen = null;
		conn.onmessage = null;
		conn.onclose = null;
		conn.onerror = null;
	}
}

interface InitData {
	state: State;
	root: string;
}
