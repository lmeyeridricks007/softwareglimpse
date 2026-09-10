import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.join(root, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // Catalogue / hub / sitemap suites are CPU-heavy; parallel workers under
    // full-suite load previously timed out healthy tests at 15–60s.
    testTimeout: 180_000,
    hookTimeout: 180_000,
    pool: "forks",
    maxWorkers: 4,
  },
});