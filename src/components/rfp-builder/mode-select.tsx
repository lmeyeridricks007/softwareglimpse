"use client";

import { Check, FileText, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { RfpMode } from "@/domain";

type Props = {
  onSelect: (mode: RfpMode) => void;
};

export function RfpModeSelect({ onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          Which format do you need?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          Most smaller CRM purchases do not need a full RFP. Choose a Vendor Brief
          unless your procurement process requires more.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          className={cn(
            "flex flex-col border-[var(--sg-color-primary)]/30 bg-[var(--sg-color-primary-soft)]/30 p-5 shadow-[var(--sg-shadow-sm)]",
          )}
        >
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] text-white">
              <FileText className="size-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-[var(--sg-color-navy)]">
                Vendor Brief
              </h3>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Best for smaller teams and straightforward evaluations.
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-[var(--sg-color-text)]">
            <li>Smaller buying teams · 2–4 shortlisted CRMs</li>
            <li>Straightforward / self-service implementations</li>
            <li>Informal vendor outreach</li>
            <li>Typical length: 3–6 pages</li>
          </ul>
          <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
            Includes business context, scope, priority requirements, integrations,
            implementation questions and pricing request.
          </p>
          <Button
            className="mt-5 w-full sm:w-auto"
            onClick={() => onSelect("vendor-brief")}
          >
            Build Vendor Brief
          </Button>
        </Card>

        <Card className="flex flex-col p-5 shadow-[var(--sg-shadow-sm)]">
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-navy)] text-white">
              <Scale className="size-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-[var(--sg-color-navy)]">
                Formal RFP
              </h3>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Best for complex projects and formal procurement.
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-[var(--sg-color-text)]">
            <li>Larger buying committee · formal procurement</li>
            <li>Complex integrations, migration, security review</li>
            <li>Implementation partner involvement</li>
            <li>Typical length: 10–15 pages</li>
          </ul>
          <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
            Includes all Vendor Brief sections plus response matrix, security,
            migration, SLA/support, normalized commercials, assumptions and vendor
            declaration.
          </p>
          <Button
            variant="secondary"
            className="mt-5 w-full sm:w-auto"
            onClick={() => onSelect("formal-rfp")}
          >
            Build Formal RFP
          </Button>
        </Card>
      </div>

      <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]">
        <p className="font-medium text-[var(--sg-color-navy)]">Not sure?</p>
        <p className="mt-1">
          Most smaller CRM purchases do not need a full RFP. Start with a Vendor
          Brief unless your procurement process requires more.
        </p>
        <p className="mt-2 flex items-center gap-2 text-xs">
          <Check className="size-3.5 text-[var(--sg-color-success)]" aria-hidden />
          You can switch modes later — complexity adjusts with the format.
        </p>
      </div>
    </div>
  );
}
