#!/usr/bin/env node
/**
 * Upload site media from public/ to Vercel Blob (public store).
 *
 * Usage:
 *   node --env-file=.env.local scripts/upload-public-to-blob.mjs
 *   npm run media:upload-blob
 *
 * Env:
 *   BLOB_READ_WRITE_TOKEN (required)
 *   BLOB_CONCURRENCY (optional, default 8)
 *   BLOB_DIRS (optional, comma-separated; default = site media packs)
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");

const DEFAULT_DIRS = [
  "guides",
  "software",
  "capabilities",
  "use-cases",
  "vendor-ui",
  "industries",
  "features",
  "resources",
  "requirements",
  "for",
  "brands",
  "categories",
  "og",
];

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN?.replace(/^["']|["']$/g, "");
if (!TOKEN) {
  console.error("Missing BLOB_READ_WRITE_TOKEN (set in .env.local).");
  process.exit(1);
}

const CONCURRENCY = Math.max(
  1,
  Number.parseInt(process.env.BLOB_CONCURRENCY ?? "8", 10) || 8,
);

const dirs = (process.env.BLOB_DIRS?.split(",") ?? DEFAULT_DIRS)
  .map((d) => d.trim())
  .filter(Boolean);

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".avif":
      return "image/avif";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".json":
      return "application/json";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

async function mapPool(items, limit, worker) {
  let i = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i;
      i += 1;
      await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
}

const files = [];
for (const d of dirs) {
  const abs = path.join(PUBLIC, d);
  const found = await walk(abs);
  console.log(`${d}: ${found.length} files`);
  files.push(...found);
}

console.log(`\nUploading ${files.length} files (concurrency ${CONCURRENCY})…\n`);

let uploaded = 0;
let failed = 0;
let bytes = 0;
const errors = [];
const started = Date.now();

await mapPool(files, CONCURRENCY, async (filePath) => {
  const pathname = path.relative(PUBLIC, filePath).split(path.sep).join("/");
  try {
    const buffer = await readFile(filePath);
    const size = buffer.length;
    await put(pathname, buffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      multipart: size > 4 * 1024 * 1024,
      contentType: contentType(filePath),
      token: TOKEN,
      cacheControlMaxAge: 60 * 60 * 24 * 30,
    });
    uploaded += 1;
    bytes += size;
  } catch (err) {
    failed += 1;
    errors.push(`${pathname}: ${err?.message ?? err}`);
  }
  const done = uploaded + failed;
  if (done % 25 === 0 || done === files.length) {
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    const elapsed = ((Date.now() - started) / 1000).toFixed(0);
    console.log(
      `${done}/${files.length} · ok ${uploaded} · fail ${failed} · ${mb} MB · ${elapsed}s`,
    );
  }
});

console.log(`\nDone. uploaded=${uploaded} failed=${failed}`);
if (errors.length) {
  console.log("\nFirst errors:");
  for (const e of errors.slice(0, 20)) console.log(" -", e);
  process.exitCode = 1;
} else {
  const host =
    process.env.BLOB_PUBLIC_HOST?.replace(/^["']|["']$/g, "") ||
    "https://kxxfqtgoxjcif3x5.public.blob.vercel-storage.com";
  console.log(`\nSample URL:\n  ${host}/guides/…`);
}
