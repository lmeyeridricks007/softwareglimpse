import { PageContainer } from "@/components/layout/page-container";

/** Detail/build routes keep padded wide content after the hub full-bleed breakout. */
export default function CompareDetailLayout({
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
