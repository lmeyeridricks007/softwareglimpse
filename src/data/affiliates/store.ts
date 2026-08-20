import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import {
  AffiliateDestinationSchema,
  AffiliateProgrammeSchema,
  PromotionSchema,
  type AffiliateDestination,
  type AffiliateProgramme,
  type Promotion,
} from "@/domain";

function affiliatesRoot(): string {
  return (
    process.env.SG_AFFILIATES_ROOT ??
    path.join(process.cwd(), "src/data/affiliates")
  );
}

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

function writeJson(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readJsonArray(filePath: string): unknown[] {
  if (!existsSync(filePath)) return [];
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  return Array.isArray(raw) ? raw : [];
}

function programmesPath(): string {
  return path.join(affiliatesRoot(), "programmes.json");
}

function destinationsPath(): string {
  return path.join(affiliatesRoot(), "destinations.json");
}

function promotionsPath(): string {
  return path.join(affiliatesRoot(), "promotions.json");
}

let programmeCache: AffiliateProgramme[] | null = null;
let destinationCache: AffiliateDestination[] | null = null;
let promotionCache: Promotion[] | null = null;

export function __resetAffiliateCaches(): void {
  programmeCache = null;
  destinationCache = null;
  promotionCache = null;
}

export function getAffiliatesRoot(): string {
  return affiliatesRoot();
}

export function listAffiliateProgrammes(): AffiliateProgramme[] {
  if (programmeCache) return programmeCache;
  programmeCache = readJsonArray(programmesPath()).map((item) =>
    AffiliateProgrammeSchema.parse(item),
  );
  return programmeCache;
}

export function listAffiliateDestinations(): AffiliateDestination[] {
  if (destinationCache) return destinationCache;
  destinationCache = readJsonArray(destinationsPath()).map((item) =>
    AffiliateDestinationSchema.parse(item),
  );
  return destinationCache;
}

export function listPromotions(): Promotion[] {
  if (promotionCache) return promotionCache;
  promotionCache = readJsonArray(promotionsPath()).map((item) =>
    PromotionSchema.parse(item),
  );
  return promotionCache;
}

export function getAffiliateProgramme(
  id: string,
): AffiliateProgramme | undefined {
  return listAffiliateProgrammes().find((p) => p.id === id);
}

export function getAffiliateDestination(
  id: string,
): AffiliateDestination | undefined {
  return listAffiliateDestinations().find((d) => d.id === id);
}

export function getPromotion(id: string): Promotion | undefined {
  return listPromotions().find((p) => p.id === id);
}

export function listDestinationsForProduct(
  productSlug: string,
): AffiliateDestination[] {
  return listAffiliateDestinations().filter((d) => d.productSlug === productSlug);
}

export function listPromotionsForProduct(productSlug: string): Promotion[] {
  return listPromotions().filter((p) => p.productSlug === productSlug);
}

export function listProgrammesForProduct(
  productSlug: string,
): AffiliateProgramme[] {
  return listAffiliateProgrammes().filter((p) =>
    p.productSlugs.includes(productSlug),
  );
}

export function saveAffiliateProgrammes(
  programmes: AffiliateProgramme[],
): void {
  const parsed = programmes.map((p) => AffiliateProgrammeSchema.parse(p));
  writeJson(programmesPath(), parsed);
  programmeCache = parsed;
}

export function saveAffiliateDestinations(
  destinations: AffiliateDestination[],
): void {
  const parsed = destinations.map((d) => AffiliateDestinationSchema.parse(d));
  writeJson(destinationsPath(), parsed);
  destinationCache = parsed;
}

export function savePromotions(promotions: Promotion[]): void {
  const parsed = promotions.map((p) => PromotionSchema.parse(p));
  writeJson(promotionsPath(), parsed);
  promotionCache = parsed;
}

export function upsertAffiliateProgramme(
  programme: AffiliateProgramme,
): AffiliateProgramme {
  const parsed = AffiliateProgrammeSchema.parse(programme);
  const all = listAffiliateProgrammes().filter((p) => p.id !== parsed.id);
  all.push(parsed);
  saveAffiliateProgrammes(all);
  return parsed;
}

export function upsertAffiliateDestination(
  destination: AffiliateDestination,
): AffiliateDestination {
  const parsed = AffiliateDestinationSchema.parse(destination);
  const all = listAffiliateDestinations().filter((d) => d.id !== parsed.id);
  if (parsed.isDefault) {
    for (const item of all) {
      if (item.productSlug === parsed.productSlug && item.isDefault) {
        item.isDefault = false;
        item.updatedAt = parsed.updatedAt;
      }
    }
  }
  all.push(parsed);
  saveAffiliateDestinations(all);
  return parsed;
}

export function upsertPromotion(promotion: Promotion): Promotion {
  const parsed = PromotionSchema.parse(promotion);
  const all = listPromotions().filter((p) => p.id !== parsed.id);
  if (parsed.isPrimary) {
    for (const item of all) {
      if (item.productSlug === parsed.productSlug && item.isPrimary) {
        item.isPrimary = false;
        item.updatedAt = parsed.updatedAt;
      }
    }
  }
  all.push(parsed);
  savePromotions(all);
  return parsed;
}
