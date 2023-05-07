import { get } from 'svelte/store';

import {
	conditionalScale,
	transitionsOff,
	transitionsOffForDuration,
	transitionsOn
} from '$lib/conditionalTransitions';
import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';

import { transitionsActive } from '$lib/stores/transitions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockLockWith(returnVal: Lock | null): Mock<any[], any> {
	const mockLockRequest = vi.fn((_name: string, _options: LockOptions, callback: (lock: Lock | null) => void) => {
		callback(returnVal);
	});

	vi.stubGlobal('navigator', {
		locks: {
			request: mockLockRequest
		}
	});

	return mockLockRequest;
}

beforeEach(() => {
	vi.useRealTimers();
});

afterEach(() => {
	vi.clearAllMocks();
});

describe('transitionsOff', () => {
	it('acquires lock and sets transitionsActive store to false', async () => {
		const mock = mockLockWith({} as Lock);
		transitionsActive.set(true);
		expect(await transitionsOff()).toBe(true);
		expect(get(transitionsActive)).toBe(false);
		expect(mock).toHaveBeenCalledWith('stores.transitionsActive', { ifAvailable: true }, expect.any(Function));
	});

	describe('when lock is not available', () => {
		it('does not set transitionsActive store to false', async () => {
			const mock = mockLockWith(null);
			transitionsActive.set(true);
			expect(await transitionsOff()).toBe(false);
			expect(get(transitionsActive)).toBe(true);
			expect(mock).toHaveBeenCalledWith('stores.transitionsActive', { ifAvailable: true }, expect.any(Function));
		});
	});
});

describe('transitionsOn', () => {
	it('acquires lock and sets transitionsActive store to true', async () => {
		const mock = mockLockWith({} as Lock);
		transitionsActive.set(false);
		expect(await transitionsOn()).toBe(true);
		expect(get(transitionsActive)).toBe(true);
		expect(mock).toHaveBeenCalledWith('stores.transitionsActive', { ifAvailable: true }, expect.any(Function));
	});

	describe('when lock is not available', () => {
		it('does not set transitionsActive store to true', async () => {
			const mock = mockLockWith(null);
			transitionsActive.set(false);
			expect(await transitionsOn()).toBe(false);
			expect(get(transitionsActive)).toBe(false);
			expect(mock).toHaveBeenCalledWith('stores.transitionsActive', { ifAvailable: true }, expect.any(Function));
		});
	});
});

describe('transitionsOffForDuration', () => {
	it('acquires lock and sets transitionsActive store to false for duration', async () => {
		vi.useFakeTimers();
		const mock = mockLockWith({} as Lock);
		transitionsActive.set(true);
		expect(transitionsOffForDuration(1000)).resolves.toBe(true);
		await new Promise(process.nextTick);
		expect(get(transitionsActive)).toBe(false);
		vi.advanceTimersByTime(1000);
		await new Promise(process.nextTick);
		expect(mock).toHaveBeenCalledWith('stores.transitionsActive', { ifAvailable: true }, expect.any(Function));
	});

	describe('when lock is not available', () => {
		it('does not set transitionsActive store to true', async () => {
			const mock = mockLockWith(null);
			transitionsActive.set(true);
			expect(transitionsOffForDuration(1000)).resolves.toBe(false);
			expect(get(transitionsActive)).toBe(true);
			expect(mock).toHaveBeenCalledWith('stores.transitionsActive', { ifAvailable: true }, expect.any(Function));
		});
	});
});

describe('conditionalScale', () => {
	describe('when transitionsActive is true', () => {
		it('returns a scale transition', () => {
			transitionsActive.set(true);
			const transition = conditionalScale(document.createElement('div'));
			expect(transition.css).toBeTypeOf('function');
		});
	});

	describe('when transitionsActive is false', () => {
		it('returns empty object', () => {
			transitionsActive.set(false);
			const transition = conditionalScale(document.createElement('div'));
			expect(transition.css).toBeUndefined;
		});
	});
});
