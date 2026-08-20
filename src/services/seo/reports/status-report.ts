import type { SeoOpportunity, SeoOpportunityStatus, SeoOpportunityType } from "@/domain";

export type SeoStatusReport = {
  generatedAt: string;
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  top: Array<{ id: string; type: SeoOpportunityType; priorityScore: number; status: SeoOpportunityStatus }>;
};

export function buildStatusReport(
  opportunities: SeoOpportunity[],
  nowIso?: string,
): SeoStatusReport {
  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  for (const o of opportunities) {
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
    byType[o.type] = (byType[o.type] ?? 0) + 1;
  }
  return {
    generatedAt: nowIso ?? new Date().toISOString(),
    total: opportunities.length,
    byStatus,
    byType,
    top: [...opportunities]
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 10)
      .map((o) => ({
        id: o.id,
        type: o.type,
        priorityScore: o.priorityScore,
        status: o.status,
      })),
  };
}
