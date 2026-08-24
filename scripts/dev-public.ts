#!/usr/bin/env npx tsx
/**
 * Optional dev server modes — normal `npm run dev` shows ALL local content.
 *
 * Usage:
 *   npm run dev:public
 *   npm run dev:as-of -- --date=2026-09-20T08:00:00+02:00
 */
import { spawn } from "node:child_process";

type Mode = "public" | "as-of";

function parse(argv: string[], mode: Mode) {
  let date: string | undefined;

  for (const arg of argv) {
    if (arg.startsWith("--date=")) date = arg.slice("--date=".length);
  }

  return { mode, date };
}

const mode: Mode = process.argv[1] === "as-of" ? "as-of" : "public";
const { date } = parse(process.argv.slice(2), mode);

if (mode === "as-of" && !date) {
  console.error("dev:as-of requires --date=ISO (e.g. --date=2026-09-20T08:00:00+02:00)");
  process.exit(1);
}

const env = {
  ...process.env,
  PUBLICATION_PREVIEW: mode,
  ...(date ? { PUBLICATION_PREVIEW_AT: date, PREVIEW_SITE_AT: date } : {}),
};

console.info(
  mode === "public"
    ? "Starting next dev with production visibility (PUBLICATION_PREVIEW=public)"
    : `Starting next dev simulating production at ${date}`,
);

const child = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  env,
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
