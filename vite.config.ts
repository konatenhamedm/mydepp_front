import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
		  '/api': {
			target: 'https://backend.leadagro.net',
			changeOrigin: true,
			secure: false, // Désactiver si le certificat SSL est auto-signé
			rewrite: (path) => path.replace(/^\/api/, '/api') // Garde le préfixe
		  }
		}
	  },
});
