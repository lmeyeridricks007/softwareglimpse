import fs from "node:fs";
import path from "node:path";

/**
 * Persist known discovery / search hits so we do not rediscover the same
 * YouTube video every run. Does not invent URLs.
 */

export type SearchMemoryEntry = {
  key: string;
  provider?: string;
  providerId?: string;
  sourceUrl: string;
  title?: string;
  productSlug?: string;
  firstSeenAt: string;
  lastSeenAt: string;
  timesSeen: number;
};

export type AssetSearchMemory = {
  updatedAt: string;
  entries: SearchMemoryEntry[];
};

const MEMORY_PATH = path.join(
  process.cwd(),
  "data",
  "content-assets",
  "search-memory.json",
);

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    for (const key of [...u.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|ref|mc_)/i.test(key)) {
        u.searchParams.delete(key);
      }
    }
    return u.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

export function memoryKey(input: {
  providerId?: string;
  provider?: string;
  sourceUrl: string;
}): string {
  if (input.providerId && input.provider) {
    return `${input.provider}:${input.providerId}`.toLowerCase();
  }
  return `url:${normalizeUrl(input.sourceUrl)}`;
}

export function loadSearchMemory(): AssetSearchMemory {
  if (!fs.existsSync(MEMORY_PATH)) {
    return { updatedAt: new Date(0).toISOString(), entries: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(MEMORY_PATH, "utf8")) as AssetSearchMemory;
  } catch {
    return { updatedAt: new Date(0).toISOString(), entries: [] };
  }
}

export function saveSearchMemory(memory: AssetSearchMemory): string {
  fs.mkdirSync(path.dirname(MEMORY_PATH), { recursive: true });
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2) + "\n", "utf8");
  return MEMORY_PATH;
}

export function rememberAsset(
  memory: AssetSearchMemory,
  input: {
    sourceUrl: string;
    provider?: string;
    providerId?: string;
    title?: string;
    productSlug?: string;
    at?: string;
  },
): { memory: AssetSearchMemory; isNew: boolean } {
  const at = input.at ?? new Date().toISOString();
  const key = memoryKey(input);
  const existing = memory.entries.find((e) => e.key === key);
  if (existing) {
    existing.lastSeenAt = at;
    existing.timesSeen += 1;
    if (input.title) existing.title = input.title;
    return {
      memory: { ...memory, updatedAt: at, entries: [...memory.entries] },
      isNew: false,
    };
  }
  const entry: SearchMemoryEntry = {
    key,
    provider: input.provider,
    providerId: input.providerId,
    sourceUrl: input.sourceUrl,
    title: input.title,
    productSlug: input.productSlug,
    firstSeenAt: at,
    lastSeenAt: at,
    timesSeen: 1,
  };
  return {
    memory: {
      updatedAt: at,
      entries: [...memory.entries, entry],
    },
    isNew: true,
  };
}

export function isKnownInMemory(
  memory: AssetSearchMemory,
  input: { sourceUrl: string; provider?: string; providerId?: string },
): boolean {
  const key = memoryKey(input);
  return memory.entries.some((e) => e.key === key);
}

export function getSearchMemoryPath(): string {
  return MEMORY_PATH;
}
