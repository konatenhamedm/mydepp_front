import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://backend.leadagro.net",
        changeOrigin: true,
        secure: false, // Désactiver si le certificat SSL est auto-signé
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Garde le préfixe
      },
    },
  },
});
