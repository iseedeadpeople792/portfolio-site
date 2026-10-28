import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

// base "./" — чтобы сборка работала и на GitHub Pages в подпапке репозитория.
// Несколько страниц: портфолио и сайты проектов.
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        lasthit: resolve(root, "lasthit/index.html"),
        stats: resolve(root, "stats/index.html"),
      },
    },
  },
});
