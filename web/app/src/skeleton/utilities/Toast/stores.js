// Toast Store Queue
import { writable } from 'svelte/store';
const toastDefaults = { message: 'Missing Toast Message', autohide: true, timeout: 5000 };
// Note for security; differentiates the queued toasts
function randomUUID() {
	const random = Math.random();
	return Number(random).toString(32);
}
// If toast should auto-hide, wait X time, then close by ID
function handleAutoHide(toast) {
	if (toast.autohide === true) {
		return setTimeout(() => {
			toastStore.close(toast.id);
		}, toast.timeout);
	}
}
function toastService() {
	const { subscribe, set, update } = writable([]);
	return {
		subscribe,
		/** Add a new toast to the queue. */
		trigger: (toast) =>
			update((tStore) => {
				const id = randomUUID();
				// Trigger Callback
				if (toast && toast.callback) toast.callback({ id, status: 'queued' });
				// Merge with defaults
				const tMerged = { ...toastDefaults, ...toast, id };
				// Handle auto-hide, if needed
				tMerged.timeoutId = handleAutoHide(tMerged);
				// Push into store
				tStore.push(tMerged);
				// Return
				return tStore;
			}),
		/** Remove first toast in queue */
		close: (id) =>
			update((tStore) => {
				if (tStore.length > 0) {
					const index = tStore.findIndex((t) => t.id === id);
					const selectedToast = tStore[index];
					if (selectedToast) {
						// Trigger Callback
						if (selectedToast.callback) selectedToast.callback({ id, status: 'closed' });
						// Clear timeout
						if (selectedToast.timeoutId) clearTimeout(selectedToast.timeoutId);
						// Remove
						tStore.splice(index, 1);
					}
				}
				return tStore;
			}),
		/** Remove all toasts from queue */
		clear: () => set([])
	};
}
export const toastStore = toastService();
