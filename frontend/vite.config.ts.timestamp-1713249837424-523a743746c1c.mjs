// vite.config.ts
import { sveltekit } from "file:///home/iamkneel/Documents/programming/websites/spiketracker/node_modules/.pnpm/@sveltejs+kit@2.5.5_@sveltejs+vite-plugin-svelte@3.1.0_svelte@4.2.14_vite@5.2.8/node_modules/@sveltejs/kit/src/exports/vite/index.js";
var config = {
  plugins: [sveltekit()],
  server: {
    proxy: {
      // Vite's proxy option only works in dev mode.
      // Sooner or later, we're going to have to figure out how to do this in production.
      // NGINX seems too overkill, but it's the only thing I think I can get working.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9pYW1rbmVlbC9Eb2N1bWVudHMvcHJvZ3JhbW1pbmcvd2Vic2l0ZXMvc3Bpa2V0cmFja2VyL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9pYW1rbmVlbC9Eb2N1bWVudHMvcHJvZ3JhbW1pbmcvd2Vic2l0ZXMvc3Bpa2V0cmFja2VyL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2lhbWtuZWVsL0RvY3VtZW50cy9wcm9ncmFtbWluZy93ZWJzaXRlcy9zcGlrZXRyYWNrZXIvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tIFwiQHN2ZWx0ZWpzL2tpdC92aXRlXCI7XG5pbXBvcnQgdHlwZSB7IFVzZXJDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuXG5jb25zdCBjb25maWc6IFVzZXJDb25maWcgPSB7XG4gIHBsdWdpbnM6IFtzdmVsdGVraXQoKV0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAvLyBWaXRlJ3MgcHJveHkgb3B0aW9uIG9ubHkgd29ya3MgaW4gZGV2IG1vZGUuXG4gICAgICAvLyBTb29uZXIgb3IgbGF0ZXIsIHdlJ3JlIGdvaW5nIHRvIGhhdmUgdG8gZmlndXJlIG91dCBob3cgdG8gZG8gdGhpcyBpbiBwcm9kdWN0aW9uLlxuICAgICAgLy8gTkdJTlggc2VlbXMgdG9vIG92ZXJraWxsLCBidXQgaXQncyB0aGUgb25seSB0aGluZyBJIHRoaW5rIEkgY2FuIGdldCB3b3JraW5nLlxuICAgICAgXCIvYXBpXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMFwiLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlwiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlgsU0FBUyxpQkFBaUI7QUFHclosSUFBTSxTQUFxQjtBQUFBLEVBQ3pCLFNBQVMsQ0FBQyxVQUFVLENBQUM7QUFBQSxFQUNyQixRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFJTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsTUFDOUM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
