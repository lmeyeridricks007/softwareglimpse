import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  PriceObservationSchema,
  ProductPriceHistoryFileSchema,
  type PriceObservation,
  type ProductPriceHistoryFile,
} from "@/domain";

const HISTORY_ROOT = path.join(
  process.cwd(),
  "src/data/research/pricing-history",
);
const OBSERVATIONS_ROOT = path.join(HISTORY_ROOT, "observations");

function ensureObservationsDir(): void {
  if (!existsSync(OBSERVATIONS_ROOT)) {
    mkdirSync(OBSERVATIONS_ROOT, { recursive: true });
  }
}

function productFilePath(productId: string): string {
  return path.join(OBSERVATIONS_ROOT, `${productId}.json`);
}

export function getPriceHistoryObservationsRoot(): string {
  return OBSERVATIONS_ROOT;
}

export function listPriceHistoryProductIds(): string[] {
  if (!existsSync(OBSERVATIONS_ROOT)) return [];
  return readdirSync(OBSERVATIONS_ROOT, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".json"))
    .map((e) => e.name.replace(/\.json$/, ""))
    .sort();
}

export function loadProductPriceHistory(
  productId: string,
): ProductPriceHistoryFile {
  const filePath = productFilePath(productId);
  if (!existsSync(filePath)) {
    return { productId, observations: [] };
  }
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  return ProductPriceHistoryFileSchema.parse(raw);
}

/**
 * Persist full history file. Callers must never drop prior observations.
 */
export function saveProductPriceHistory(
  file: ProductPriceHistoryFile,
): void {
  ensureObservationsDir();
  const parsed = ProductPriceHistoryFileSchema.parse(file);
  const sorted = {
    ...parsed,
    observations: [...parsed.observations].sort((a, b) =>
      a.observedAt.localeCompare(b.observedAt),
    ),
  };
  writeFileSync(
    productFilePath(parsed.productId),
    `${JSON.stringify(sorted, null, 2)}\n`,
    "utf8",
  );
}

/**
 * Append observations that are not already present by id.
 * Never overwrites existing rows.
 */
export function appendPriceObservations(
  productId: string,
  incoming: PriceObservation[],
): { appended: PriceObservation[]; skippedExistingIds: string[] } {
  const file = loadProductPriceHistory(productId);
  const existingIds = new Set(file.observations.map((o) => o.id));
  const appended: PriceObservation[] = [];
  const skippedExistingIds: string[] = [];

  for (const raw of incoming) {
    const obs = PriceObservationSchema.parse({
      ...raw,
      productId,
    });
    if (existingIds.has(obs.id)) {
      skippedExistingIds.push(obs.id);
      continue;
    }
    file.observations.push(obs);
    existingIds.add(obs.id);
    appended.push(obs);
  }

  if (appended.length > 0) {
    saveProductPriceHistory(file);
  }

  return { appended, skippedExistingIds };
}

export function listAllPriceObservations(): PriceObservation[] {
  const out: PriceObservation[] = [];
  for (const productId of listPriceHistoryProductIds()) {
    out.push(...loadProductPriceHistory(productId).observations);
  }
  return out.sort((a, b) => b.observedAt.localeCompare(a.observedAt));
}
