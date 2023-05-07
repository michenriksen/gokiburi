import { get } from 'svelte/store';

import { toastStore } from '../../skeleton';

import { metadata } from '$lib/stores/metadata';
import { notificationsActive, notifyOn } from '$lib/stores/settings';

import AudioService from '$lib/services/audio';

import type { NotificationType } from '$lib/common/types';

const appName = get(metadata).appName;
const alwaysNotifyOn: NotificationType[] = ['error', 'warning', 'info'];

const toastVariantMap: Record<NotificationType, string> = {
	pass: 'variant-soft-success',
	fail: 'variant-soft-error',
	error: 'variant-soft-error',
	warning: 'variant-soft-warning',
	info: 'variant-soft-primary'
};

let lastTag: string;

export default {
	/**
	 * Check if browser notification permission has been granted.
	 *
	 * @returns boolean true if granted, and false otherwise.
	 */
	browserNotificationsGranted(): boolean {
		if (typeof Notification === 'undefined') {
			return false;
		}

		return Notification.permission === 'granted';
	},

	/**
	 * Request browser notification permission from the user.
	 *
	 * If permission has already been granted, a call to this method is a no-op.
	 *
	 * @returns boolean true if user granted permission, and false otherwise.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission}
	 */
	async requestBrowserNotifications(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this.browserNotificationsGranted()) {
				return resolve(true);
			}

			Notification.requestPermission()
				.then((result) => {
					if (result === 'granted') {
						return resolve(true);
					}
					return resolve(false);
				})
				.catch((error) => {
					return reject(error);
				});
		});
	},

	/**
	 * Notify user about an event.
	 *
	 * Notifies the user with a browser notification (if allowed and enabled),
	 * audio notification (if allowed and enabled), and with a toast notification.
	 *
	 * @param body - The message content.
	 * @param notificationType - The message type (one of 'pass', 'fail', 'error', 'warning', 'info').
	 * @param tag - A tag for the notification, used to avoid double notifications.
	 */
	notify(body: string, notificationType: NotificationType, tag: string) {
		if (tag === lastTag) {
			console.debug('Skipping duplicate notification with tag:', tag);
			return;
		}

		lastTag = tag;

		if (this.browserNotificationsGranted() && this.shouldBrowserNotify(notificationType)) {
			new Notification(`${appName.toUpperCase()}: ${notificationType.toUpperCase()}`, {
				body: body,
				icon: `/${notificationType}.png`,
				lang: 'en-US',
				tag: tag
			});
		}

		switch (notificationType) {
			case 'pass':
				AudioService.play('pass');
				break;
			case 'fail':
				AudioService.play('fail');
				break;
			case 'error':
				AudioService.play('fail');
				break;
			case 'warning':
				AudioService.play('warning');
				break;
		}

		toastStore.trigger({ message: body, background: toastVariantMap[notificationType] });
	},

	/**
	 * Determine if a notification should be emitted.
	 *
	 * @param notificationType - Type of notification.
	 *
	 * @returns
	 * True if notification should be emitted according to the current
	 * settings, and false otherwise.
	 */
	shouldBrowserNotify(notificationType: NotificationType): boolean {
		if (get(notificationsActive) === 'false') {
			return false;
		}

		const notifyOnSetting = get(notifyOn);

		if (notifyOnSetting === 'all') {
			return true;
		}

		if (!alwaysNotifyOn.includes(notificationType)) {
			return false;
		}

		return notificationType === notifyOnSetting;
	}
};
