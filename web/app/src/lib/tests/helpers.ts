import type { SvelteComponent } from 'svelte';

type Constructor<T> = new (...args: any[]) => T;

/**
 * Render a Svelte component to string.
 *
 * Temporarily renders the given component in the DOM and returns
 * the resulting HTML.
 *
 * @param component - Component Constructor.
 * @param props - Optional props to give the component.
 * @returns HTML of rendered component.
 */
export function renderComponentToString<C extends SvelteComponent>(component: Constructor<C>, props?: any): string {
	const host = document.createElement('div');
	document.body.append(host);
	const instance = new component({ target: host, props: props });
	const result = host.innerHTML;
	instance.$destroy();
	host.remove();

	return result;
}
