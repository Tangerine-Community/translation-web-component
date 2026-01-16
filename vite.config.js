import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// This replicates __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.js"),
      name: "TangerineTranslation",
      fileName: "translation-web-component",
      formats: ["es"], // Modern browsers use ES modules
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
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
