import { PageContainer } from "@/components/layout/page-container";

/**
 * Default content shell for catalogue / editorial / company pages.
 * Homepage stays outside this group for full-bleed sections.
 */
export default function SiteContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-10">
      <PageContainer size="standard">{children}</PageContainer>
    </div>
  );
}
