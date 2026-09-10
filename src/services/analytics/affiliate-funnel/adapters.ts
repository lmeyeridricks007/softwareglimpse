/**
 * Affiliate network export adapters — Impact, CJ, ShareASale, PartnerStack, generic.
 * Never invent attribution. Minimal PII (no emails, names, IPs).
 */
import { randomUUID } from "node:crypto";
import type { AffiliateConversionRow } from "./types";

export type NetworkProvider =
  | "impact"
  | "cj"
  | "shareasale"
  | "partnerstack"
  | "generic"
  | "unknown";

export type ParsedNetworkExport = {
  provider: NetworkProvider;
  sourceLabel: string;
  dataThroughDate: string | null;
  rows: AffiliateConversionRow[];
  notes: string[];
};

const FIXTURE_RE = /sample|fixture|synthetic|dummy|mock|example|test/i;

export function looksFixturePath(p: string): boolean {
  const lower = p.toLowerCase();
  return (
    lower.includes("/fixtures/") ||
    FIXTURE_RE.test(pathBasename(lower))
  );
}

function pathBasename(p: string): string {
  const parts = p.split(/[/\\]/);
  return parts[parts.length - 1] ?? p;
}

/** Minimal CSV parser — supports quoted fields. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ",") {
      row.push(field.trim());
      field = "";
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(field.trim());
      field = "";
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      continue;
    }
    field += ch;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((c) => c.length > 0)) rows.push(row);
  }
  return rows;
}

function normKey(k: string): string {
  return k
    .trim()
    .toLowerCase()
    .replace(/[\s_\-/]+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function pick(
  row: Record<string, string>,
  aliases: string[],
): string | null {
  const map = new Map(
    Object.entries(row).map(([k, v]) => [normKey(k), v]),
  );
  for (const a of aliases) {
    const v = map.get(normKey(a));
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return null;
}

function parseAmount(raw: string | null): number | null {
  if (raw == null || raw === "") return null;
  const cleaned = raw.replace(/[^0-9.\-]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseStatus(raw: string | null): AffiliateConversionRow["status"] {
  if (!raw) return "unknown";
  const s = raw.toLowerCase();
  if (/pending|open|new/.test(s)) return "pending";
  if (/approved|locked|payable/.test(s)) return "approved";
  if (/reject|declin|reversed|cancel/.test(s)) return "rejected";
  if (/paid|settled/.test(s)) return "paid";
  return "unknown";
}

function toIsoDate(raw: string | null): string | null {
  if (!raw) return null;
  const t = Date.parse(raw);
  if (!Number.isNaN(t)) return new Date(t).toISOString();
  // YYYY-MM-DD HH:MM:SS
  const m = raw.match(
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)/,
  );
  if (m) {
    const iso = Date.parse(`${m[1]}T${m[2]}Z`);
    if (!Number.isNaN(iso)) return new Date(iso).toISOString();
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T12:00:00.000Z`;
  return null;
}

function inferProvider(headers: string[], hint?: string | null): NetworkProvider {
  const h = hint?.toLowerCase() ?? "";
  if (h.includes("impact")) return "impact";
  if (h.includes("cj") || h.includes("commissionjunction")) return "cj";
  if (h.includes("shareasale") || h.includes("sas")) return "shareasale";
  if (h.includes("partnerstack")) return "partnerstack";
  const joined = headers.map(normKey).join("|");
  if (joined.includes("actionid") && joined.includes("payout")) return "impact";
  if (joined.includes("actionid") && joined.includes("advertisername")) return "cj";
  if (joined.includes("transid") || joined.includes("merchantid")) return "shareasale";
  if (joined.includes("partnerkey") || joined.includes("customerkey")) {
    return "partnerstack";
  }
  return "generic";
}

function slugFromVendor(name: string | null): string | null {
  if (!name) return null;
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || null;
}

/**
 * Map a normalized row object to a conversion record.
 * Only sets fields present in the export — never invents attribution.
 */
export function mapRowToConversion(
  row: Record<string, string>,
  provider: NetworkProvider,
): AffiliateConversionRow | null {
  const convertedAt = toIsoDate(
    pick(row, [
      "convertedAt",
      "Action_Date",
      "Action Date",
      "Event Date",
      "Trans Date",
      "Date",
      "created_at",
      "transaction_date",
      "conversion_date",
    ]),
  );
  if (!convertedAt) return null;

  const clickId = pick(row, [
    "clickId",
    "click_id",
    "SubId1",
    "subid1",
    "sid",
    "SID",
    "Aff Track",
    "aff_track",
    "tracking_id",
    "trackingId",
    "clickref",
    "Sub_ID",
  ]);

  const commission = parseAmount(
    pick(row, [
      "commission",
      "Commission",
      "Payout",
      "payout",
      "Pub Commission",
      "publisher_commission",
      "earnings",
    ]),
  );
  const orderRevenue = parseAmount(
    pick(row, [
      "orderRevenue",
      "Sale_Amount",
      "Sale Amount",
      "Amount",
      "sale_amount",
      "order_amount",
      "revenue",
      "Order Value",
    ]),
  );

  const vendor = pick(row, [
    "vendor",
    "Campaign_Name",
    "Campaign Name",
    "Advertiser Name",
    "Merchant",
    "merchant_name",
    "program_name",
    "Program",
  ]);
  const programId = pick(row, [
    "programId",
    "Campaign_ID",
    "Campaign Id",
    "Advertiser Id",
    "Merchant ID",
    "program_id",
    "campaign_id",
  ]);
  const productSlug =
    pick(row, ["productSlug", "product_slug", "software_id", "sku"]) ??
    slugFromVendor(vendor);

  const externalId = pick(row, [
    "externalId",
    "Action_ID",
    "Action Id",
    "Trans ID",
    "transaction_id",
    "Id",
    "id",
  ]);

  const currency = pick(row, ["currency", "Currency", "currency_code"]);
  const status = parseStatus(
    pick(row, ["status", "Status", "Action_Status", "Action Status"]),
  );

  let amount: number | null = null;
  let amountKind: AffiliateConversionRow["amountKind"] = "unknown";
  if (commission != null) {
    amount = commission;
    amountKind = "commission";
  } else if (orderRevenue != null) {
    amount = orderRevenue;
    amountKind = "sale";
  }

  return {
    id: externalId ? `${provider}-${externalId}` : randomUUID(),
    convertedAt,
    productSlug: productSlug?.toLowerCase() ?? null,
    programId,
    network: provider === "unknown" || provider === "generic" ? null : provider,
    externalId,
    clickId,
    status,
    currency,
    amount,
    amountKind,
    commissionAmount: commission,
    orderRevenue,
    vendor,
  };
}

export function parseNetworkExportPayload(
  raw: string,
  opts: {
    filename?: string;
    providerHint?: string | null;
    isJson?: boolean;
  } = {},
): ParsedNetworkExport {
  const notes: string[] = [];
  const filename = opts.filename ?? "export";

  if (opts.isJson || raw.trim().startsWith("{") || raw.trim().startsWith("[")) {
    const parsed = JSON.parse(raw) as {
      synthetic?: boolean;
      provider?: string;
      sourceLabel?: string;
      dataThroughDate?: string;
      conversions?: Array<Record<string, unknown>>;
      rows?: Array<Record<string, unknown>>;
    };
    if (parsed.synthetic) {
      throw new Error("Refusing synthetic:true conversion export");
    }
    const provider = inferProvider(
      [],
      parsed.provider ?? opts.providerHint ?? filename,
    );
    const sourceRows = parsed.conversions ?? parsed.rows ?? [];
    const rows: AffiliateConversionRow[] = [];
    for (const r of sourceRows) {
      // Prefer structured AffiliateConversionRow-like objects
      if (r.convertedAt) {
        const commission =
          typeof r.commissionAmount === "number"
            ? r.commissionAmount
            : typeof r.amount === "number" && r.amountKind === "commission"
              ? r.amount
              : typeof r.commission === "number"
                ? r.commission
                : null;
        const orderRevenue =
          typeof r.orderRevenue === "number"
            ? r.orderRevenue
            : typeof r.amount === "number" && r.amountKind === "sale"
              ? r.amount
              : typeof r.saleAmount === "number"
                ? r.saleAmount
                : null;
        rows.push({
          id: String(r.id ?? randomUUID()),
          convertedAt: String(r.convertedAt),
          productSlug:
            typeof r.productSlug === "string" ? r.productSlug : null,
          programId: typeof r.programId === "string" ? r.programId : null,
          network:
            typeof r.network === "string"
              ? r.network
              : parsed.provider ?? null,
          externalId:
            typeof r.externalId === "string" ? r.externalId : null,
          clickId: typeof r.clickId === "string" ? r.clickId : null,
          status: parseStatus(
            typeof r.status === "string" ? r.status : null,
          ),
          currency: typeof r.currency === "string" ? r.currency : null,
          amount:
            typeof r.amount === "number" && Number.isFinite(r.amount)
              ? r.amount
              : commission ?? orderRevenue,
          amountKind:
            (r.amountKind as AffiliateConversionRow["amountKind"]) ??
            (commission != null
              ? "commission"
              : orderRevenue != null
                ? "sale"
                : "unknown"),
          commissionAmount: commission,
          orderRevenue,
          vendor: typeof r.vendor === "string" ? r.vendor : null,
        });
        continue;
      }
      const flat: Record<string, string> = {};
      for (const [k, v] of Object.entries(r)) {
        if (v != null) flat[k] = String(v);
      }
      const mapped = mapRowToConversion(flat, provider);
      if (mapped) rows.push(mapped);
    }
    notes.push(`Parsed ${rows.length} conversion rows from JSON (${provider})`);
    return {
      provider,
      sourceLabel: parsed.sourceLabel ?? filename,
      dataThroughDate: parsed.dataThroughDate ?? null,
      rows,
      notes,
    };
  }

  const table = parseCsv(raw);
  if (table.length < 2) {
    return {
      provider: "unknown",
      sourceLabel: filename,
      dataThroughDate: null,
      rows: [],
      notes: ["CSV contained no data rows"],
    };
  }
  const headers = table[0]!;
  const provider = inferProvider(headers, opts.providerHint ?? filename);
  const rows: AffiliateConversionRow[] = [];
  for (const cells of table.slice(1)) {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = cells[i] ?? "";
    });
    const mapped = mapRowToConversion(obj, provider);
    if (mapped) rows.push(mapped);
  }
  notes.push(
    `Parsed ${rows.length} conversion rows from CSV (${provider}, ${headers.length} columns)`,
  );
  const dates = rows
    .map((r) => r.convertedAt.slice(0, 10))
    .sort();
  return {
    provider,
    sourceLabel: filename,
    dataThroughDate: dates[dates.length - 1] ?? null,
    rows,
    notes,
  };
}
