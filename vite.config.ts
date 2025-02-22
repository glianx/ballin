import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true, // Listen on all addresses
		port: 5173,
		strictPort: false, // Allow fallback to another port if 5173 is taken
		open: true // Open browser automatically
	}
});
