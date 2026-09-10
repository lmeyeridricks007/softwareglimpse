import { permanentRedirect } from "next/navigation";
import { LEGAL_ROUTES } from "@/services/site-foundation";

export default function EditorialPolicyAliasPage() {
  permanentRedirect(LEGAL_ROUTES.editorialPolicy);
}
