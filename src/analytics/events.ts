/**
 * Thin analytics event API — provider-agnostic.
 * GA4 sink is registered from ConsentAwareAnalytics (consent-gated).
 */

export type AnalyticsEventName =
  | "software_viewed"
  | "comparison_viewed"
  | "affiliate_clicked"
  | "finder_started"
  | "finder_completed"
  | "calculator_started"
  | "calculator_completed"
  | "recommendation_viewed"
  | "cta_clicked"
  | "crm_finder_started"
  | "crm_finder_step_completed"
  | "crm_finder_completed"
  | "crm_finder_result_viewed"
  | "crm_finder_result_clicked"
  | "crm_finder_comparison_clicked"
  | "crm_finder_restarted"
  | "crm_finder_back_clicked"
  | "crm_finder_calculator_clicked"
  | "si_finder_started"
  | "si_finder_step_completed"
  | "si_finder_completed"
  | "si_finder_result_viewed"
  | "si_finder_result_clicked"
  | "si_finder_comparison_clicked"
  | "si_finder_restarted"
  | "si_finder_back_clicked"
  | "si_finder_guide_clicked"
  | "category_finder_started"
  | "category_finder_step_completed"
  | "category_finder_completed"
  | "category_finder_result_viewed"
  | "category_finder_result_clicked"
  | "category_finder_comparison_clicked"
  | "category_finder_restarted"
  | "category_finder_back_clicked"
  | "category_finder_guide_clicked"
  | "crm_cost_calculator_started"
  | "crm_cost_calculator_completed"
  | "crm_cost_result_viewed"
  | "crm_cost_product_clicked"
  | "crm_cost_sort_changed"
  | "si_cost_calculator_started"
  | "si_cost_calculator_completed"
  | "si_cost_result_viewed"
  | "si_cost_sort_changed"
  | "category_cost_calculator_started"
  | "category_cost_calculator_completed"
  | "category_cost_result_viewed"
  | "category_cost_sort_changed"
  | "crm_plan_selector_started"
  | "crm_plan_vendor_selected"
  | "crm_plan_step_completed"
  | "crm_plan_requirement_selected"
  | "crm_plan_recommendation_generated"
  | "crm_plan_lower_plan_failed"
  | "crm_plan_upgrade_viewed"
  | "crm_plan_cost_viewed"
  | "crm_plan_vendor_review_clicked"
  | "crm_plan_external_pricing_clicked"
  | "crm_plan_report_downloaded"
  | "si_plan_selector_started"
  | "si_plan_vendor_selected"
  | "si_plan_step_completed"
  | "si_plan_recommendation_generated"
  | "category_plan_selector_started"
  | "category_plan_vendor_selected"
  | "category_plan_step_completed"
  | "category_plan_recommendation_generated"
  | "crm_tco_started"
  | "tco_product_added"
  | "tco_horizon_changed"
  | "tco_cost_assumption_added"
  | "tco_scenario_created"
  | "tco_completed"
  | "tco_to_scorecard"
  | "tco_exported"
  | "crm_requirements_started"
  | "si_requirements_started"
  | "requirements_step_completed"
  | "requirement_selected"
  | "requirement_priority_changed"
  | "requirements_profile_completed"
  | "requirements_to_finder_clicked"
  | "requirements_to_cost_clicked"
  | "requirements_exported"
  | "scorecard_product_added"
  | "scorecard_product_removed"
  | "scorecard_criterion_changed"
  | "scorecard_user_rating_added"
  | "scorecard_completed"
  | "scorecard_to_comparison"
  | "scorecard_to_cost"
  | "scorecard_product_selected"
  | "crm_scorecard_started"
  | "crm_implementation_started"
  | "implementation_profile_loaded"
  | "implementation_plan_generated"
  | "implementation_phase_viewed"
  | "implementation_task_completed"
  | "implementation_task_added"
  | "implementation_risk_resolved"
  | "implementation_exported"
  | "implementation_to_tco"
  | "implementation_to_migration"
  | "crm_migration_started"
  | "migration_source_added"
  | "migration_object_added"
  | "migration_mapping_confirmed"
  | "migration_test_started"
  | "migration_validation_completed"
  | "migration_plan_completed"
  | "migration_exported"
  | "migration_to_implementation"
  | "migration_to_tco"
  | "pricing_page_viewed"
  | "pricing_cta_clicked"
  | "stack_builder_started"
  | "stack_builder_completed"
  | "stack_builder_restarted"
  /** Operational / publishing lifecycle (prefer audit store for ops truth). */
  | "content_published"
  | "content_updated"
  | "content_archived"
  | "newsletter_signup_viewed"
  | "newsletter_signup_submitted"
  | "newsletter_signup_confirmed"
  | "newsletter_popup_dismissed"
  | "contact_page_view"
  | "contact_reason_selected"
  | "contact_form_started"
  | "contact_form_submitted"
  | "contact_form_success"
  | "contact_form_error"
  | "cookie_consent_shown"
  | "cookie_consent_saved"
  | "cookie_preferences_updated"
  | "web_vital"
  | "tools_page_view"
  | "tool_card_click"
  | "tool_start"
  | "tool_filter"
  | "tool_category_click"
  | "tools_final_cta_click"
  | "compare_page_view"
  | "comparison_builder_product_a_selected"
  | "comparison_builder_product_b_selected"
  | "comparison_started"
  | "comparison_card_clicked"
  | "comparison_category_clicked"
  | "comparison_review_clicked"
  | "comparison_vendor_clicked"
  | "comparison_tool_clicked"
  | "search_submitted"
  | "search_result_clicked"
  | "search_zero_results"
  | "search_filter_used"
  | "search_suggestion_clicked"
  | "roi_started"
  | "roi_step_completed"
  | "roi_result_viewed"
  | "roi_exported"
  | "roi_business_case_clicked"
  | "roi_cost_calculator_imported"
  | "roi_scenario_changed"
  | "crm_migration_cost_started"
  | "migration_source_selected"
  | "migration_data_scope_completed"
  | "migration_complexity_calculated"
  | "migration_result_viewed"
  | "migration_cost_imported_to_tco"
  | "migration_cost_imported_to_roi"
  | "rfp_builder_started"
  | "rfp_mode_selected"
  | "rfp_requirements_imported"
  | "rfp_step_completed"
  | "rfp_generated"
  | "rfp_pdf_exported"
  | "rfp_excel_exported"
  | "rfp_markdown_exported"
  | "rfp_scorecard_clicked"
  | "crm_demo_checklist_started"
  | "demo_checklist_step_completed"
  | "demo_builder_started"
  | "crm_readiness_started"
  | "crm_readiness_dimension_completed"
  | "crm_readiness_completed"
  | "crm_readiness_report_downloaded"
  | "crm_readiness_action_clicked"
  | "si_readiness_started"
  | "si_readiness_dimension_completed"
  | "si_readiness_completed"
  | "si_cost_calculator_started"
  | "si_cost_calculator_completed"
  | "si_cost_result_viewed"
  | "si_cost_sort_changed"
  | "si_plan_selector_started"
  | "si_plan_vendor_selected"
  | "si_plan_recommendation_generated"
  | "requirements_imported"
  | "scenario_added"
  | "scenario_removed"
  | "demo_plan_completed"
  | "demo_pdf_exported"
  | "demo_excel_exported"
  | "demo_markdown_exported"
  | "demo_checklist_generated"
  | "demo_checklist_saved"
  | "demo_checklist_exported"
  | "demo_requirements_imported"
  | "vendor_evaluation_started"
  | "vendor_evaluation_completed"
  | "scorecard_export_started"
  | "demo_checklist_to_scorecard";

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

type AnalyticsSink = (event: AnalyticsEvent) => void;

const sinks: AnalyticsSink[] = [];

export function registerAnalyticsSink(sink: AnalyticsSink): () => void {
  sinks.push(sink);
  return () => {
    const index = sinks.indexOf(sink);
    if (index >= 0) sinks.splice(index, 1);
  };
}

export function track(event: AnalyticsEvent): void {
  for (const sink of sinks) {
    try {
      sink(event);
    } catch {
      // Never break UX due to analytics failures.
    }
  }
}

/** Convenience helpers for common events. */
export const analytics = {
  softwareViewed: (slug: string) =>
    track({ name: "software_viewed", properties: { slug } }),
  affiliateClicked: (slug: string, location: string, isAffiliate: boolean) =>
    track({
      name: "affiliate_clicked",
      properties: { slug, location, isAffiliate },
    }),
  ctaClicked: (id: string) =>
    track({ name: "cta_clicked", properties: { id } }),
  crmFinderStarted: (properties?: AnalyticsEvent["properties"]) =>
    track({ name: "crm_finder_started", properties }),
  crmFinderStepCompleted: (step: string, properties?: AnalyticsEvent["properties"]) =>
    track({
      name: "crm_finder_step_completed",
      properties: { step, ...properties },
    }),
  crmFinderCompleted: (properties?: AnalyticsEvent["properties"]) =>
    track({ name: "crm_finder_completed", properties }),
  crmFinderResultViewed: (slug: string) =>
    track({ name: "crm_finder_result_viewed", properties: { slug } }),
  crmFinderResultClicked: (slug: string, location?: string) =>
    track({
      name: "crm_finder_result_clicked",
      properties: { slug, location },
    }),
  crmFinderComparisonClicked: (slug: string) =>
    track({ name: "crm_finder_comparison_clicked", properties: { slug } }),
  crmFinderRestarted: () => track({ name: "crm_finder_restarted" }),
  crmCostCalculatorStarted: (properties?: AnalyticsEvent["properties"]) =>
    track({ name: "crm_cost_calculator_started", properties }),
  crmCostCalculatorCompleted: (properties?: AnalyticsEvent["properties"]) =>
    track({ name: "crm_cost_calculator_completed", properties }),
  crmCostResultViewed: (slug: string, status?: string) =>
    track({
      name: "crm_cost_result_viewed",
      properties: { slug, status },
    }),
  crmCostProductClicked: (slug: string, location?: string) =>
    track({
      name: "crm_cost_product_clicked",
      properties: { slug, location },
    }),
  crmCostSortChanged: (sort: string) =>
    track({ name: "crm_cost_sort_changed", properties: { sort } }),
  pricingPageViewed: (slug: string) =>
    track({ name: "pricing_page_viewed", properties: { slug } }),
  pricingCtaClicked: (slug: string, id?: string) =>
    track({
      name: "pricing_cta_clicked",
      properties: { slug, id },
    }),
  contentPublished: (contentId: string, properties?: AnalyticsEvent["properties"]) =>
    track({
      name: "content_published",
      properties: { contentId, ...properties },
    }),
  contentUpdated: (contentId: string, properties?: AnalyticsEvent["properties"]) =>
    track({
      name: "content_updated",
      properties: { contentId, ...properties },
    }),
  contentArchived: (contentId: string, properties?: AnalyticsEvent["properties"]) =>
    track({
      name: "content_archived",
      properties: { contentId, ...properties },
    }),
};
