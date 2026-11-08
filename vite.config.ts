import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    // The sandbox proxies the dev server through a generated *.e2b.app host.
    // Without this the preview iframe is rejected with a 403.
    allowedHosts: [".e2b.app", ".arena.ai", "localhost"],
    cors: true,
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: [".e2b.app", ".arena.ai", "localhost"],
  },
});
