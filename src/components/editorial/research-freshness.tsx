type Props = {
  checkedAt?: string;
  researchStatus?: string;
  editorialStatus?: string;
  fixtureBased?: boolean;
  refreshNeeded?: boolean;
  refreshReason?: string;
};

export function ResearchFreshness({
  checkedAt,
  researchStatus,
  editorialStatus,
  fixtureBased = false,
  refreshNeeded = false,
  refreshReason,
}: Props) {
  const checked = checkedAt
    ? new Date(checkedAt).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <aside
      aria-label="Recommendation freshness"
      className="mb-8 text-sm text-[var(--color-fg-muted)]"
    >
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-fg)]">
        Research freshness
      </h2>
      <ul className="mt-3 space-y-1">
        {researchStatus ? <li>Research status: {researchStatus}</li> : null}
        {editorialStatus ? <li>Editorial status: {editorialStatus}</li> : null}
        {checked ? <li>Last checked: {checked}</li> : null}
        {fixtureBased ? (
          <li>
            Evidence includes fixture research snapshots — not claimed as live
            vendor truth.
          </li>
        ) : null}
        {refreshNeeded ? (
          <li>Refresh needed{refreshReason ? `: ${refreshReason}` : ""}</li>
        ) : null}
      </ul>
    </aside>
  );
}
