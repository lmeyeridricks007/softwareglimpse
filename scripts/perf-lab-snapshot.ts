/**
 * Lab transfer snapshot for representative routes (curl timings + HTML size).
 * Requires a running `next start` (or preview) on BASE_URL.
 *
 * Usage:
 *   BASE_URL=http://127.0.0.1:3000 npx tsx scripts/perf-lab-snapshot.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { REPRESENTATIVE_ROUTES } from "../src/performance/budgets";

const base = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(
  /\/$/,
  "",
);

type Row = {
  label: string;
  path: string;
  family: string;
  status: number;
  ttfbMs: number;
  totalMs: number;
  htmlBytes: number;
  approxDomNodes: number;
};

async function measure(route: (typeof REPRESENTATIVE_ROUTES)[number]): Promise<Row> {
  const url = `${base}${route.path}`;
  const started = performance.now();
  const res = await fetch(url, {
    headers: { Accept: "text/html", "User-Agent": "SoftwareGlimpse-perf-lab/1.0" },
  });
  const ttfbMs = performance.now() - started;
  const buf = Buffer.from(await res.arrayBuffer());
  const totalMs = performance.now() - started;
  const html = buf.toString("utf8");
  // Cheap DOM proxy: count opening tags (not a browser DOM).
  const approxDomNodes = (html.match(/<[a-zA-Z][^>]*>/g) ?? []).length;
  return {
    label: route.label,
    path: route.path,
    family: route.family,
    status: res.status,
    ttfbMs: Math.round(ttfbMs),
    totalMs: Math.round(totalMs),
    htmlBytes: buf.byteLength,
    approxDomNodes,
  };
}

async function main() {
  const rows: Row[] = [];
  for (const route of REPRESENTATIVE_ROUTES) {
    try {
      const row = await measure(route);
      rows.push(row);
      console.log(
        `${row.status} ${row.label.padEnd(24)} TTFB ${String(row.ttfbMs).padStart(5)}ms  HTML ${(row.htmlBytes / 1024).toFixed(0)}KB  ~nodes ${row.approxDomNodes}`,
      );
    } catch (err) {
      console.error(`FAIL ${route.path}`, err);
      rows.push({
        label: route.label,
        path: route.path,
        family: route.family,
        status: 0,
        ttfbMs: -1,
        totalMs: -1,
        htmlBytes: 0,
        approxDomNodes: 0,
      });
    }
  }

  const outDir = path.join(process.cwd(), "docs/performance");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "_lab-snapshot-last-run.json");
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        baseUrl: base,
        note: "Lab TTFB/HTML only — not field CWV. Pair with Chrome UX / RUM.",
        rows,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`\nWrote ${outPath}`);
}

main();
