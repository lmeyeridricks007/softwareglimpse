import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { GuideArticle } from "../../../guides/[slug]/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guide preview",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ slug: string }> };

export default async function PreviewGuidePage({ params }: Props) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) notFound();
  const { slug } = await params;
  return GuideArticle({ slug, preview: true });
}
