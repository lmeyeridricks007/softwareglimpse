/**
 * Content-lifecycle store — browser-safe reads (no `node:fs`).
 * Disk persistence lives in `store-write.ts` for CLI/scripts only.
 *
 * Production promotions ship in `data/seo/content-lifecycle.json` and are
 * hydrated into memory on first read so sitemap / isEntityIndexable honor them.
 */

import bundledLifecycleJson from "../../../../data/seo/content-lifecycle.json";
import {
  CONTENT_LIFECYCLE_VERSION,
  lifecycleEntryKey,
  type ContentLifecycleEntry,
  type ContentLifecycleKind,
  type ContentLifecycleState,
  type ContentLifecycleStoreFile,
} from "./types";

const bundledDefault: ContentLifecycleStoreFile = {
  version:
    (bundledLifecycleJson as ContentLifecycleStoreFile).version ||
    CONTENT_LIFECYCLE_VERSION,
  updatedAt:
    (bundledLifecycleJson as ContentLifecycleStoreFile).updatedAt ||
    "2026-09-06T00:00:00.000Z",
  entries: {
    ...((bundledLifecycleJson as ContentLifecycleStoreFile).entries ?? {}),
  },
};

/** In-memory overlay for tests / same-process promote / disk hydrate. */
let memoryStore: ContentLifecycleStoreFile | null = null;

/** Sitemap / Node hydrate once-guard (set from store-write). */
let diskHydratedThisProcess = false;

export function resetContentLifecycleDiskHydration(): void {
  diskHydratedThisProcess = false;
}

export function markContentLifecycleDiskHydrated(): void {
  diskHydratedThisProcess = true;
}

export function isContentLifecycleDiskHydrated(): boolean {
  return diskHydratedThisProcess;
}

function cloneStore(store: ContentLifecycleStoreFile): ContentLifecycleStoreFile {
  return {
    version: store.version || CONTENT_LIFECYCLE_VERSION,
    updatedAt: store.updatedAt,
    entries: { ...(store.entries ?? {}) },
  };
}

function emptyStore(): ContentLifecycleStoreFile {
  return {
    version: CONTENT_LIFECYCLE_VERSION,
    updatedAt: new Date().toISOString(),
    entries: {},
  };
}

/**
 * Test helper — isolate from bundled promotions.
 * Sets an empty in-memory store (not merely clearing the cache pointer).
 */
export function resetContentLifecycleCache(): void {
  memoryStore = emptyStore();
  diskHydratedThisProcess = false;
}

export function loadContentLifecycleStore(): ContentLifecycleStoreFile {
  if (memoryStore) return memoryStore;
  memoryStore = cloneStore(bundledDefault);
  return memoryStore;
}

export function getLifecycleEntry(
  kind: ContentLifecycleKind,
  slug: string,
): ContentLifecycleEntry | null {
  const store = loadContentLifecycleStore();
  return store.entries[lifecycleEntryKey(kind, slug)] ?? null;
}

export function isLifecyclePromotedIndexable(
  kind: ContentLifecycleKind,
  slug: string,
): boolean {
  const entry = getLifecycleEntry(kind, slug);
  return entry?.lifecycle === "INDEXABLE" && entry.indexable === true;
}

export function getLifecycleOverrideState(
  kind: ContentLifecycleKind,
  slug: string,
): ContentLifecycleState | null {
  return getLifecycleEntry(kind, slug)?.lifecycle ?? null;
}

/**
 * Update in-memory lifecycle state (tests + same-process promote).
 * Call `persistContentLifecycleStore` from Node/CLI to write disk.
 */
export function upsertLifecycleEntry(
  entry: ContentLifecycleEntry,
): ContentLifecycleEntry {
  const store = loadContentLifecycleStore();
  const key = lifecycleEntryKey(entry.kind, entry.slug);
  const nextEntry: ContentLifecycleEntry = {
    ...entry,
    updatedAt: new Date().toISOString(),
  };
  memoryStore = {
    version: CONTENT_LIFECYCLE_VERSION,
    updatedAt: new Date().toISOString(),
    entries: {
      ...store.entries,
      [key]: nextEntry,
    },
  };
  return nextEntry;
}

/** Test / rollback helper (in-memory). */
export function removeLifecycleEntry(
  kind: ContentLifecycleKind,
  slug: string,
): void {
  const store = loadContentLifecycleStore();
  const key = lifecycleEntryKey(kind, slug);
  if (!(key in store.entries)) return;
  const rest = { ...store.entries };
  delete rest[key];
  memoryStore = {
    version: CONTENT_LIFECYCLE_VERSION,
    updatedAt: new Date().toISOString(),
    entries: rest,
  };
}

/** Snapshot current store for Node persistence. */
export function getContentLifecycleStoreSnapshot(): ContentLifecycleStoreFile {
  return loadContentLifecycleStore();
}

/** Apply a full store into memory (used after disk read in Node). */
export function replaceContentLifecycleStoreMemory(
  store: ContentLifecycleStoreFile,
): void {
  memoryStore = cloneStore(store);
}
