"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";
import type { DemoChecklistResult, RequirementDemoTest } from "@/domain";
import type { RequirementSeeSupportCard } from "@/services/product-media/requirement-page-media";
import { formatRequirementDemoTestPlainText } from "@/services/requirement-detail/demo-test";
import {
  DEMO_RESULT_LABELS,
  addRequirementToDemoChecklistProfile,
  getShortlistDemoResults,
  upsertRequirementDemoResult,
} from "@/services/requirement-detail/demo-evaluation";
import { RequirementVideoEvidenceCard } from "@/components/requirements/requirement-media-sections";

const RESULT_OPTIONS: DemoChecklistResult[] = [
  "not-tested",
  "fully-demonstrated",
  "partially-demonstrated",
  "not-demonstrated",
  "needs-follow-up",
];

type ProductOption = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
};

type Props = {
  requirementName: string;
  demoTest: RequirementDemoTest;
  products: ProductOption[];
  /** Official vendor example — never a substitute for the live demo. */
  officialExample: RequirementSeeSupportCard | null;
  demoChecklistHref: string;
  className?: string;
};

/**
 * Reusable vendor-demo test for Requirement Detail pages.
 * Driven by RequirementDemoTest data — no requirement-specific JSX.
 */
export function RequirementDemoTest({
  requirementName,
  demoTest,
  products,
  officialExample,
  demoChecklistHref,
  className,
}: Props) {
  const [selectedProduct, setSelectedProduct] = useState(
    products[0]?.slug ?? "",
  );
  const [result, setResult] = useState<DemoChecklistResult>("not-tested");
  const [notes, setNotes] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [shortlist, setShortlist] = useState<
    Array<{ productId: string; result: DemoChecklistResult; notes?: string }>
  >([]);

  const refreshShortlist = useCallback(() => {
    setShortlist(
      getShortlistDemoResults({ requirementId: demoTest.requirementId }),
    );
  }, [demoTest.requirementId]);

  useEffect(() => {
    refreshShortlist();
  }, [refreshShortlist]);

  useEffect(() => {
    if (!selectedProduct) return;
    const hit = shortlist.find((s) => s.productId === selectedProduct);
    if (hit) {
      setResult(hit.result);
      setNotes(hit.notes ?? "");
    }
  }, [selectedProduct, shortlist]);

  const plainText = useMemo(
    () => formatRequirementDemoTestPlainText(demoTest, requirementName),
    [demoTest, requirementName],
  );

  async function copyTest() {
    try {
      await navigator.clipboard.writeText(plainText);
      setStatusMsg("Demo test copied");
    } catch {
      setStatusMsg("Could not copy");
    }
    setTimeout(() => setStatusMsg(null), 2500);
  }

  function printTest() {
    const w = window.open("", "_blank", "noopener,noreferrer,width=720,height=900");
    if (!w) {
      setStatusMsg("Pop-up blocked — copy instead");
      setTimeout(() => setStatusMsg(null), 2500);
      return;
    }
    w.document.write(
      `<!doctype html><html><head><title>${requirementName} — vendor demo test</title>
      <style>
        body{font-family:system-ui,sans-serif;padding:24px;line-height:1.45;color:#111}
        h1{font-size:1.25rem} pre{white-space:pre-wrap;font-family:inherit}
      </style></head><body>
      <h1>Vendor demo test: ${requirementName}</h1>
      <pre>${plainText.replace(/</g, "&lt;")}</pre>
      </body></html>`,
    );
    w.document.close();
    w.focus();
    w.print();
  }

  function saveResult() {
    if (!selectedProduct) {
      setStatusMsg("Select a product first");
      setTimeout(() => setStatusMsg(null), 2500);
      return;
    }
    upsertRequirementDemoResult({
      requirementId: demoTest.requirementId,
      productId: selectedProduct,
      result,
      notes,
    });
    refreshShortlist();
    setStatusMsg("Saved to your vendor scorecard");
    setTimeout(() => setStatusMsg(null), 2500);
  }

  function addToChecklist() {
    addRequirementToDemoChecklistProfile(demoTest.requirementId);
    refreshShortlist();
    setStatusMsg("Added to CRM demo checklist");
    setTimeout(() => setStatusMsg(null), 2500);
  }

  const productName = (slug: string) =>
    products.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <section
      id="verify-demo"
      aria-labelledby="demo-test-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="demo-test-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            How to verify this requirement in a vendor demo
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            Take this checklist into every vendor session and ask each product
            to demonstrate the same scenario. Your results stay in your vendor
            scorecard — they do not rewrite SoftwareGlimpse recommendations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={copyTest}>
            <Copy className="size-4" aria-hidden />
            Copy test
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={printTest}>
            <Printer className="size-4" aria-hidden />
            Print test
          </Button>
        </div>
      </div>

      <Card className="mt-5 space-y-6 p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Objective
          </p>
          <p className="mt-2 text-sm text-[var(--sg-color-text)]">
            {demoTest.objective}
          </p>
        </div>

        {demoTest.preconditions.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Preconditions
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {demoTest.preconditions.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Ask the vendor to demonstrate
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
            {demoTest.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            What good support looks like
          </p>
          <ul className="mt-3 space-y-1.5">
            {demoTest.expectedOutcomes.map((o) => (
              <li key={o} className="flex gap-2 text-sm">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {o}
              </li>
            ))}
          </ul>
        </div>

        {demoTest.failureSignals.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Failure signals
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {demoTest.failureSignals.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {demoTest.questions.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Follow-up questions
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {demoTest.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      {officialExample ? (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Official vendor example
          </p>
          <p className="mt-1 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            An official product video can show an example of the behavior — it
            does not substitute for your own vendor demo.
          </p>
          <div className="mt-3 max-w-xl">
            <RequirementVideoEvidenceCard card={officialExample} />
          </div>
        </div>
      ) : null}

      <Card className="mt-6 space-y-4 p-5">
        <div>
          <h3 className="font-semibold text-[var(--sg-color-text)]">
            Your demo result
          </h3>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Record what happened in the live session. This is your evaluation —
            not SoftwareGlimpse recommendations.
          </p>
        </div>

        {products.length > 0 ? (
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Product
            </span>
            <select
              className="mt-1 block w-full max-w-xs rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Add products to your shortlist in Finder or Vendor Scorecard to
            record per-product demo results.
          </p>
        )}

        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Result
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {RESULT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setResult(opt)}
                className={cn(
                  "rounded-[var(--sg-radius-md)] border px-3 py-1.5 text-sm",
                  result === opt
                    ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                    : "border-[var(--sg-color-border)] text-[var(--sg-color-text)]",
                )}
              >
                {DEMO_RESULT_LABELS[opt]}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Notes (optional)
          </span>
          <textarea
            className="mt-1 block w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What was shown, what was deferred, plan caveats…"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" size="sm" onClick={saveResult}>
            Save demo result
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={addToChecklist}>
            Add to my CRM demo checklist
          </Button>
          <ButtonLink href={demoChecklistHref} variant="outline" size="sm">
            Open demo checklist →
          </ButtonLink>
          {statusMsg ? (
            <span className="text-sm text-[var(--sg-color-text-muted)]">
              {statusMsg}
            </span>
          ) : null}
        </div>
      </Card>

      {shortlist.length > 0 ? (
        <div className="mt-6">
          <h3 className="font-semibold text-[var(--sg-color-text)]">
            Shortlist demo status
          </h3>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Your evaluations only — SoftwareGlimpse recommendations rankings are
            unchanged.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shortlist.map((row) => {
              const product = products.find((p) => p.slug === row.productId);
              return (
                <li key={row.productId}>
                  <Card className="flex items-center gap-3 p-4">
                    <ProductLogo
                      name={product?.name ?? row.productId}
                      logo={product?.logo}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="font-medium">
                        {productName(row.productId)}
                      </p>
                      <Badge variant="neutral" className="mt-1">
                        {DEMO_RESULT_LABELS[row.result]}
                      </Badge>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
