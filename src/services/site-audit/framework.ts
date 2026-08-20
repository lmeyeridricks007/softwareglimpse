import type { AuditIssue, AuditLevel } from "@/domain";
import { createIssue, type IssueDraft } from "./issues";

export type AuditCheckContext = {
  now: string;
  forceFresh?: boolean;
  categorySlug?: string;
  productSlug?: string;
  contentId?: string;
  /** Injected fixture payloads for POC/tests */
  fixtures?: Record<string, unknown>;
};

export type AuditCheck = {
  id: string;
  level: AuditLevel;
  description: string;
  run: (ctx: AuditCheckContext) => AuditIssue[] | Promise<AuditIssue[]>;
};

export function issue(draft: IssueDraft, now: string): AuditIssue {
  return createIssue(draft, now);
}

export async function runChecks(
  checks: AuditCheck[],
  ctx: AuditCheckContext,
  filterLevels?: AuditLevel[],
): Promise<AuditIssue[]> {
  const selected = filterLevels?.length
    ? checks.filter((c) => filterLevels.includes(c.level))
    : checks;
  const out: AuditIssue[] = [];
  for (const check of selected) {
    const found = await check.run(ctx);
    out.push(...found);
  }
  return out;
}
