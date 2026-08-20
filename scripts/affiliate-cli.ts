#!/usr/bin/env npx tsx
/**
 * Affiliate + promotion management CLI.
 *
 * Examples:
 *   npm run affiliate:set -- pipedrive --url https://... --type trial --default
 *   npm run affiliate:list
 *   npm run affiliate:show -- pipedrive
 *   npm run affiliate:coverage -- --category crm
 *   npm run promotion:add -- --product pipedrive --headline "20% off" --value 20 --ends 2026-08-31
 *   npm run promotion:list -- --active
 *   npm run affiliate:import -- affiliates.csv --dry-run
 *   npm run affiliate:validate
 */

import { readFileSync, writeFileSync } from "node:fs";
import {
  addPromotion,
  applyAffiliateImport,
  buildAffiliateCoverageReport,
  buildCommercialOpportunityLines,
  buildPromotionReport,
  disableAffiliateDestination,
  disablePromotion,
  exportAffiliateSnapshot,
  getProductAffiliateStatus,
  listAffiliateProductStatuses,
  planAffiliateImport,
  setAffiliateDestination,
  validateAffiliateRepository,
} from "@/services/affiliate";
import {
  listPromotions,
  listAffiliateDestinations,
} from "@/data/affiliates/store";
import {
  derivePromotionEffectiveStatus,
  isPromotionPubliclyActive,
} from "@/services/affiliate/promotions";
import type {
  AffiliateDestinationType,
  AffiliateNetwork,
  PromotionType,
  PromotionScope,
} from "@/domain";

function parseArgs(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--json") flags.json = true;
    else if (arg === "--dry-run") flags.dryRun = true;
    else if (arg === "--default") flags.default = true;
    else if (arg === "--no-expiry") flags.noExpiry = true;
    else if (arg === "--code-required") flags.codeRequired = true;
    else if (arg === "--active") flags.active = true;
    else if (arg === "--scheduled") flags.scheduled = true;
    else if (arg === "--expired") flags.expired = true;
    else if (arg.startsWith("--") && arg.includes("=")) {
      const [k, ...rest] = arg.slice(2).split("=");
      flags[k!] = rest.join("=");
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i += 1;
      } else {
        flags[key] = true;
      }
    } else {
      positionals.push(arg);
    }
  }
  return { flags, positionals };
}

function printJson(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

function main() {
  const argv = process.argv.slice(2);
  const command = argv[0] ?? "help";
  const { flags, positionals } = parseArgs(argv.slice(1));

  switch (command) {
    case "set":
    case "destination": {
      // set <product> --url ... [--type trial] [--default] [--network partnerstack]
      // destination add --product ... --url ...
      const product =
        (flags.product as string) ||
        positionals[0] ||
        (command === "destination" ? positionals[1] : undefined);
      const url = flags.url as string | undefined;
      if (!product || !url) {
        console.error(
          "Usage: affiliate set <product> --url <https://...> [--type trial] [--default]",
        );
        process.exit(1);
      }
      const result = setAffiliateDestination({
        productSlug: product,
        url,
        destinationType: (flags.type as AffiliateDestinationType) || "homepage",
        isDefault: Boolean(flags.default) || flags.default === undefined,
        programmeName: flags.programme as string | undefined,
        network: flags.network as AffiliateNetwork | undefined,
        notes: flags.notes as string | undefined,
      });
      if (!result.ok) {
        console.error(`${result.code}: ${result.message}`);
        process.exit(1);
      }
      if (flags.json) printJson(result);
      else {
        console.log(
          `OK ${result.destination.id} → ${result.destination.url} (${result.destination.destinationType})`,
        );
        for (const w of result.warnings) console.warn(`warning: ${w}`);
      }
      break;
    }

    case "destination-disable": {
      const id = positionals[0] || (flags.id as string);
      if (!id) {
        console.error("Usage: affiliate destination-disable <id>");
        process.exit(1);
      }
      const result = disableAffiliateDestination(id);
      console.log(result.message);
      if (!result.ok) process.exit(1);
      break;
    }

    case "list": {
      const rows = listAffiliateProductStatuses();
      if (flags.json) {
        printJson(rows);
        break;
      }
      console.log(
        "PRODUCT".padEnd(18) +
          "STATUS".padEnd(12) +
          "DEFAULT".padEnd(14) +
          "PROMOTION",
      );
      for (const row of rows) {
        console.log(
          row.productName.slice(0, 16).padEnd(18) +
            row.status.padEnd(12) +
            row.defaultLabel.slice(0, 12).padEnd(14) +
            row.promotionLabel.slice(0, 40),
        );
      }
      if (rows.length === 0) {
        console.log("(no affiliate destinations configured)");
      }
      break;
    }

    case "show": {
      const product = positionals[0] || (flags.product as string);
      if (!product) {
        console.error("Usage: affiliate show <product>");
        process.exit(1);
      }
      const status = getProductAffiliateStatus(product);
      if (!status) {
        console.error(`Unknown product: ${product}`);
        process.exit(1);
      }
      if (flags.json) printJson(status);
      else {
        console.log(`${status.productName} (${status.productSlug})`);
        console.log(`Status: ${status.status}`);
        console.log(
          `Programme: ${status.programme?.name ?? "NONE"} (${status.programme?.status ?? "-"})`,
        );
        console.log("Destinations:");
        for (const d of status.destinations) {
          console.log(
            `  - ${d.id} [${d.destinationType}] ${d.status}${d.isDefault ? " DEFAULT" : ""} ${d.url}`,
          );
        }
        console.log(
          `Active promotion: ${status.activePromotion?.headline ?? "-"}`,
        );
        console.log(
          `Scheduled: ${status.scheduledPromotions.map((p) => p.id).join(", ") || "-"}`,
        );
        console.log(
          `Expired: ${status.expiredPromotions.map((p) => p.id).join(", ") || "-"}`,
        );
        console.log(`Official fallback: ${status.fallbackOfficialUrl ?? "-"}`);
      }
      break;
    }

    case "coverage": {
      const report = buildAffiliateCoverageReport({
        categorySlug: flags.category as string | undefined,
      });
      if (flags.json) printJson(report);
      else {
        console.log(`Total software: ${report.totalSoftware}`);
        console.log(`Active affiliate: ${report.withActiveProgramme}`);
        console.log(`Pending: ${report.pending}`);
        console.log(`Without affiliate: ${report.withoutAffiliate}`);
        console.log(`Active promotions: ${report.withActivePromotion}`);
        console.log(`Missing destination: ${report.missingDestination}`);
        if (report.monetization) {
          console.log(
            `Published affiliate CTA: ${report.monetization.publishedWithAffiliateCta}`,
          );
          console.log(
            `Published official CTA: ${report.monetization.publishedWithOfficialCta}`,
          );
          console.log(
            `Published missing CTA: ${report.monetization.publishedMissingCta}`,
          );
        }
        console.log("\nOpportunities:");
        for (const line of buildCommercialOpportunityLines(15)) {
          console.log(`  - ${line}`);
        }
      }
      break;
    }

    case "promotion-add":
    case "promotion": {
      const product = (flags.product as string) || positionals[0];
      const headline = (flags.headline as string) || positionals[1];
      if (!product || !headline) {
        console.error(
          'Usage: promotion add --product pipedrive --headline "20% off" [--value 20] [--ends 2026-08-31] [--code X] [--no-expiry]',
        );
        process.exit(1);
      }
      const result = addPromotion({
        productSlug: product,
        headline,
        name: flags.name as string | undefined,
        description: flags.description as string | undefined,
        promotionType: flags.type as PromotionType | undefined,
        scope: flags.scope as PromotionScope | undefined,
        value: flags.value ? Number(flags.value) : undefined,
        currency: flags.currency as string | undefined,
        promoCode: flags.code as string | undefined,
        codeRequired: Boolean(flags.codeRequired),
        startsAt: flags.starts as string | undefined,
        endsAt: flags.ends as string | undefined,
        noExpiry: Boolean(flags.noExpiry),
        destinationId: flags.destination as string | undefined,
        source: (flags.source as string) || "manual-cli",
        isPrimary: true,
      });
      if (!result.ok) {
        console.error(`${result.code}: ${result.message}`);
        process.exit(1);
      }
      if (flags.json) printJson(result);
      else {
        console.log(`OK ${result.promotion.id} — ${result.promotion.headline}`);
        for (const w of result.warnings) console.warn(`warning: ${w}`);
      }
      break;
    }

    case "promotion-list": {
      const now = new Date();
      let items = listPromotions();
      const product = flags.product as string | undefined;
      if (product) items = items.filter((p) => p.productSlug === product);
      if (flags.active) {
        items = items.filter((p) => isPromotionPubliclyActive(p, now));
      }
      if (flags.scheduled) {
        items = items.filter(
          (p) => derivePromotionEffectiveStatus(p, now) === "scheduled",
        );
      }
      if (flags.expired) {
        items = items.filter(
          (p) => derivePromotionEffectiveStatus(p, now) === "expired",
        );
      }
      if (flags.json) printJson(items);
      else {
        const report = buildPromotionReport(now);
        console.log("ACTIVE NOW", report.ACTIVE_NOW.length);
        console.log("STARTING SOON", report.STARTING_SOON.length);
        console.log("EXPIRING SOON", report.EXPIRING_SOON.length);
        console.log("EXPIRED", report.EXPIRED.length);
        console.log("STALE/UNVERIFIED", report.STALE_UNVERIFIED.length);
        for (const p of items) {
          console.log(
            `${p.id}  ${p.productSlug}  ${derivePromotionEffectiveStatus(p, now)}  ${p.headline}`,
          );
        }
      }
      break;
    }

    case "promotion-disable": {
      const id = positionals[0] || (flags.id as string);
      if (!id) {
        console.error("Usage: promotion-disable <id>");
        process.exit(1);
      }
      const result = disablePromotion(id);
      console.log(result.message);
      if (!result.ok) process.exit(1);
      break;
    }

    case "import": {
      const file = positionals[0] || (flags.file as string);
      if (!file) {
        console.error("Usage: affiliate import <file.csv> [--dry-run]");
        process.exit(1);
      }
      const csv = readFileSync(file, "utf8");
      if (flags.dryRun) {
        const plan = planAffiliateImport(csv);
        if (flags.json) printJson(plan);
        else {
          console.log("DRY RUN");
          console.log("Matched:", plan.matched.length);
          console.log("Unknown products:", plan.unknownProducts.join(", ") || "-");
          console.log("Invalid URLs:", plan.invalidUrls.length);
          console.log("Promotions:", plan.promotionsToCreate.length);
          printJson(plan);
        }
        break;
      }
      const result = applyAffiliateImport(csv);
      if (flags.json) printJson(result);
      else {
        console.log(`Applied ${result.applied} changes`);
        for (const e of result.errors) console.error(e);
        if (result.plan.unknownProducts.length) {
          console.error(
            "UNKNOWN_PRODUCT:",
            result.plan.unknownProducts.join(", "),
          );
        }
      }
      break;
    }

    case "export": {
      const snap = exportAffiliateSnapshot();
      const out = flags.out as string | undefined;
      if (out) {
        writeFileSync(out, `${JSON.stringify(snap, null, 2)}\n`);
        console.log(`Wrote ${out}`);
      } else printJson(snap);
      break;
    }

    case "validate": {
      const result = validateAffiliateRepository();
      if (flags.json) printJson(result);
      else {
        console.log(
          result.ok
            ? "Affiliate validation: PASS"
            : "Affiliate validation: FAIL",
        );
        for (const i of result.issues) {
          console.log(`[${i.severity}] ${i.code}: ${i.message}`);
        }
      }
      if (!result.ok) process.exit(1);
      break;
    }

    case "help":
    default: {
      console.log(`SoftwareGlimpse affiliate CLI

Commands:
  set <product> --url <url> [--type trial] [--default] [--network partnerstack]
  destination-disable <id>
  list [--json]
  show <product> [--json]
  coverage [--category crm] [--json]
  promotion-add --product <slug> --headline "..." [--value 20] [--ends YYYY-MM-DD] [--code X] [--no-expiry]
  promotion-list [--active|--scheduled|--expired] [--product slug]
  promotion-disable <id>
  import <file.csv> [--dry-run]
  export [--out file.json]
  validate

Destinations on disk: ${listAffiliateDestinations().length}
Promotions on disk: ${listPromotions().length}
`);
      if (command !== "help") process.exit(1);
    }
  }
}

main();
