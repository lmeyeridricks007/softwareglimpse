import { permanentRedirect } from "next/navigation";
import { COMPANY_ROUTES } from "@/services/site-foundation";

export default function HowWeReviewAliasPage() {
  permanentRedirect(COMPANY_ROUTES.howWeReview);
}
