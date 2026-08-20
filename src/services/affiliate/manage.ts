import { randomUUID } from "node:crypto";
import type {
  AffiliateDestination,
  AffiliateDestinationType,
  AffiliateNetwork,
  AffiliateProgramme,
  Promotion,
  PromotionType,
  PromotionScope,
} from "@/domain";
import { getSoftwareBySlug } from "@/data";
import {
  getAffiliateDestination,
  getAffiliateProgramme,
  getPromotion,
  listAffiliateDestinations,
  listAffiliateProgrammes,
  listPromotions,
  listDestinationsForProduct,
  listProgrammesForProduct,
  listPromotionsForProduct,
  upsertAffiliateDestination,
  upsertAffiliateProgramme,
  upsertPromotion,
  __resetAffiliateCaches,
} from "@/data/affiliates/store";
import { recordChangeEvent } from "@/services/publishing/change-events";
import {
  requestRevalidation,
  resolveRevalidationTags,
} from "@/services/publishing/revalidation";
import { affiliateAffectedTags } from "./resolve-cta";
import { validateAffiliateUrl } from "./url-validation";
import {
  derivePromotionEffectiveStatus,
  selectPrimaryPromotion,
  validatePromotionConflicts,
} from "./promotions";

function nowIso(): string {
  return new Date().toISOString();
}

function emitAffiliateEvent(
  changeType: string,
  entityType: string,
  entityId: string,
  details?: Record<string, unknown>,
): void {
  const event = recordChangeEvent({
    entityType,
    entityId,
    domain: "affiliate",
    changeType,
    source: "affiliate-management",
    severity: "medium",
    details,
  });
  const tags = new Set<string>(resolveRevalidationTags(event));
  if (details?.productSlug && typeof details.productSlug === "string") {
    for (const tag of affiliateAffectedTags(details.productSlug)) {
      tags.add(tag);
    }
  }
  requestRevalidation([...tags]);
}

export type SetDestinationInput = {
  productSlug: string;
  url: string;
  destinationType?: AffiliateDestinationType;
  isDefault?: boolean;
  programmeId?: string;
  programmeName?: string;
  network?: AffiliateNetwork;
  notes?: string;
};

export type SetDestinationResult =
  | {
      ok: true;
      destination: AffiliateDestination;
      programme: AffiliateProgramme;
      warnings: string[];
    }
  | { ok: false; code: string; message: string };

export function setAffiliateDestination(
  input: SetDestinationInput,
): SetDestinationResult {
  const product = getSoftwareBySlug(input.productSlug, {
    includeUnpublished: true,
  });
  if (!product) {
    return {
      ok: false,
      code: "UNKNOWN_PRODUCT",
      message: `Unknown product: ${input.productSlug}`,
    };
  }

  const validated = validateAffiliateUrl(input.url);
  if (!validated.ok) {
    return {
      ok: false,
      code: validated.code,
      message: validated.message,
    };
  }

  const destinationType = input.destinationType ?? "homepage";
  const isDefault = input.isDefault ?? true;
  const warnings: string[] = [];
  const ts = nowIso();

  let programme: AffiliateProgramme | undefined = input.programmeId
    ? getAffiliateProgramme(input.programmeId)
    : listProgrammesForProduct(input.productSlug).find(
        (p) => p.status === "active" || p.status === "pending",
      );

  if (!programme) {
    programme = upsertAffiliateProgramme({
      id: `prog-${input.productSlug}`,
      name: input.programmeName ?? `${product.name} Affiliate`,
      network: input.network ?? "other",
      status: "active",
      productSlugs: [input.productSlug],
      notes: input.notes,
      createdAt: ts,
      updatedAt: ts,
    });
    emitAffiliateEvent(
      "affiliate_programme_status_changed",
      "affiliate-programme",
      programme.id,
      { productSlug: input.productSlug, status: programme.status },
    );
  } else {
    const productSlugs = programme.productSlugs.includes(input.productSlug)
      ? programme.productSlugs
      : [...programme.productSlugs, input.productSlug];
    programme = upsertAffiliateProgramme({
      ...programme,
      status: programme.status === "inactive" ? "active" : programme.status,
      productSlugs,
      network: input.network ?? programme.network,
      updatedAt: ts,
    });
  }

  const existing = listDestinationsForProduct(input.productSlug).find(
    (d) =>
      d.destinationType === destinationType &&
      d.programmeId === programme!.id,
  );

  const destination = upsertAffiliateDestination({
    id: existing?.id ?? `dest-${input.productSlug}-${destinationType}`,
    programmeId: programme.id,
    productSlug: input.productSlug,
    destinationType,
    url: validated.url,
    status: "active",
    isDefault,
    notes: input.notes,
    createdAt: existing?.createdAt ?? ts,
    updatedAt: ts,
  });

  emitAffiliateEvent(
    existing
      ? "affiliate_destination_updated"
      : "affiliate_destination_created",
    "affiliate-destination",
    destination.id,
    { productSlug: input.productSlug, destinationType },
  );

  if (
    listDestinationsForProduct(input.productSlug).filter((d) => d.isDefault)
      .length > 1
  ) {
    warnings.push("MULTIPLE_DEFAULT_DESTINATIONS");
  }

  return { ok: true, destination, programme, warnings };
}

export function disableAffiliateDestination(id: string): {
  ok: boolean;
  message: string;
} {
  const dest = getAffiliateDestination(id);
  if (!dest) return { ok: false, message: `Unknown destination: ${id}` };
  const updated = upsertAffiliateDestination({
    ...dest,
    status: "inactive",
    isDefault: false,
    updatedAt: nowIso(),
  });
  emitAffiliateEvent(
    "affiliate_destination_disabled",
    "affiliate-destination",
    updated.id,
    { productSlug: updated.productSlug },
  );
  return { ok: true, message: `Disabled ${id}` };
}

export type AddPromotionInput = {
  productSlug: string;
  headline: string;
  name?: string;
  description?: string;
  promotionType?: PromotionType;
  scope?: PromotionScope;
  value?: number;
  currency?: string;
  promoCode?: string;
  codeRequired?: boolean;
  startsAt?: string;
  endsAt?: string;
  noExpiry?: boolean;
  destinationId?: string;
  programmeId?: string;
  terms?: string[];
  termsUrl?: string;
  source?: string;
  verifiedAt?: string;
  isPrimary?: boolean;
  priority?: number;
  activate?: boolean;
};

export type AddPromotionResult =
  | { ok: true; promotion: Promotion; warnings: string[] }
  | { ok: false; code: string; message: string };

export function addPromotion(input: AddPromotionInput): AddPromotionResult {
  const product = getSoftwareBySlug(input.productSlug, {
    includeUnpublished: true,
  });
  if (!product) {
    return {
      ok: false,
      code: "UNKNOWN_PRODUCT",
      message: `Unknown product: ${input.productSlug}`,
    };
  }

  if (input.destinationId) {
    const dest = getAffiliateDestination(input.destinationId);
    if (!dest) {
      return {
        ok: false,
        code: "UNKNOWN_DESTINATION",
        message: `Unknown destination: ${input.destinationId}`,
      };
    }
    if (dest.productSlug !== input.productSlug) {
      return {
        ok: false,
        code: "DESTINATION_PRODUCT_MISMATCH",
        message: "Promotion destination belongs to another product",
      };
    }
    if (dest.status !== "active") {
      return {
        ok: false,
        code: "INACTIVE_DESTINATION",
        message: "Promotion destination is inactive",
      };
    }
  }

  if (input.scope === "exclusive" && !input.source && !input.verifiedAt) {
    return {
      ok: false,
      code: "EXCLUSIVE_UNVERIFIED",
      message: "Exclusive promotions require --source or --verified-at",
    };
  }

  const ts = nowIso();
  const startsAt = input.startsAt;
  const endsAt = input.noExpiry ? undefined : input.endsAt;
  let status: Promotion["status"] = input.activate === false ? "draft" : "active";
  if (startsAt && Date.parse(startsAt) > Date.now()) status = "scheduled";

  const promotion = upsertPromotion({
    id: `promo-${input.productSlug}-${randomUUID().slice(0, 8)}`,
    productSlug: input.productSlug,
    programmeId:
      input.programmeId ??
      listProgrammesForProduct(input.productSlug)[0]?.id,
    name: input.name ?? input.headline,
    headline: input.headline,
    description: input.description,
    promoCode: input.promoCode,
    codeRequired: input.codeRequired ?? false,
    promotionType: input.promotionType ?? "other",
    scope: input.scope ?? "affiliate",
    value: input.value,
    currency: input.currency,
    startsAt,
    endsAt,
    noExpiry: input.noExpiry ?? !endsAt,
    status,
    isPrimary: input.isPrimary ?? true,
    priority: input.priority ?? 100,
    destinationId: input.destinationId,
    terms: input.terms ?? [],
    termsUrl: input.termsUrl,
    source: input.source ?? "manual-cli",
    verifiedAt: input.verifiedAt ?? ts,
    createdAt: ts,
    updatedAt: ts,
  });

  const warnings = validatePromotionConflicts([
    ...listPromotions().filter((p) => p.id !== promotion.id),
    promotion,
  ]).map((i) => i.code);

  emitAffiliateEvent(
    status === "scheduled" ? "promotion_created" : "promotion_activated",
    "promotion",
    promotion.id,
    { productSlug: input.productSlug, status },
  );

  return { ok: true, promotion, warnings };
}

export function disablePromotion(id: string): {
  ok: boolean;
  message: string;
} {
  const promo = getPromotion(id);
  if (!promo) return { ok: false, message: `Unknown promotion: ${id}` };
  upsertPromotion({
    ...promo,
    status: "disabled",
    isPrimary: false,
    updatedAt: nowIso(),
  });
  emitAffiliateEvent("promotion_disabled", "promotion", id, {
    productSlug: promo.productSlug,
  });
  return { ok: true, message: `Disabled ${id}` };
}

export type ProductAffiliateStatus = {
  productSlug: string;
  productName: string;
  programme: AffiliateProgramme | null;
  status: "ACTIVE" | "PENDING" | "INACTIVE" | "NONE";
  destinations: AffiliateDestination[];
  defaultDestination: AffiliateDestination | null;
  activePromotion: Promotion | null;
  scheduledPromotions: Promotion[];
  expiredPromotions: Promotion[];
  fallbackOfficialUrl: string | null;
};

export function getProductAffiliateStatus(
  productSlug: string,
  now: Date = new Date(),
): ProductAffiliateStatus | null {
  const product = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  if (!product) return null;

  const programmes = listProgrammesForProduct(productSlug);
  const programme =
    programmes.find((p) => p.status === "active") ??
    programmes[0] ??
    null;
  const destinations = listDestinationsForProduct(productSlug);
  const promotions = listPromotionsForProduct(productSlug);

  let status: ProductAffiliateStatus["status"] = "NONE";
  if (programme?.status === "active" && destinations.some((d) => d.status === "active")) {
    status = "ACTIVE";
  } else if (programme?.status === "pending") {
    status = "PENDING";
  } else if (programme && programme.status !== "active") {
    status = "INACTIVE";
  }

  return {
    productSlug,
    productName: product.name,
    programme,
    status,
    destinations,
    defaultDestination:
      destinations.find((d) => d.isDefault && d.status === "active") ??
      destinations.find((d) => d.status === "active") ??
      null,
    activePromotion: selectPrimaryPromotion(promotions, now),
    scheduledPromotions: promotions.filter(
      (p) => derivePromotionEffectiveStatus(p, now) === "scheduled",
    ),
    expiredPromotions: promotions.filter(
      (p) => derivePromotionEffectiveStatus(p, now) === "expired",
    ),
    fallbackOfficialUrl:
      product.affiliate.destinationUrl || product.website || null,
  };
}

export function listAffiliateProductStatuses(now: Date = new Date()): {
  productSlug: string;
  productName: string;
  status: ProductAffiliateStatus["status"];
  defaultLabel: string;
  promotionLabel: string;
}[] {
  const slugs = new Set<string>();
  for (const p of listAffiliateProgrammes()) {
    for (const s of p.productSlugs) slugs.add(s);
  }
  for (const d of listAffiliateDestinations()) slugs.add(d.productSlug);

  // Also include published software with official-only for coverage tables
  // — callers that want full catalogue should pass through coverage report.

  const rows = [];
  for (const slug of [...slugs].sort()) {
    const status = getProductAffiliateStatus(slug, now);
    if (!status) continue;
    rows.push({
      productSlug: status.productSlug,
      productName: status.productName,
      status: status.status,
      defaultLabel: status.defaultDestination
        ? status.defaultDestination.destinationType
        : status.fallbackOfficialUrl
          ? "Official"
          : "-",
      promotionLabel: status.activePromotion?.headline ?? "-",
    });
  }
  return rows;
}

export { __resetAffiliateCaches };
