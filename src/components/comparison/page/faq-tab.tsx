"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { ComparisonPageModel } from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
};

export function ComparisonFaqTab({ model }: Props) {
  const items = model.faq;
  const [openId, setOpenId] = useState<string | null>(
    items[0] ? "faq-0" : null,
  );

  if (items.length === 0) {
    return (
      <Card className="p-6 text-sm text-[var(--sg-color-text-muted)]">
        FAQ content is not available for this comparison yet.
      </Card>
    );
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        Frequently asked questions
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        Common buyer questions about {model.productA.name} vs{" "}
        {model.productB.name}.
      </p>

      <ul className="mt-6 space-y-3">
        {items.map((item, index) => {
          const id = `faq-${index}`;
          const open = openId === id;
          return (
            <li key={id}>
              <Card className="overflow-hidden p-0">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : id)}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left"
                >
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-xs font-semibold text-white">
                    Q
                  </span>
                  <span className="min-w-0 flex-1 font-medium text-[var(--sg-color-text)]">
                    {item.question}
                  </span>
                  <span
                    className="text-[var(--sg-color-text-muted)]"
                    aria-hidden
                  >
                    {open ? "▴" : "▾"}
                  </span>
                </button>
                {open ? (
                  <div className="border-t border-[var(--sg-color-border)] px-4 py-4 pl-[3.25rem] text-sm text-[var(--sg-color-text-muted)]">
                    <p className="whitespace-pre-line">{item.answer}</p>
                  </div>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
