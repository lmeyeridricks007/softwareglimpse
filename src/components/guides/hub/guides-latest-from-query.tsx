"use client";

import { useSearchParams } from "next/navigation";
import { GuidesLatestGrid } from "@/components/guides/hub/guides-latest-grid";
import type {
  GuidesHubGuideCard,
  GuidesHubTopicFilterSlug,
} from "@/services/guides-hub";

type Props = {
  guides: GuidesHubGuideCard[];
  filterCategories: Array<{ slug: string; name: string }>;
  filterTopics: Array<{
    slug: GuidesHubTopicFilterSlug;
    name: string;
    count: number;
  }>;
};

export function GuidesLatestFromQuery(props: Props) {
  const params = useSearchParams();
  const categoryParam = params.get("category");
  const topicParam = params.get("topic");
  const query = params.get("q") ?? "";
  const initialCategory =
    categoryParam && props.filterCategories.some((c) => c.slug === categoryParam)
      ? categoryParam
      : null;
  const initialTopic =
    topicParam && props.filterTopics.some((t) => t.slug === topicParam)
      ? (topicParam as GuidesHubTopicFilterSlug)
      : null;

  return (
    <GuidesLatestGrid
      key={`${initialCategory ?? ""}:${initialTopic ?? ""}:${query}`}
      guides={props.guides}
      filterCategories={props.filterCategories}
      filterTopics={props.filterTopics}
      initialCategory={initialCategory}
      initialTopic={initialTopic}
      initialQuery={query}
    />
  );
}
