import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['src/skeleton/**/*'],
		environment: 'jsdom',
		globals: true,
		setupFiles: ['src/setupTest.ts']
	},
	server: {
		proxy: {
			'/api': 'http://127.0.0.1:9393',
			'/ws': {
				target: 'http://127.0.0.1:9393',
				ws: true
			}
		}
	}
});
