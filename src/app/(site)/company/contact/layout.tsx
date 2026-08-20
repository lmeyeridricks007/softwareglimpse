/**
 * Full-bleed breakout from the parent (site) PageContainer.
 * Matches /compare, /tools, and /best hub layouts.
 */
export default function ContactSectionLayout({
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
