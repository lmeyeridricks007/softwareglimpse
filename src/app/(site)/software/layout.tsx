/**
 * Soft breakout from the parent (site) PageContainer so review pages can use
 * the wide content width from the mockup without restructuring all site routes.
 */
export default function SoftwareSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-[var(--sg-container-wide)]">
        {children}
      </div>
    </div>
  );
}
