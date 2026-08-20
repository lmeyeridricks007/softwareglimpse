/**
 * Full-bleed breakout from the parent (site) PageContainer.
 * Vertical rhythm and horizontal padding come from `Section` + `PageContainer`
 * (same pattern as /tools and /best hubs).
 */
export default function CompareSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative left-1/2 w-[100vw] max-w-[100vw] -translate-x-1/2 -my-10">
      {children}
    </div>
  );
}
