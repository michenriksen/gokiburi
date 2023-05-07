import { get } from 'svelte/store';

import { type ToastSettings, toastStore } from '../../skeleton';
import { Howl, Howler } from 'howler';

import { audioContextUnlocked, audioNotifyOn, audioVolume } from '$lib/stores/settings';

import type { AudioNotifyOnSetting } from '$lib/common/types';

Howler.autoUnlock = false;
Howler.autoSuspend = false;

/**
 * The type of sound to play.
 */
type SoundType = 'pass' | 'fail' | 'error' | 'warning';

const passSound = new Howl({
	src: ['/sounds/pass.webm'],
	mute: true
})
	.on('loaderror', (_: number, errorCode: unknown) => {
		toastStore.trigger(<ToastSettings>{
			message: 'Failed to load pass notification sound: ' + translateMediaErrorCode(errorCode),
			background: 'variant-soft-error'
		});
	})
	.on('playerror', (_: number, errorCode: unknown) => {
		toastStore.trigger(<ToastSettings>{
			message: 'Failed to play pass notification sound: ' + translateMediaErrorCode(errorCode),
			background: 'variant-soft-error'
		});
	});

const failSound = new Howl({
	src: ['/sounds/fail.webm'],
	mute: true
})
	.on('loaderror', (_: number, errorCode: unknown) => {
		toastStore.trigger(<ToastSettings>{
			message: 'Failed to load fail notification sound: ' + translateMediaErrorCode(errorCode),
			background: 'variant-soft-error'
		});
	})
	.on('playerror', (_: number, errorCode: unknown) => {
		toastStore.trigger(<ToastSettings>{
			message: 'Failed to play fail notification sound: ' + translateMediaErrorCode(errorCode),
			background: 'variant-soft-error'
		});
	});

const warningSound = new Howl({
	src: ['/sounds/warning.webm'],
	mute: true
})
	.on('loaderror', (_: number, errorCode: unknown) => {
		toastStore.trigger(<ToastSettings>{
			message: 'Failed to load warning notification sound: ' + translateMediaErrorCode(errorCode),
			background: 'variant-soft-error'
		});
	})
	.on('playerror', (_: number, errorCode: unknown) => {
		toastStore.trigger(<ToastSettings>{
			message: 'Failed to play warning notification sound: ' + translateMediaErrorCode(errorCode),
			background: 'variant-soft-error'
		});
	});

let audioNotifyOnVal: AudioNotifyOnSetting = 'all';
let audioVolumeVal = 1;

audioNotifyOn.subscribe((newSetting) => {
	audioNotifyOnVal = newSetting;
});

audioVolume.subscribe((newSetting) => {
	const f = parseFloat(newSetting);

	if (f >= 0 && f <= 1) {
		audioVolumeVal = f;
	} else {
		audioVolumeVal = 1;
	}

	Howler.volume(audioVolumeVal);
});

export default {
	/**
	 * Determine if a sound is currently playing.
	 *
	 * @returns true if a sound is playing, and false otherwise.
	 */
	playing(): boolean {
		return passSound.playing() || failSound.playing();
	},

	/**
	 * Activate audio.
	 *
	 * Because of browser security restrictions, audio must be activated before
	 * it can be played. This function will load the audio files and unlock the
	 * audio context.
	 *
	 * The function must be called from a user interaction event handler, such as
	 * a click or keypress event.
	 */
	async activate() {
		await Howler.ctx.resume();

		if (passSound.state() === 'unloaded') {
			passSound.load();
		}
		if (failSound.state() === 'unloaded') {
			failSound.load();
		}
		if (warningSound.state() === 'unloaded') {
			warningSound.load();
		}

		passSound.mute(false);
		failSound.mute(false);
		warningSound.mute(false);

		audioContextUnlocked.set(true);
	},

	/**
	 * Deactivate audio.
	 *
	 * This function will unload the audio files and suspend the audio context.
	 *
	 * The {@link activate} function must be called again before audio can be
	 * played.
	 */
	async deactivate() {
		await Howler.ctx.suspend();
		Howler.unload();
		audioContextUnlocked.set(false);
	},

	/**
	 * Play a sound.
	 *
	 * By default, plays a sound if the sound type is enabled, and if a sound is
	 * not already playing.
	 *
	 * @param type - Type of sound to play.
	 * @param force - If true, the sound will play regardless of current settings.
	 *
	 * @returns true if the sound was played, and false otherwise.
	 */
	play(type: SoundType, force = false): boolean {
		if (!this.hasAudio() || get(audioContextUnlocked) === false || !this.shouldPlay(type, force)) {
			return false;
		}

		switch (type) {
			case 'pass':
				passSound.play();
				break;
			case 'warning':
				warningSound.play();
				break;
			default:
				failSound.play();
				break;
		}

		return true;
	},

	/**
	 * Determine if a sound should play.
	 *
	 * @param type - Type of sound to play.
	 * @param force - If true, the sound will play regardless of current settings.
	 *
	 * @returns true if the sound should play, and false otherwise.
	 */
	shouldPlay(type: SoundType, force = false): boolean {
		if (force) {
			return true;
		}

		if (audioNotifyOnVal === 'all' || type === 'error' || type === 'warning') {
			return true;
		}

		if (this.playing()) {
			return false;
		}

		return audioNotifyOnVal === type;
	},

	/**
	 * Determine if the browser supports audio.
	 *
	 * @returns true if the browser supports audio, and false otherwise.
	 */
	hasAudio(): boolean {
		return !Howler.noAudio;
	}
};

function translateMediaErrorCode(errorCode: unknown): string {
	// If error code is a string, we assume it's a readable error message from
	// Howler.
	if (typeof errorCode === 'string') {
		return errorCode;
	}

	switch (errorCode) {
		case MediaError.MEDIA_ERR_ABORTED:
			return 'audio playback was aborted.';
		case MediaError.MEDIA_ERR_NETWORK:
			return 'network error when fetching sound file.';
		case MediaError.MEDIA_ERR_DECODE:
			return 'sound file could not be decoded.';
		case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
			return 'sound file format is not supported by your browser.';
		default:
			return 'unknown error.';
	}
}
