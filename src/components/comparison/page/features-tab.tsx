"use client";

import { Fragment, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ComparisonPageModel } from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
};

function availabilityVariant(
  label: string,
): "success" | "warning" | "danger" | "neutral" {
  if (label === "Strong") return "success";
  if (label === "Moderate") return "warning";
  if (label === "Limited") return "danger";
  return "neutral";
}

export function ComparisonFeaturesTab({ model }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (model.featureGroups.length === 0) {
    return (
      <Card className="p-6 text-sm text-[var(--sg-color-text-muted)]">
        Feature comparison rows are not evidenced for this pair yet.
      </Card>
    );
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        Feature comparison
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        Grouped feature support from verified product research for{" "}
        {model.productA.name} and {model.productB.name}.
      </p>

      <div className="mt-6 space-y-8">
        {model.featureGroups.map((group) => (
          <section key={group.group}>
            <h3 className="font-semibold text-[var(--sg-color-text)]">
              {group.group}
            </h3>
            <div className="mt-3 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Feature</th>
                    <th className="px-4 py-3 font-semibold">
                      {model.productA.name}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {model.productB.name}
                    </th>
                    <th className="px-4 py-3 font-semibold">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row) => {
                    const id = `${group.group}-${row.featureSlug}`;
                    const open = openId === id;
                    const hasNotes = Boolean(row.notesA || row.notesB);
                    return (
                      <Fragment key={row.featureSlug}>
                        <tr className="border-t border-[var(--sg-color-border)]">
                          <td className="px-4 py-3 font-medium text-[var(--sg-color-text)]">
                            {row.name}
                            {hasNotes ? (
                              <button
                                type="button"
                                className="ml-2 text-xs font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                                aria-expanded={open}
                                onClick={() =>
                                  setOpenId(open ? null : id)
                                }
                              >
                                Notes
                              </button>
                            ) : null}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={availabilityVariant(row.labelA)}>
                              {row.labelA}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={availabilityVariant(row.labelB)}>
                              {row.labelB}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                            {row.winnerName ?? "—"}
                          </td>
                        </tr>
                        {open ? (
                          <tr className="border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50">
                            <td
                              colSpan={4}
                              className="px-4 py-3 text-sm text-[var(--sg-color-text-muted)]"
                            >
                              {row.notesA ? (
                                <p>
                                  <span className="font-medium text-[var(--sg-color-text)]">
                                    {model.productA.name}:
                                  </span>{" "}
                                  {row.notesA}
                                </p>
                              ) : null}
                              {row.notesB ? (
                                <p className={row.notesA ? "mt-2" : undefined}>
                                  <span className="font-medium text-[var(--sg-color-text)]">
                                    {model.productB.name}:
                                  </span>{" "}
                                  {row.notesB}
                                </p>
                              ) : null}
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
