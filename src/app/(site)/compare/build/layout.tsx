import { PageContainer } from "@/components/layout/page-container";

export default function CompareBuildLayout({
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
