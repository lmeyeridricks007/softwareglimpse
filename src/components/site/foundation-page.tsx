import Link from "next/link";
import type { LegalDocumentStatus } from "@/domain";
import { isLegalConfigurationComplete } from "@/services/site-foundation";

export function LegalStatusBanner({
  status,
  version,
  lastUpdatedAt,
}: {
  status: LegalDocumentStatus;
  version: string;
  lastUpdatedAt?: string;
}) {
  if (status === "published" || status === "approved") return null;
  const identityComplete = isLegalConfigurationComplete();
  return (
    <aside
      role="note"
      className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-accent-soft)] p-4 text-sm text-[var(--color-fg)]"
    >
      Document status: <strong>{status}</strong>
      {status === "legal-review-required" || status === "draft"
        ? " — pending legal review"
        : ""}{" "}
      (v{version}
      {lastUpdatedAt ? ` · updated ${lastUpdatedAt}` : ""}).
      {identityComplete
        ? " Business identity and processor inventory are configured. This banner is removed once the document is approved or published."
        : " Incomplete business details surface as LEGAL_CONFIGURATION_INCOMPLETE rather than invented facts. This banner is removed once the document is approved or published."}
    </aside>
  );
}

export function FoundationPageShell({
  title,
  summary,
  children,
  related,
}: {
  title: string;
  summary?: string;
  children: React.ReactNode;
  related?: { href: string; label: string }[];
}) {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] md:text-4xl">
        {title}
      </h1>
      {summary ? (
        <p className="mt-3 text-lg text-[var(--color-fg-muted)]">{summary}</p>
      ) : null}
      <div className="prose-site mt-8 space-y-6 text-[var(--color-fg)]">
        {children}
      </div>
      {related && related.length > 0 ? (
        <nav aria-label="Related pages" className="mt-10 border-t border-[var(--color-border)] pt-6">
          <ul className="flex flex-wrap gap-3 text-sm">
            {related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[var(--color-accent)] underline-offset-2 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </article>
  );
}

export function SectionBlock({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
        {heading}
      </h2>
      <div className="mt-2 space-y-3 text-[var(--color-fg-muted)] leading-relaxed whitespace-pre-line">
        {children}
      </div>
    </section>
  );
}
