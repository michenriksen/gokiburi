import type { PageLoad } from './$types';

export const load = (({ error }) => {
	return {
		message: error.message,
		stack: error.stack
	};
}) satisfies PageLoad;
