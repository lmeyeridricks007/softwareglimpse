/**
 * CRM Business Case Template — Excel calculation engine.
 * Blank inputs + SAMPLE-marked examples only. Formulas compute when opened in Excel.
 */

type AOA = (string | number | null)[][];

/** Build all sheets as array-of-arrays; formulas as Excel formula strings. */
export function buildCrmBusinessCaseWorkbookAoa(): {
  name: string;
  aoa: AOA;
  cols?: { wch: number }[];
}[] {
  const readme: AOA = [
    ["SoftwareGlimpse — CRM Business Case Template (Excel)"],
    ["Updated", new Date().toISOString().slice(0, 10)],
    [],
    ["Purpose"],
    [
      "This workbook is the calculation engine behind an approval-ready CRM business case. Use it with the PDF narrative template.",
    ],
    [],
    ["How to use"],
    ["1. Enter your organisation’s inputs on Baseline, TCO, and Benefits sheets."],
    ["2. Mark Confidence as Verified, Estimated, Scenario, or Unknown."],
    ["3. Leave unknown cells blank — do not invent ROI, pricing, or vendor uplift."],
    ["4. SAMPLE rows are teaching examples only; replace or clear them."],
    ["5. Financial Model and Executive Summary pull from your inputs via formulas."],
    [],
    ["Confidence key"],
    ["Verified", "Supported by known evidence"],
    ["Estimated", "Reasoned internal estimate"],
    ["Scenario", "Hypothetical modelling assumption"],
    ["Unknown", "Still requires validation"],
    [],
    ["Sheet map"],
    ["00_READ_ME", "Instructions (this sheet)"],
    ["01_EXECUTIVE_SUMMARY", "Auto-filled summary for sponsors"],
    ["02_CURRENT_STATE", "Problem, systems, pain points"],
    ["03_BASELINE", "Metrics and current cost estimate"],
    ["04_OPTIONS", "Options A–D comparison"],
    ["05_TCO", "Year 1 + recurring costs and 3-year TCO"],
    ["06_BENEFITS", "Productivity, revenue scenarios, cost avoidance"],
    ["07_FINANCIAL_MODEL", "Cash flows, payback, ROI"],
    ["08_RISKS", "Risks and dependencies"],
    ["09_IMPLEMENTATION", "Milestones and checkpoints"],
    ["10_ASSUMPTIONS", "Assumptions register"],
    ["11_DECISION", "Decision and signatures"],
    [],
    ["Related SoftwareGlimpse tools"],
    ["CRM Cost Calculator", "https://softwareglimpse.com/tools/crm-cost-calculator/"],
    ["CRM TCO Calculator", "https://softwareglimpse.com/tools/crm-tco-calculator/"],
    ["CRM Requirements Builder", "https://softwareglimpse.com/tools/crm-requirements-builder/"],
    ["CRM Vendor Scorecard", "https://softwareglimpse.com/tools/crm-vendor-scorecard/"],
    ["CRM Finder", "https://softwareglimpse.com/tools/crm-finder/"],
    ["CRM Evaluation Checklist", "https://softwareglimpse.com/resources/crm-evaluation-checklist/"],
    ["CRM Implementation Checklist", "https://softwareglimpse.com/resources/crm-implementation-checklist/"],
  ];

  const exec: AOA = [
    ["01 — EXECUTIVE SUMMARY"],
    [],
    ["Project / Initiative", ""],
    ["Business owner", ""],
    ["Executive sponsor", ""],
    ["Prepared by", ""],
    ["Date", ""],
    ["Target decision date", ""],
    [],
    ["THE DECISION"],
    ["We are requesting approval to…", ""],
    [],
    ["Current problem", ""],
    ["Recommended option", ""],
    [],
    ["KPI", "Value", "Source sheet"],
    ["Year 1 investment", "='05_TCO'!B24", "05_TCO"],
    ["Annual recurring cost", "='05_TCO'!B35", "05_TCO"],
    ["Estimated annual benefit", "='06_BENEFITS'!B27", "06_BENEFITS"],
    ["3-year TCO", "='05_TCO'!B37", "05_TCO"],
    ["3-year benefit", "='07_FINANCIAL_MODEL'!B13", "07_FINANCIAL_MODEL"],
    ["Net 3-year value", "='07_FINANCIAL_MODEL'!B14", "07_FINANCIAL_MODEL"],
    ["Payback (months)", "='07_FINANCIAL_MODEL'!B16", "07_FINANCIAL_MODEL"],
    ["ROI %", "='07_FINANCIAL_MODEL'!B15", "07_FINANCIAL_MODEL"],
    [],
    [
      "Note",
      "KPI cells calculate when TCO and Benefits inputs are entered. Never invent ROI.",
    ],
  ];

  const current: AOA = [
    ["02 — CURRENT STATE & PROBLEM"],
    [],
    ["BUSINESS PROBLEM (2–4 sentences)"],
    [""],
    [""],
    [],
    ["CURRENT PROCESS"],
    ["How leads, customers, opportunities and activities are managed today:"],
    [""],
    [],
    [
      "System / Tool",
      "Purpose",
      "Users",
      "Annual cost",
      "Primary limitation",
      "Replace / Integrate / Retain",
    ],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    [],
    [
      "Problem",
      "Who is affected?",
      "Frequency",
      "Business impact",
      "Evidence / source",
    ],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    [],
    ["Pain-point prompts (guidance only — not claims about your company)"],
    ["Duplicate customer data"],
    ["Manual sales reporting"],
    ["Poor pipeline visibility"],
    ["Missed follow-ups"],
    ["Spreadsheet-based forecasting"],
    ["Disconnected email / activity history"],
    ["Low CRM adoption"],
    ["Manual lead routing"],
  ];

  const baseline: AOA = [
    ["03 — BASELINE METRICS"],
    [],
    ["Metric", "Current value", "Source", "Confidence"],
    ["Salespeople", "", "", ""],
    ["Average loaded hourly cost", "", "", ""],
    ["Hours/week spent on manual admin", "", "", ""],
    ["Hours/week preparing reports", "", "", ""],
    ["Leads / month", "", "", ""],
    ["Lead response time", "", "", ""],
    ["Conversion rate", "", "", ""],
    ["Average deal value", "", "", ""],
    ["Win rate", "", "", ""],
    ["Sales cycle length", "", "", ""],
    ["Forecast accuracy", "", "", ""],
    ["CRM / tool costs (annual)", "", "", ""],
    ["Duplicate software costs (annual)", "", "", ""],
    [],
    ["CURRENT ANNUAL COST ESTIMATE"],
    ["Category", "Amount", "Confidence", "Notes"],
    ["Manual administration cost", "", "", ""],
    ["Reporting cost", "", "", ""],
    ["Existing software cost", "", "", ""],
    ["Lost productivity estimate", "", "", ""],
    ["Other measurable cost", "", "", ""],
    ["TOTAL ESTIMATED CURRENT ANNUAL COST", "=SUM(B20:B24)", "", ""],
  ];

  const options: AOA = [
    ["04 — OPTIONS CONSIDERED"],
    [],
    [
      "Criterion",
      "A — Do nothing",
      "B — Improve existing",
      "C — Implement / replace CRM",
      "D — Alternative tooling",
    ],
    ["Description", "", "", "", ""],
    ["One-time cost", "", "", "", ""],
    ["Annual cost", "", "", "", ""],
    ["Expected benefit", "", "", "", ""],
    ["Time to value", "", "", "", ""],
    ["Risk", "", "", "", ""],
    ["Strategic fit", "", "", "", ""],
    [],
    ["Recommended option (A/B/C/D)", ""],
    ["Why the recommended option?"],
    [""],
    [""],
  ];

  const tco: AOA = [
    ["05 — CRM INVESTMENT / TCO"],
    [],
    ["ASSUMPTIONS"],
    ["Number of users", "", "Confidence", ""],
    ["Plan / tier", "", "Confidence", ""],
    ["Billing cycle", "", "Confidence", ""],
    ["Growth in seats (Y2/Y3)", "", "Confidence", ""],
    ["Implementation duration (months)", "", "Confidence", ""],
    ["Contingency %", "", "Confidence", ""],
    [],
    ["YEAR 1 COSTS"],
    ["Line item", "Amount", "Confidence", "Notes"],
    ["Software licences", "", "", ""],
    ["Required add-ons", "", "", ""],
    ["Implementation partner", "", "", ""],
    ["Internal implementation effort", "", "", ""],
    ["Data migration", "", "", ""],
    ["Integrations", "", "", ""],
    ["Training", "", "", ""],
    ["Change management", "", "", ""],
    ["Customisation", "", "", ""],
    ["Security / compliance work", "", "", ""],
    ["Contingency", "", "", ""],
    ["YEAR 1 INVESTMENT", "=SUM(B13:B23)", "", ""],
    [],
    ["YEAR 2+ RECURRING (annual)"],
    ["Line item", "Amount", "Confidence", "Notes"],
    ["Licences", "", "", ""],
    ["Add-ons", "", "", ""],
    ["Administration", "", "", ""],
    ["Support", "", "", ""],
    ["Integration / platform costs", "", "", ""],
    ["Ongoing training", "", "", ""],
    ["Other", "", "", ""],
    ["ANNUAL RECURRING COST", "=SUM(B28:B34)", "", ""],
    [],
    [
      "3-YEAR TCO",
      "=B24+B35+B35",
      "",
      "Year 1 + 2× annual recurring (edit if Y2≠Y3)",
    ],
    [],
    [
      "Note",
      "Enter only known or estimated figures. Leave blank when Unknown. Do not invent licence prices.",
    ],
  ];

  const benefits: AOA = [
    ["06 — BENEFITS MODEL"],
    [],
    ["PRODUCTIVITY SAVINGS"],
    ["Input", "Value", "Confidence", "Notes"],
    ["Users", "", "Estimated", ""],
    ["Hours saved / week", "", "Scenario", "Do not treat as guaranteed"],
    ["Loaded hourly cost", "", "Estimated", ""],
    ["Working weeks / year", 48, "Estimated", "SAMPLE default — edit or clear"],
    [
      "Annual productivity value",
      '=IF(COUNTBLANK(B5:B7)>0,"",B5*B6*B7*B8)',
      "",
      "",
    ],
    [],
    ["REVENUE IMPROVEMENT (scenario assumptions only)"],
    ["Lever", "Assumption", "Est. annual impact", "Confidence"],
    ["Lead conversion improvement", "", "", "Scenario"],
    ["Win-rate improvement", "", "", "Scenario"],
    ["Sales-cycle improvement", "", "", "Scenario"],
    ["Recovered opportunities", "", "", "Scenario"],
    ["Subtotal revenue scenarios", "=SUM(C13:C16)", "", ""],
    [],
    ["COST AVOIDANCE"],
    ["Item", "Annual amount", "Confidence", "Notes"],
    ["Tools retired", "", "", ""],
    ["Manual processes removed", "", "", ""],
    ["External services reduced", "", "", ""],
    ["Other savings", "", "", ""],
    ["Subtotal cost avoidance", "=SUM(B21:B24)", "", ""],
    [],
    [
      "ANNUAL MEASURABLE BENEFIT",
      '=IF(AND(B9="",B17=0,B25=0),"",IF(B9="",0,B9)+B17+B25)',
      "",
      "",
    ],
    ["Unquantified strategic benefits", "", "", "Do not force into ROI"],
  ];

  const financial: AOA = [
    ["07 — FINANCIAL MODEL"],
    [],
    ["Linked inputs"],
    ["Year 1 cost", "='05_TCO'!B24"],
    ["Annual recurring", "='05_TCO'!B35"],
    ["Annual benefit", "='06_BENEFITS'!B27"],
    [],
    ["Year", "Costs", "Benefits", "Net cash impact", "Cumulative impact"],
    [
      "Year 1",
      "=B4",
      "=B6",
      '=IF(OR(B9="",C9=""),"",C9-B9)',
      "=D9",
    ],
    [
      "Year 2",
      "=B5",
      "=B6",
      '=IF(OR(B10="",C10=""),"",C10-B10)',
      '=IF(OR(E9="",D10=""),"",E9+D10)',
    ],
    [
      "Year 3",
      "=B5",
      "=B6",
      '=IF(OR(B11="",C11=""),"",C11-B11)',
      '=IF(OR(E10="",D11=""),"",E10+D11)',
    ],
    [],
    ["3-year benefit", '=IF(COUNT(C9:C11)=0,"",SUM(C9:C11))'],
    ["Net 3-year value", '=IF(COUNT(D9:D11)=0,"",SUM(D9:D11))'],
    ["ROI %", '=IF(OR(B4="",B4=0,B14=""),"",ROUND((B14/B4)*100,1))'],
    [
      "Payback (months)",
      '=IF(OR(B6="",B6=0,B4=""),"",ROUND(B4/(B6/12),1))',
    ],
    [],
    ["Payback note"],
    [
      "Simple payback uses Year 1 investment ÷ monthly benefit rate. Blank when inputs missing. Do not invent values.",
    ],
  ];

  const risks: AOA = [
    ["08 — RISKS & DEPENDENCIES"],
    [],
    ["Risk", "Likelihood", "Impact", "Mitigation", "Owner"],
    ["Poor user adoption", "", "", "", ""],
    ["Data migration problems", "", "", "", ""],
    ["Integration complexity", "", "", "", ""],
    ["Scope creep", "", "", "", ""],
    ["Implementation delays", "", "", "", ""],
    ["Underestimated administration", "", "", "", ""],
    ["Unexpected licence growth", "", "", "", ""],
    ["Weak process ownership", "", "", "", ""],
    ["Data-quality problems", "", "", "", ""],
    ["", "", "", "", ""],
    [],
    ["Key dependency", "Secured? (Y/N)", "Owner", "Notes"],
    ["Executive sponsorship", "", "", ""],
    ["Process owners", "", "", ""],
    ["Data readiness", "", "", ""],
    ["Integration capacity", "", "", ""],
    ["Training capacity", "", "", ""],
    ["Procurement", "", "", ""],
    ["Security / privacy review", "", "", ""],
  ];

  const impl: AOA = [
    ["09 — IMPLEMENTATION & BENEFIT REALISATION"],
    [],
    ["Milestone", "Target date", "Owner", "Success gate"],
    ["Approval", "", "", ""],
    ["Vendor / Contract", "", "", ""],
    ["Design", "", "", ""],
    ["Configuration", "", "", ""],
    ["Migration", "", "", ""],
    ["Training", "", "", ""],
    ["Go-live", "", "", ""],
    ["Adoption", "", "", ""],
    ["Benefits review", "", "", ""],
    [],
    ["Checkpoint", "Measures", "Owner", "Status"],
    ["30-day", "", "", ""],
    ["90-day", "", "", ""],
    ["6-month", "", "", ""],
    ["12-month", "", "", ""],
  ];

  const assumptions: AOA = [
    ["10 — ASSUMPTIONS REGISTER"],
    [],
    [
      "ID",
      "Assumption",
      "Value",
      "Type",
      "Source",
      "Owner",
      "Confidence",
      "Validation required?",
    ],
    ["A1", "", "", "", "", "", "", ""],
    ["A2", "", "", "", "", "", "", ""],
    ["A3", "", "", "", "", "", "", ""],
    ["A4", "", "", "", "", "", "", ""],
    ["A5", "", "", "", "", "", "", ""],
    ["A6", "", "", "", "", "", "", ""],
    ["A7", "", "", "", "", "", "", ""],
    ["A8", "", "", "", "", "", "", ""],
    [],
    ["Confidence"],
    ["Verified = supported by known evidence"],
    ["Estimated = reasoned internal estimate"],
    ["Scenario = hypothetical modelling assumption"],
    ["Unknown = still requires validation"],
  ];

  const decision: AOA = [
    ["11 — DECISION"],
    [],
    ["Decision requested"],
    [""],
    [],
    ["Decision outcome (mark one)"],
    ["Approved", ""],
    ["Approved with conditions", ""],
    ["More information required", ""],
    ["Not approved", ""],
    [],
    ["Conditions / comments"],
    [""],
    [""],
    [],
    ["Executive sponsor", ""],
    ["Finance / procurement", ""],
    ["Decision date", ""],
    [],
    ["Final investment summary (linked)"],
    ["Year 1 investment", "='05_TCO'!B24"],
    ["Annual recurring", "='05_TCO'!B35"],
    ["3-year TCO", "='05_TCO'!B37"],
    ["Expected annual benefit", "='06_BENEFITS'!B27"],
    ["Expected payback (months)", "='07_FINANCIAL_MODEL'!B16"],
    ["ROI %", "='07_FINANCIAL_MODEL'!B15"],
    ["Overall confidence", ""],
  ];

  return [
    { name: "00_READ_ME", aoa: readme, cols: [{ wch: 36 }, { wch: 72 }] },
    {
      name: "01_EXECUTIVE_SUMMARY",
      aoa: exec,
      cols: [{ wch: 32 }, { wch: 40 }, { wch: 24 }],
    },
    {
      name: "02_CURRENT_STATE",
      aoa: current,
      cols: [
        { wch: 28 },
        { wch: 22 },
        { wch: 14 },
        { wch: 14 },
        { wch: 28 },
        { wch: 22 },
      ],
    },
    {
      name: "03_BASELINE",
      aoa: baseline,
      cols: [{ wch: 36 }, { wch: 16 }, { wch: 20 }, { wch: 24 }],
    },
    {
      name: "04_OPTIONS",
      aoa: options,
      cols: [{ wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 28 }, { wch: 22 }],
    },
    {
      name: "05_TCO",
      aoa: tco,
      cols: [{ wch: 36 }, { wch: 14 }, { wch: 14 }, { wch: 36 }],
    },
    {
      name: "06_BENEFITS",
      aoa: benefits,
      cols: [{ wch: 36 }, { wch: 18 }, { wch: 18 }, { wch: 36 }],
    },
    {
      name: "07_FINANCIAL_MODEL",
      aoa: financial,
      cols: [{ wch: 28 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 18 }],
    },
    {
      name: "08_RISKS",
      aoa: risks,
      cols: [{ wch: 32 }, { wch: 14 }, { wch: 12 }, { wch: 36 }, { wch: 16 }],
    },
    {
      name: "09_IMPLEMENTATION",
      aoa: impl,
      cols: [{ wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 36 }],
    },
    {
      name: "10_ASSUMPTIONS",
      aoa: assumptions,
      cols: [
        { wch: 6 },
        { wch: 28 },
        { wch: 14 },
        { wch: 12 },
        { wch: 16 },
        { wch: 14 },
        { wch: 14 },
        { wch: 16 },
      ],
    },
    { name: "11_DECISION", aoa: decision, cols: [{ wch: 36 }, { wch: 40 }] },
  ];
}

export async function buildCrmBusinessCaseXlsxBuffer(): Promise<Buffer> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const sheets = buildCrmBusinessCaseWorkbookAoa();

  for (const s of sheets) {
    const ws = XLSX.utils.aoa_to_sheet(
      s.aoa.map((row) =>
        row.map((cell) =>
          typeof cell === "string" && cell.startsWith("=") ? null : cell,
        ),
      ),
    );
    if (s.cols) ws["!cols"] = s.cols;

    // Write formulas explicitly (SheetJS needs { f } cells; avoid stripping on write)
    s.aoa.forEach((row, r) => {
      row.forEach((value, c) => {
        if (typeof value === "string" && value.startsWith("=")) {
          const addr = XLSX.utils.encode_cell({ r, c });
          ws[addr] = { t: "n", f: value.slice(1), v: 0 };
        }
      });
    });

    // Ensure !ref covers formula cells
    const range = XLSX.utils.decode_range(ws["!ref"] ?? "A1");
    s.aoa.forEach((row, r) => {
      range.e.r = Math.max(range.e.r, r);
      range.e.c = Math.max(range.e.c, row.length - 1);
    });
    ws["!ref"] = XLSX.utils.encode_range(range);

    XLSX.utils.book_append_sheet(wb, ws, s.name);
  }

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
