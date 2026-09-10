import { describe, expect, it } from "vitest";
import {
  ensureAffiliateClickStore,
  ensureAffiliateConversionPlaceholder,
  importAffiliateConversionsFromFile,
  matchConversionsToClicks,
  mapRowToConversion,
  parseCsv,
  parseNetworkExportPayload,
  buildAffiliateFunnelReport,
  recordAffiliateClick,
  recomputeConversionMoney,
  sanitizeReferrerHost,
  sanitizeSourcePage,
} from "@/services/analytics/affiliate-funnel";
import { buildCommercialSection } from "@/services/seo/growth-dashboard/quality-authority";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

describe("affiliate funnel", () => {
  it("sanitizes path and referrer host without PII", () => {
    expect(sanitizeSourcePage("https://www.softwareglimpse.com/software/x/?utm=1#h")).toBe(
      "/software/x/",
    );
    expect(sanitizeReferrerHost("https://www.google.com/search?q=secret")).toBe(
      "google.com",
    );
  });

  it("records clicks into a REAL first-party store with trackingId", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "sg-aff-"));
    ensureAffiliateConversionPlaceholder(cwd);
    const store = ensureAffiliateClickStore(cwd);
    expect(store.validity).toBe("REAL");
    expect(store.synthetic).toBe(false);

    recordAffiliateClick(
      {
        productSlug: "pipedrive",
        sourcePage: "/software/pipedrive/?ref=test",
        ctaLocation: "hero",
        referrerHost: "https://www.google.com/search?q=x",
        captureChannel: "beacon",
      },
      cwd,
    );
    const after = ensureAffiliateClickStore(cwd);
    expect(after.aggregates.totalClicks).toBe(1);
    expect(after.events[0]?.referrerHost).toBe("google.com");
    expect(after.events[0]?.sourcePage).toBe("/software/pipedrive/");
    expect(after.events[0]?.trafficSource).toBe("organic");
    expect(after.events[0]?.trackingId).toBe(after.events[0]?.id);
  });

  it("keeps conversions NOT_CONNECTED and never fabricates $0 revenue", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "sg-aff-c-"));
    const store = ensureAffiliateConversionPlaceholder(cwd);
    expect(store.validity).toBe("NOT_CONNECTED");
    expect(store.revenueTotal).toBeNull();
    expect(store.commissionTotal).toBeNull();
    expect(store.orderRevenueTotal).toBeNull();

    const funnel = buildAffiliateFunnelReport(null, store);
    expect(funnel.conversions.validity).toBe("NOT_CONNECTED");
    expect(funnel.commission.total).toBeNull();
    expect(funnel.revenue.total).toBeNull();
  });

  it("rejects fixture conversion imports", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "sg-aff-f-"));
    const file = path.join(cwd, "fixture-sample-conversions.json");
    writeFileSync(file, JSON.stringify({ conversions: [] }), "utf8");
    expect(() => importAffiliateConversionsFromFile(file, cwd)).toThrow(
      /fixture|sample/i,
    );
  });

  it("parses Impact-style CSV without inventing click attribution", () => {
    const csv = [
      "Action_Date,Action_Id,Campaign_Name,Payout,Sale_Amount,Currency,SubId1,Status",
      "2026-09-01,ACT-1,Harbor CRM,12.50,99.00,USD,click-abc,Approved",
      "2026-09-02,ACT-2,Pulse,8.00,,USD,,Pending",
    ].join("\n");
    const parsed = parseNetworkExportPayload(csv, {
      filename: "impact-actions-2026-09.csv",
      isJson: false,
    });
    expect(parsed.provider).toBe("impact");
    expect(parsed.rows).toHaveLength(2);
    expect(parsed.rows[0]?.clickId).toBe("click-abc");
    expect(parsed.rows[0]?.commissionAmount).toBe(12.5);
    expect(parsed.rows[0]?.orderRevenue).toBe(99);
    expect(parsed.rows[1]?.clickId).toBeNull();
    expect(parsed.rows[1]?.orderRevenue).toBeNull();
  });

  it("joins conversions only when clickId matches retained click id", () => {
    const clicks = [
      {
        id: "click-abc",
        ts: "2026-09-01T10:00:00.000Z",
        sourcePage: "/software/harbor/",
        productSlug: "harbor",
        programId: null,
        vendor: null,
        ctaLocation: "hero",
        ctaType: "affiliate",
        destinationDomain: null,
        destinationType: null,
        referrerHost: null,
        trafficSource: "organic",
        captureChannel: "beacon",
        trackingId: "click-abc",
      },
    ];
    const conversions = [
      {
        id: "c1",
        convertedAt: "2026-09-01T12:00:00.000Z",
        productSlug: "harbor",
        programId: null,
        network: "impact",
        externalId: "ACT-1",
        clickId: "click-abc",
        status: "approved" as const,
        currency: "USD",
        amount: 12.5,
        amountKind: "commission" as const,
        commissionAmount: 12.5,
        orderRevenue: 99,
      },
      {
        id: "c2",
        convertedAt: "2026-09-02T12:00:00.000Z",
        productSlug: "pulse",
        programId: null,
        network: "impact",
        externalId: "ACT-2",
        clickId: null,
        status: "pending" as const,
        currency: "USD",
        amount: 8,
        amountKind: "commission" as const,
        commissionAmount: 8,
        orderRevenue: null,
      },
    ];
    const { matched, unmatched } = matchConversionsToClicks(
      conversions,
      clicks,
    );
    expect(matched).toHaveLength(1);
    expect(unmatched).toHaveLength(1);
    expect(matched[0]?.click.id).toBe("click-abc");
  });

  it("withholds money totals when any row lacks amounts (never invent $0)", () => {
    const money = recomputeConversionMoney([
      {
        id: "a",
        convertedAt: "2026-09-01T00:00:00.000Z",
        productSlug: null,
        programId: null,
        network: null,
        externalId: null,
        clickId: null,
        status: "approved",
        currency: "USD",
        amount: 10,
        amountKind: "commission",
        commissionAmount: 10,
        orderRevenue: 100,
      },
      {
        id: "b",
        convertedAt: "2026-09-02T00:00:00.000Z",
        productSlug: null,
        programId: null,
        network: null,
        externalId: null,
        clickId: null,
        status: "approved",
        currency: "USD",
        amount: null,
        amountKind: "commission",
        commissionAmount: null,
        orderRevenue: null,
      },
    ]);
    expect(money.commissionTotal).toBeNull();
    expect(money.orderRevenueTotal).toBeNull();
  });

  it("imports REAL CSV and reports PARTIAL money + unmatched safely", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "sg-aff-imp-"));
    mkdirSync(path.join(cwd, "data/analytics"), { recursive: true });
    ensureAffiliateClickStore(cwd);
    const click = recordAffiliateClick(
      {
        productSlug: "harbor",
        sourcePage: "/software/harbor/",
        ctaLocation: "hero",
        captureChannel: "beacon",
      },
      cwd,
    );
    const file = path.join(cwd, "impact-export.csv");
    writeFileSync(
      file,
      [
        "Action_Date,Action_Id,Campaign_Name,Payout,Sale_Amount,Currency,SubId1,Status",
        `2026-09-01,ACT-1,Harbor,12.50,99.00,USD,${click.id},Approved`,
        "2026-09-02,ACT-2,Pulse,8.00,50.00,USD,unknown-click,Pending",
      ].join("\n"),
      "utf8",
    );
    const store = importAffiliateConversionsFromFile(file, cwd);
    expect(store.validity).toBe("REAL");
    expect(store.conversions).toHaveLength(2);
    expect(store.commissionTotal).toBe(20.5);
    expect(store.orderRevenueTotal).toBe(149);

    const clicks = ensureAffiliateClickStore(cwd);
    const funnel = buildAffiliateFunnelReport(clicks, store);
    expect(funnel.conversions.matched).toBe(1);
    expect(funnel.conversions.unmatched).toBe(1);
    expect(funnel.conversions.conversionRate).toBe(1);
    expect(funnel.topConvertingSourcePages[0]?.path).toBe("/software/harbor/");
  });

  it("maps generic row without inventing clickId", () => {
    const row = mapRowToConversion(
      {
        Date: "2026-09-01",
        Commission: "5",
        Program: "Northstar",
      },
      "generic",
    );
    expect(row?.clickId).toBeNull();
    expect(row?.commissionAmount).toBe(5);
    expect(row?.vendor).toMatch(/northstar/i);
  });

  it("parseCsv handles quoted commas", () => {
    const rows = parseCsv('a,b\n"1,2",3\n');
    expect(rows[1]).toEqual(["1,2", "3"]);
  });
});

describe("commercial dashboard affiliate states", () => {
  it("never shows zero conversions when network is NOT_CONNECTED", () => {
    const commercial = buildCommercialSection();
    expect(commercial.conversions.kind).toBe("not_connected");
    expect(commercial.revenue.kind).toBe("not_connected");
    expect(commercial.commission.kind).toBe("not_connected");
    expect(commercial.matchedConversions.kind).toBe("not_connected");
    if (commercial.affiliateClicks.kind === "number") {
      expect(["PARTIAL", "STALE", "REAL"]).toContain(commercial.validity);
    }
  });
});
