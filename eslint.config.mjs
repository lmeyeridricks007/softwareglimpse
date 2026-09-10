import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Non-production scratch / backups / caches (not app source):
    "tmp/**",
    "scripts/_*.ts",
    "scripts/_*/**",
    "coverage/**",
    "data/seo/batches/**",
    "data/seo/guide-enrichment-overlays/**",
    "data/seo/compare-enrichment-overlays/**",
    "data/seo/software-enrichment-overlays/**",
    "src/data/generated/**",
    "docs/migration/data/**",
  ]),
]);

export default eslintConfig;
