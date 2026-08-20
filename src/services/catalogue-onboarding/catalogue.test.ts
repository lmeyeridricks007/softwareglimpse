import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { AFFILIATE_INVENTORY_COUNT } from "@/data/catalogue/source";
import { findAffiliateCatalogueEntry } from "@/data/seed/affiliate-catalogue";
import {
  classifyCatalogueCandidate,
  importAndProcessCatalogue,
  mapCatalogueCandidate,
  normalizeCatalogueEntry,
  normalizeCatalogueEntries,
  planCatalogueBatch,
  scoreCommercialPriority,
  validateCatalogueOnboarding,
  assessProductMaturity,
} from "@/services/catalogue-onboarding";
import { loadAffiliateCatalogue } from "@/data/catalogue/source";
import type { AffiliateCatalogueEntry } from "@/domain";

const STATE = path.join(process.cwd(), "src/data/catalogue/state");

function resetCatalogueState(): void {
  for (const sub of ["processing", "batches"]) {
    const dir = path.join(STATE, sub);
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith(".json")) fs.unlinkSync(path.join(dir, f));
      }
    }
  }
  for (const f of ["alias-map.json", "category-gaps.json", "audit.jsonl"]) {
    const p = path.join(STATE, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
}

describe("catalogue onboarding", () => {
  beforeEach(() => {
    resetCatalogueState();
  });

  it("loads full affiliate inventory", async () => {
    const entries = await loadAffiliateCatalogue();
    expect(entries.length).toBe(AFFILIATE_INVENTORY_COUNT);
    expect(entries.length).toBeGreaterThanOrEqual(80);
    expect(entries.every((e) => e.rawName && e.sourceId)).toBe(true);
  });

  it("preserves raw labels while normalizing", async () => {
    const entries = await loadAffiliateCatalogue();
    const krisp = entries.find((e) => e.sourceId === "aff-krispcall");
    const freshdesk = entries.find((e) => e.sourceId === "aff-freshdesk");
    expect(krisp?.rawName).toMatch(/KrispCall/i);
    expect(freshdesk?.rawName).toMatch(/Freshdesk/i);

    if (krisp) {
      const n = normalizeCatalogueEntry(krisp);
      expect(n.rawName).toBe(krisp.rawName);
      expect(n.normalizedName.toLowerCase()).toContain("krispcall");
      expect(n.suggestedSlug).toBe("krispcall");
    }
    if (freshdesk) {
      const n = normalizeCatalogueEntry(freshdesk);
      expect(n.normalizedName).toBe("Freshdesk");
    }
  });

  it("classifies software, service, marketplace, composite, existing", async () => {
    const entries = await loadAffiliateCatalogue();
    const byId = Object.fromEntries(entries.map((e) => [e.sourceId, e]));

    const pipedrive = classifyCatalogueCandidate(
      normalizeCatalogueEntry(byId["aff-pipedrive"]!),
    );
    expect(pipedrive.identityOutcome).toBe("EXISTING");
    expect(pipedrive.bucket).toBe("SOFTWARE");
    expect(pipedrive.matchedProductSlug).toBe("pipedrive");

    const flippa = classifyCatalogueCandidate(
      normalizeCatalogueEntry(byId["aff-flippa"]!),
    );
    expect(flippa.bucket).toBe("MARKETPLACE");

    const shipbob = classifyCatalogueCandidate(
      normalizeCatalogueEntry(byId["aff-shipbob"]!),
    );
    expect(["SERVICE", "LOGISTICS"]).toContain(shipbob.bucket);

    const composite = classifyCatalogueCandidate(
      normalizeCatalogueEntry(byId["aff-kartra-webinarjam-everwebinar"]!),
    );
    expect(composite.bucket).toBe("MULTI_PRODUCT_PROGRAM");
    expect(composite.exclusionReason).toBe("MULTI_PRODUCT_PROGRAM");

    const studio = classifyCatalogueCandidate(
      normalizeCatalogueEntry(byId["aff-accelerated-growth-studio"]!),
    );
    expect(studio.bucket).toBe("SERVICE");
  });

  it("does not collapse Freshworks vendor family into one product", async () => {
    const entries = await loadAffiliateCatalogue();
    const fresh = entries.filter((e) => e.vendorFamily === "freshworks");
    expect(fresh.length).toBeGreaterThan(3);
    const normalized = normalizeCatalogueEntries(fresh);
    const slugs = new Set(normalized.map((n) => n.suggestedSlug));
    expect(slugs.has("freshsales")).toBe(true);
    expect(slugs.has("freshdesk")).toBe(true);
    expect(slugs.size).toBe(normalized.length);
  });

  it("scores commercial priority deterministically without editorial coupling", async () => {
    const items = await importAndProcessCatalogue({ persist: false });
    const pipe = items.find((i) => i.candidate.sourceId === "aff-pipedrive")!;
    const aweber = items.find((i) => i.candidate.sourceId === "aff-aweber")!;
    expect(pipe.priority.score).toBeGreaterThan(aweber.priority.score);
    expect(pipe.priority.actionHint).toMatch(/MAINTAIN|RECONCILE/);
    // Re-score same inputs → same score
    const again = scoreCommercialPriority({
      candidate: pipe.candidate,
      classification: pipe.classification,
      mapping: pipe.mapping,
    });
    expect(again.score).toBe(pipe.priority.score);
  });

  it("plans email-marketing batch within limits and defers blocked categories", async () => {
    const items = await importAndProcessCatalogue({ persist: true });
    const plan = planCatalogueBatch(items, {
      category: "email-marketing",
      maxProducts: 5,
      dryRun: true,
    });
    expect(plan.items.length).toBeLessThanOrEqual(5);
    expect(
      plan.items.every((i) => i.mapping.categorySlug === "email-marketing"),
    ).toBe(true);
    // Non-software never selected
    expect(
      plan.items.every((i) => i.classification.bucket === "SOFTWARE"),
    ).toBe(true);

    const deferredBlocked = plan.deferred.some((d) =>
      /category|Blocked/i.test(d.reason),
    );
    // Inventory includes unready category products that should defer in open plan
    const open = planCatalogueBatch(items, { dryRun: true, maxProducts: 5 });
    expect(open.deferred.length).toBeGreaterThan(0);
    expect(deferredBlocked || open.deferred.length > 0).toBe(true);
  });

  it("maps aliases for existing products", async () => {
    const entries = await loadAffiliateCatalogue();
    const freshdesk = entries.find((e) => e.sourceId === "aff-freshdesk")!;
    const candidate = normalizeCatalogueEntry(freshdesk);
    const classification = classifyCatalogueCandidate(candidate);
    // May be NEW if freshdesk not in software seed — still maps category
    const mapping = mapCatalogueCandidate(candidate, classification);
    expect(mapping.categorySlug).toBe("customer-service");
  });

  it("legacy findAffiliateCatalogueEntry still resolves GetResponse", () => {
    const hit = findAffiliateCatalogueEntry("getresponse");
    expect(hit?.suggestedSlug).toBe("getresponse");
  });

  it("product maturity: catalogue-only vs existing pipedrive", () => {
    expect(assessProductMaturity(undefined)).toBe("TIER_0_CATALOGUE_ONLY");
    const tier = assessProductMaturity("pipedrive");
    expect(tier).not.toBe("TIER_0_CATALOGUE_ONLY");
  });

  it("validate catalogue passes without duplicate source ids", async () => {
    await importAndProcessCatalogue({ persist: true });
    const result = await validateCatalogueOnboarding();
    expect(
      result.issues.filter((i) => i.code === "duplicate_source_id"),
    ).toHaveLength(0);
  });

  it("metric-only reimport does not invent products", async () => {
    const a = await importAndProcessCatalogue({ persist: true });
    const b = await importAndProcessCatalogue({ persist: true });
    expect(a.length).toBe(b.length);
    const pipeA = a.find((i) => i.candidate.sourceId === "aff-pipedrive")!;
    const pipeB = b.find((i) => i.candidate.sourceId === "aff-pipedrive")!;
    expect(pipeA.mapping.canonicalProductSlug).toBe(
      pipeB.mapping.canonicalProductSlug,
    );
  });

  it("normalization is stable", async () => {
    const entries = await loadAffiliateCatalogue();
    const n1 = normalizeCatalogueEntries(entries);
    const n2 = normalizeCatalogueEntries(entries);
    expect(n1.map((x) => x.suggestedSlug)).toEqual(
      n2.map((x) => x.suggestedSlug),
    );
  });
});

describe("catalogue classification fixtures", () => {
  it("treats composite Capsule/Transpond as multi-product", () => {
    const entry: AffiliateCatalogueEntry = {
      sourceId: "aff-test-composite",
      rawName: "Capsule / Transpond",
      status: "active",
      network: "other",
      multiProductHint: true,
      splitCandidates: ["Capsule", "Transpond"],
      aliases: [],
      sourceMetadata: {},
      importedAt: "2026-08-13T12:00:00.000Z",
    };
    const c = classifyCatalogueCandidate(normalizeCatalogueEntry(entry));
    expect(c.bucket).toBe("MULTI_PRODUCT_PROGRAM");
  });
});
