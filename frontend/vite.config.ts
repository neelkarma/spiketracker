import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [sveltekit()],
  server: {
    proxy: {
      // Vite's proxy option only works in dev mode.
      // Sooner or later, we're going to have to figure out how to do this in production.
      // NGINX seems too overkill, but it's the only thing I think I can get working.
      "/api": {
        target: "http://localhost:5000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};

export default config;
