import { describe, expect, it } from "vitest";
import { getSoftwareBySlug } from "@/data";
import {
  auditSoftwareFields,
  buildDecisionHubDraft,
  applySoftwareEnrichment,
} from "@/services/seo/software-enrichment";

describe("software enrichment", () => {
  it("audits fields without inventing pricing/trial", () => {
    const soft = getSoftwareBySlug("pipedrive");
    expect(soft).toBeTruthy();
    const audit = auditSoftwareFields(soft!);
    expect(audit.items.length).toBeGreaterThanOrEqual(16);
    const trial = audit.items.find((i) => i.field === "trial");
    expect(trial).toBeTruthy();
    // Trial must be PASS or UNKNOWN — never claimed absent without evidence
    expect(["PASS", "UNKNOWN"]).toContain(trial!.status);
  });

  it("builds decision hub from existing sources only", () => {
    const soft = getSoftwareBySlug("pipedrive");
    expect(soft).toBeTruthy();
    const audit = auditSoftwareFields(soft!);
    const hub = buildDecisionHubDraft(soft!, audit);
    expect(hub.whatItIs || hub.bestFor.length > 0).toBeTruthy();
    expect(/powerful business tool/i.test(hub.whatItIs ?? "")).toBe(false);
  });

  it("applies overlay for a known product", () => {
    const result = applySoftwareEnrichment("pipedrive");
    expect(result.applied).toBe(true);
    expect(result.overlayPath).toBeTruthy();
  });
});
