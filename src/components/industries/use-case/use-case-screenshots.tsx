import { CapabilityScreenshots } from "@/components/industries/capability/capability-screenshots";
import type { IndustryUseCaseScreenshot } from "@/services/industry-use-case";

export function UseCaseScreenshots({
  useCaseName,
  items,
}: {
  useCaseName: string;
  items: IndustryUseCaseScreenshot[];
}) {
  return (
    <CapabilityScreenshots
      capabilityName={useCaseName}
      items={items}
      title="See the products in action"
    />
  );
}
