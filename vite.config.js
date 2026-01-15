import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "translation-web-component.js",
      formats: ["es"],
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: /^lit/,
    },
  },
  server: {
    open: "/demo/index.html", // Point this to your demo/example page
  },
  esbuild: {
    // This allows the use of decorators like @property
    keepNames: true,
  },
});
