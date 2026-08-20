import type { ResearchSource } from "@/domain";
import { EvidenceSourceLink } from "@/components/outbound/evidence-source-link";

type Props = {
  sources: ResearchSource[];
  productName?: string;
};

/** Optional public source list — no internal confidence/debug metadata. */
export function ResearchSourcesList({ sources, productName }: Props) {
  const publicSources = sources.filter(
    (source) =>
      source.status !== "rejected" &&
      source.status !== "archived" &&
      source.sourceHealth !== "unavailable" &&
      source.sourceType !== "affiliate-network" &&
      source.title,
  );
  if (publicSources.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
        Sources
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--color-fg-muted)]">
        {publicSources.map((source) => (
          <li key={source.id}>
            {source.url ? (
              <EvidenceSourceLink source={source} productName={productName} />
            ) : (
              source.title
            )}
            {source.verifiedAt ? (
              <span className="ml-2 text-xs text-[var(--color-fg-muted)]">
                Verified {source.verifiedAt.slice(0, 10)}
              </span>
            ) : null}
            {source.sourceType === "fixture" ? " (fixture)" : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
