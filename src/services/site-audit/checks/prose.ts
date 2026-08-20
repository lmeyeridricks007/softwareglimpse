import { getAllSoftwareUnfiltered } from "@/data";
import {
  genericAiPhrases,
  handsOnPatterns,
  rawAffiliateUrlPatterns,
  unsupportedSuperlatives,
  userReviewClaimPatterns,
} from "@/data/config/audit/rules";
import type { AuditCheck } from "../framework";
import { issue } from "../framework";

function scanText(
  text: string,
  patterns: RegExp[],
): string | null {
  for (const p of patterns) {
    if (p.test(text)) return p.source;
  }
  return null;
}

/**
 * Prose / claim audits — fixtures + product short descriptions.
 */
export const proseClaimChecks: AuditCheck[] = [
  {
    id: "bad-draft-fixture",
    level: "quality",
    description: "Controlled bad-draft fixture (unsupported price, fake test, broken link)",
    run(ctx) {
      const draft = ctx.fixtures?.badDraft as
        | {
            contentId: string;
            path: string;
            body: string;
            handsOnAllowed?: boolean;
          }
        | undefined;
      if (!draft) return [];
      const issues = [];
      const body = draft.body;

      if (/\$\d+(\.\d+)?\s*\/\s*month/i.test(body)) {
        issues.push(
          issue(
            {
              type: "UNVERIFIED_NUMBER",
              level: "quality",
              severity: "high",
              message: "Unsupported live price claim in prose",
              contentId: draft.contentId,
              path: draft.path,
              evidence: body.match(/\$\d+[^\n.]*/)?.[0],
              section: "body",
            },
            ctx.now,
          ),
        );
        // Also flag prose vs structured mismatch if fixture provides structured price
        const structured = ctx.fixtures?.structuredPrice as string | undefined;
        const prosePrice = body.match(/\$\d+(\.\d+)?/)?.[0];
        if (structured && prosePrice && !structured.includes(prosePrice.replace("$", ""))) {
          issues.push(
            issue(
              {
                type: "PRICING_PROSE_MISMATCH",
                level: "quality",
                severity: "high",
                message: `Prose price ${prosePrice} ≠ structured ${structured}`,
                contentId: draft.contentId,
                path: draft.path,
              },
              ctx.now,
            ),
          );
        }
      }

      if (!draft.handsOnAllowed) {
        const hit = scanText(body, handsOnPatterns);
        if (hit) {
          issues.push(
            issue(
              {
                type: "FAKE_TESTING_CLAIM",
                level: "quality",
                severity: "critical",
                message: "Hands-on testing claim without testing metadata",
                contentId: draft.contentId,
                path: draft.path,
                evidence: hit,
              },
              ctx.now,
            ),
          );
        }
      }

      const broken = ctx.fixtures?.brokenInternalLink as
        | { path: string; target: string }
        | undefined;
      if (broken) {
        issues.push(
          issue(
            {
              type: "BROKEN_INTERNAL_LINK",
              level: "validity",
              severity: "high",
              message: `Broken internal link → ${broken.target}`,
              contentId: draft.contentId,
              path: broken.path,
              evidence: broken.target,
            },
            ctx.now,
          ),
        );
      }

      return issues;
    },
  },
  {
    id: "generic-ai-and-superlatives",
    level: "quality",
    description: "Generic AI phrases and unsupported superlatives in descriptions",
    run(ctx) {
      const issues = [];
      for (const product of getAllSoftwareUnfiltered()) {
        if (ctx.productSlug && product.slug !== ctx.productSlug) continue;
        const text = `${product.shortDescription ?? ""} ${product.name}`;
        const generic = scanText(text, genericAiPhrases);
        if (generic) {
          issues.push(
            issue(
              {
                type: "GENERIC_AI_PROSE",
                level: "quality",
                severity: "low",
                message: `${product.slug}: generic AI-style phrasing`,
                productSlug: product.slug,
                evidence: generic,
              },
              ctx.now,
            ),
          );
        }
        const superlative = scanText(text, unsupportedSuperlatives);
        if (superlative) {
          issues.push(
            issue(
              {
                type: "UNSUPPORTED_SUPERLATIVE",
                level: "quality",
                message: `${product.slug}: unsupported superlative in description`,
                productSlug: product.slug,
                evidence: superlative,
              },
              ctx.now,
            ),
          );
        }
        const userClaim = scanText(text, userReviewClaimPatterns);
        if (userClaim) {
          issues.push(
            issue(
              {
                type: "USER_REVIEW_CLAIM",
                level: "quality",
                message: `${product.slug}: user-review claim without approved sentiment research`,
                productSlug: product.slug,
                evidence: userClaim,
              },
              ctx.now,
            ),
          );
        }
        const aff = scanText(text, rawAffiliateUrlPatterns);
        if (aff) {
          issues.push(
            issue(
              {
                type: "RAW_AFFILIATE_URL",
                level: "validity",
                severity: "high",
                message: `${product.slug}: raw affiliate URL embedded in prose`,
                productSlug: product.slug,
                evidence: aff,
              },
              ctx.now,
            ),
          );
        }
      }
      return issues;
    },
  },
];
