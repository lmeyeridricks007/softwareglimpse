#!/usr/bin/env tsx
import {
  runSearchQualityAgent,
  writeSearchQualityReport,
} from "@/services/search/quality-agent";
import {
  runSearchDemandOpportunityAgent,
  writeSearchDemandReports,
} from "@/services/search/demand-agent";

const mode = process.argv[2] ?? "quality";

if (mode === "demand") {
  const report = runSearchDemandOpportunityAgent();
  const paths = writeSearchDemandReports(report);
  console.log(JSON.stringify({ report, ...paths }, null, 2));
  process.exit(report.available ? 0 : 0);
}

const report = runSearchQualityAgent();
const { markdownPath } = writeSearchQualityReport(report);
console.log(
  JSON.stringify(
    {
      markdownPath,
      indexSize: report.indexSize,
      fixturePass: report.fixturePass,
      fixtureFail: report.fixtureFail,
      findings: report.findings.length,
    },
    null,
    2,
  ),
);
process.exit(report.fixtureFail > 0 ? 1 : 0);
