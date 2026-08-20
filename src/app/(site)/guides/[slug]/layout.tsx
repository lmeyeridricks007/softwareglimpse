import { PageContainer } from "@/components/layout/page-container";

/**
 * Individual guide articles keep a padded wide container after the
 * section-level full-bleed breakout used by the Guides hub.
 */
export default function GuideArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContainer size="wide" className="py-10">
      {children}
    </PageContainer>
  );
}
