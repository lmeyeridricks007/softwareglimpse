import { cn } from "@/lib/cn";

type Props = {
  organization?: string;
  reportName: string;
  year: number | string;
  publishedDate?: string;
  updatedDate?: string;
  url?: string;
  prominent?: boolean;
  className?: string;
};

/**
 * Citation block — no backlink required.
 */
export function ResearchCitationBlock({
  organization = "SoftwareGlimpse",
  reportName,
  year,
  publishedDate,
  updatedDate,
  url,
  prominent = false,
  className,
}: Props) {
  const short = `Source: ${organization}, ${reportName}, ${year}`;
  const dated = updatedDate
    ? `${organization} (${year}). ${reportName}. Updated ${updatedDate}.${url ? ` ${url}` : ""}`
    : `${short}${url ? ` — ${url}` : ""}`;

  return (
    <aside
      id={prominent ? "cite-this-research" : undefined}
      className={cn(
        "rounded-[var(--sg-radius-lg)] border px-4 py-4 text-sm",
        prominent
          ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]"
          : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
        className,
      )}
      aria-label="Cite this research"
    >
      <p
        className={cn(
          "font-semibold",
          prominent
            ? "text-[length:var(--sg-text-h3)] text-[var(--sg-color-navy)]"
            : "text-[var(--sg-color-text)]",
        )}
      >
        Cite this research
      </p>
      {prominent ? (
        <dl className="mt-3 grid gap-2 text-[var(--sg-color-text)] sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Organization
            </dt>
            <dd>{organization}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Title
            </dt>
            <dd>{reportName}</dd>
          </div>
          {publishedDate ? (
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Published
              </dt>
              <dd>{publishedDate}</dd>
            </div>
          ) : null}
          {updatedDate ? (
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Last updated
              </dt>
              <dd>{updatedDate}</dd>
            </div>
          ) : null}
          {url ? (
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Canonical URL
              </dt>
              <dd className="break-all font-mono text-xs">{url}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
      <p className="mt-3 text-[var(--sg-color-text-muted)]">
        Suggested attribution (no backlink required):
      </p>
      <p className="mt-2 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-3 py-2 font-mono text-xs text-[var(--sg-color-text)]">
        {dated}
      </p>
    </aside>
  );
}
