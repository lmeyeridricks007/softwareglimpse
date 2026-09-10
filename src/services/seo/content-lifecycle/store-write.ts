/**
 * Node-only persistence for content-lifecycle promotions.
 * Do not import from client components or shared quality-gates paths.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  getContentLifecycleStoreSnapshot,
  isContentLifecycleDiskHydrated,
  loadContentLifecycleStore,
  markContentLifecycleDiskHydrated,
  replaceContentLifecycleStoreMemory,
  upsertLifecycleEntry,
} from "./store";
import {
  CONTENT_LIFECYCLE_VERSION,
  type ContentLifecycleEntry,
  type ContentLifecycleStoreFile,
} from "./types";

const DEFAULT_RELATIVE = path.join("data", "seo", "content-lifecycle.json");

function storePath(): string {
  return (
    process.env.SG_CONTENT_LIFECYCLE_PATH ??
    path.join(process.cwd(), DEFAULT_RELATIVE)
  );
}

/**
 * Load disk once per process for sitemap / read paths.
 * Subsequent calls keep the in-memory overlay (tests / same-process promote).
 * Pass `{ force: true }` when CLI must re-read after an external write.
 */
export function ensureContentLifecycleHydratedFromDisk(
  options: { force?: boolean } = {},
): ContentLifecycleStoreFile {
  if (isContentLifecycleDiskHydrated() && !options.force) {
    return loadContentLifecycleStore();
  }
  const store = loadContentLifecycleStoreFromDisk();
  markContentLifecycleDiskHydrated();
  return store;
}

/** Load disk file into memory (CLI / scripts). */
export function loadContentLifecycleStoreFromDisk(): ContentLifecycleStoreFile {
  const filePath = storePath();
  if (!existsSync(filePath)) {
    // Do not wipe in-memory upserts / bundled hydrate when the path is missing
    // (tests often point SG_CONTENT_LIFECYCLE_PATH at an empty temp file).
    return loadContentLifecycleStore();
  }
  try {
    const raw = JSON.parse(
      readFileSync(filePath, "utf8"),
    ) as ContentLifecycleStoreFile;
    const store: ContentLifecycleStoreFile = {
      version: raw.version || CONTENT_LIFECYCLE_VERSION,
      updatedAt: raw.updatedAt || new Date().toISOString(),
      entries: raw.entries ?? {},
    };
    replaceContentLifecycleStoreMemory(store);
    return store;
  } catch {
    return loadContentLifecycleStore();
  }
}

export function persistContentLifecycleStore(): ContentLifecycleStoreFile {
  const filePath = storePath();
  const snapshot = getContentLifecycleStoreSnapshot();
  const next: ContentLifecycleStoreFile = {
    version: CONTENT_LIFECYCLE_VERSION,
    updatedAt: new Date().toISOString(),
    entries: snapshot.entries,
  };
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  replaceContentLifecycleStoreMemory(next);
  return next;
}

/** Upsert + persist to disk (CLI promotion path). */
export function upsertAndPersistLifecycleEntry(
  entry: ContentLifecycleEntry,
): ContentLifecycleEntry {
  loadContentLifecycleStoreFromDisk();
  const saved = upsertLifecycleEntry(entry);
  persistContentLifecycleStore();
  return saved;
}
