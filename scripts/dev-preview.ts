#!/usr/bin/env npx tsx
/**
 * @deprecated Use `npm run dev:public` or `npm run dev:as-of` instead.
 * Normal `npm run dev` already shows all local content.
 */
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
let mode = "public";
let date: string | undefined;

for (const arg of args) {
  if (arg.startsWith("--mode=")) mode = arg.slice("--mode=".length);
  if (arg.startsWith("--date=")) date = arg.slice("--date=".length);
}

console.warn(
  "dev:preview is deprecated. Use npm run dev (all content) or npm run dev:public / dev:as-of",
);

const env = {
  ...process.env,
  PUBLICATION_PREVIEW: mode === "all" ? "public" : mode,
  ...(date ? { PUBLICATION_PREVIEW_AT: date, PREVIEW_SITE_AT: date } : {}),
};

const child = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  env,
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
