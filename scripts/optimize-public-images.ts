/**
 * Compress oversized public raster assets (PNG/JPEG) in place for LCP/deploy weight.
 *
 * Uses `cwebp` when available for WebP siblings (keeps originals), and recompresses
 * PNG sources via `sips` max-dimension clamp so next/image has a leaner input.
 *
 * Usage:
 *   npx tsx scripts/optimize-public-images.ts
 *   npx tsx scripts/optimize-public-images.ts --dry-run
 *   npx tsx scripts/optimize-public-images.ts --min-bytes=800000 --limit=80
 *   npx tsx scripts/optimize-public-images.ts --dir=vendor-ui
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public");
const dryRun = process.argv.includes("--dry-run");
const minBytes = Number(
  process.argv.find((a) => a.startsWith("--min-bytes="))?.split("=")[1] ??
    800_000,
);
const limit = Number(
  process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 120,
);
const subdir = process.argv
  .find((a) => a.startsWith("--dir="))
  ?.split("=")[1];
const maxEdge = Number(
  process.argv.find((a) => a.startsWith("--max-edge="))?.split("=")[1] ?? 1600,
);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(png|jpe?g)$/i.test(name)) out.push(full);
  }
  return out;
}

function hasCwebp(): boolean {
  try {
    execFileSync("cwebp", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function optimizeFile(file: string, useWebp: boolean): {
  before: number;
  after: number;
  webp?: number;
} {
  const before = statSync(file).size;
  if (!dryRun) {
    const tmp = `${file}.sg-opt-tmp`;
    try {
      execFileSync("cp", [file, tmp], { stdio: "ignore" });
      // Cap longest edge — heroes display ~720–1200 CSS px.
      execFileSync("sips", ["-Z", String(maxEdge), tmp], { stdio: "ignore" });
      const resized = statSync(tmp).size;
      // sips PNG re-encode can grow files — keep original when larger.
      if (resized < before * 0.98) {
        execFileSync("mv", [tmp, file], { stdio: "ignore" });
      } else {
        execFileSync("rm", ["-f", tmp], { stdio: "ignore" });
      }
    } catch {
      try {
        execFileSync("rm", ["-f", `${file}.sg-opt-tmp`], { stdio: "ignore" });
      } catch {
        /* ignore */
      }
    }
    if (useWebp) {
      const webpPath = file.replace(/\.(png|jpe?g)$/i, ".webp");
      try {
        execFileSync(
          "cwebp",
          ["-q", "80", "-m", "6", file, "-o", webpPath],
          { stdio: "ignore" },
        );
      } catch {
        /* ignore */
      }
    }
  }
  const after = existsSync(file) ? statSync(file).size : before;
  const webpPath = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const webp = existsSync(webpPath) ? statSync(webpPath).size : undefined;
  return { before, after, webp };
}

function main() {
  if (!existsSync(ROOT)) {
    console.error("public/ missing");
    process.exit(1);
  }
  const scanRoot = subdir ? path.join(ROOT, subdir) : ROOT;
  if (!existsSync(scanRoot)) {
    console.error(`missing ${scanRoot}`);
    process.exit(1);
  }
  const useWebp = hasCwebp();
  const files = walk(scanRoot)
    .map((f) => ({ f, size: statSync(f).size }))
    .filter((x) => x.size >= minBytes)
    .sort((a, b) => b.size - a.size)
    .slice(0, limit);

  let saved = 0;
  const rows: string[] = [];
  for (const { f, size } of files) {
    const result = optimizeFile(f, useWebp);
    const delta = size - result.after;
    saved += Math.max(0, delta);
    const rel = path.relative(process.cwd(), f);
    rows.push(
      `${rel}\t${size}\t${result.after}\t${result.webp ?? "-"}\t${delta}`,
    );
    console.log(
      `${dryRun ? "[dry] " : ""}${rel}: ${(size / 1024).toFixed(0)}KB → ${(result.after / 1024).toFixed(0)}KB` +
        (result.webp ? ` (webp ${(result.webp / 1024).toFixed(0)}KB)` : ""),
    );
  }

  const reportDir = path.join(process.cwd(), "docs/performance");
  const reportPath = path.join(reportDir, "_image-optimize-last-run.tsv");
  if (!dryRun) {
    mkdirSync(reportDir, { recursive: true });
    writeFileSync(
      reportPath,
      ["path\tbefore\tafter\twebp\tsaved", ...rows].join("\n") + "\n",
      "utf8",
    );
  }
  console.log(
    `\nProcessed ${files.length} files. Approx PNG bytes saved: ${(saved / 1024 / 1024).toFixed(1)}MB. cwebp=${useWebp}`,
  );
}

main();
