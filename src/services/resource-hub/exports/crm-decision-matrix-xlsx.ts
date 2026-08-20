/**
 * CRM Decision Matrix — Excel decision engine (slug: crm-comparison-worksheet).
 * Blank inputs + SAMPLE-marked examples only. Formulas compute when opened in Excel.
 * Do not invent vendor scores, prices, or evidence.
 */

type AOA = (string | number | null)[][];

/** Build all sheets as array-of-arrays; formulas as Excel formula strings. */
export function buildCrmDecisionMatrixWorkbookAoa(): {
  name: string;
  aoa: AOA;
  cols?: { wch: number }[];
}[] {
  const readme: AOA = [
    ["SoftwareGlimpse — CRM Decision Matrix (Excel)"],
    ["Updated", new Date().toISOString().slice(0, 10)],
    ["Stable slug", "crm-comparison-worksheet"],
    [],
    ["Purpose"],
    [
      "Compare CRM finalists with must-have gates, weighted criteria, evidence, cost/TCO, and risk — then record a recommendation. This workbook is a calculation engine; leave unknowns blank.",
    ],
    [],
    ["How to use"],
    ["1. Complete 01_SETUP (project, owners, vendor names, decision rules)."],
    [
      "2. Enter PASS / FAIL / UNKNOWN on 02_MUST_HAVE_GATES for each finalist (and status quo if used).",
    ],
    [
      "3. Replace SAMPLE weights on 03_CRITERIA_WEIGHTS so Weight % totals 100.",
    ],
    [
      "4. Score finalists 1–5 (or N/E) on 04_VENDOR_SCORING; weighted columns calculate automatically.",
    ],
    ["5. Log evidence on 05_EVIDENCE with confidence (HIGH / MEDIUM / LOW / UNKNOWN)."],
    [
      "6. Enter only known cost figures on 06_COST_TCO — leave unknown costs blank (never treat blank as 0 in narrative).",
    ],
    ["7. Capture risks on 07_RISK; review 08_RESULTS; explore weight scenarios on 09_SENSITIVITY."],
    ["8. Record the recommendation on 10_RECOMMENDATION; next step is often the CRM Business Case."],
    ["9. SAMPLE rows are teaching examples only — replace or clear them. Do not invent scores, prices, or evidence."],
    [],
    ["Score scale"],
    ["1", "Poor fit"],
    ["2", "Weak fit"],
    ["3", "Adequate fit"],
    ["4", "Strong fit"],
    ["5", "Excellent fit"],
    ["N/E", "Not evaluated — excluded from weighted contribution"],
    [],
    ["Confidence key"],
    ["HIGH", "Strong direct evidence (hands-on, verified docs, written confirmation)"],
    ["MEDIUM", "Partial evidence or reasoned internal judgement"],
    ["LOW", "Weak or indirect evidence"],
    ["UNKNOWN", "Not yet validated — do not treat as proof"],
    [],
    ["Methodology rules"],
    ["Must-have gates are binary: FAIL disqualifies; do not average gates into the weighted score."],
    ["Weighted scoring only applies to criteria that clear gates and are scored (not N/E)."],
    ["Weights must total 100% before comparing weighted totals."],
    ["Unknown costs stay blank — blank is not zero in the decision narrative."],
    ["Charts are optional: build them in Excel from 08_RESULTS after you enter data."],
    ["Do not invent vendor rankings, TCO figures, or evidence rows."],
    [],
    ["Sheet map"],
    ["00_READ_ME", "Instructions, keys, methodology (this sheet)"],
    ["01_SETUP", "Project, owners, vendor names, decision rules"],
    ["02_MUST_HAVE_GATES", "Pass/Fail/Unknown gates + qualification status"],
    ["03_CRITERIA_WEIGHTS", "Weighted criteria (must total 100%)"],
    ["04_VENDOR_SCORING", "1–5 / N/E scores and weighted contributions"],
    ["05_EVIDENCE", "Evidence log by criterion and vendor"],
    ["06_COST_TCO", "Cost lines, Year 1, recurring, 3-year TCO"],
    ["07_RISK", "Risk register"],
    ["08_RESULTS", "Dashboard links — no fabricated rankings"],
    ["09_SENSITIVITY", "Weight scenarios + calculated fit totals + robustness"],
    ["10_RECOMMENDATION", "Decision record and next step"],
    [],
    ["Related SoftwareGlimpse tools & resources"],
    ["CRM Vendor Scorecard", "https://softwareglimpse.com/tools/crm-vendor-scorecard/"],
    ["CRM Requirements Builder", "https://softwareglimpse.com/tools/crm-requirements-builder/"],
    ["CRM Cost Calculator", "https://softwareglimpse.com/tools/crm-cost-calculator/"],
    ["CRM TCO Calculator", "https://softwareglimpse.com/tools/crm-tco-calculator/"],
    ["CRM Finder", "https://softwareglimpse.com/tools/crm-finder/"],
    ["CRM Evaluation Checklist", "https://softwareglimpse.com/resources/crm-evaluation-checklist/"],
    ["CRM Business Case Template", "https://softwareglimpse.com/resources/crm-business-case-template/"],
    ["CRM Decision Matrix (this resource)", "https://softwareglimpse.com/resources/crm-comparison-worksheet/"],
  ];

  const setup: AOA = [
    ["01 — SETUP"],
    [],
    ["Project", ""],
    ["Decision owner", ""],
    ["Deadline", ""],
    ["Evaluation team", ""],
    [],
    ["VENDOR NAMES (enter finalists — leave unused columns blank)"],
    ["Vendor A name", ""],
    ["Vendor B name", ""],
    ["Vendor C name", ""],
    ["Vendor D name", ""],
    ["Status quo (optional)", ""],
    [],
    ["DECISION RULES (prompts — answer in your words)"],
    ["What must be true for a vendor to remain eligible?", ""],
    ["How will we treat UNKNOWN gates?", ""],
    ["When do weighted scores decide vs cost/risk judgement?", ""],
    ["Who has final approval authority?", ""],
    ["What evidence confidence is required for a recommendation?", ""],
  ];

  // 02_MUST_HAVE_GATES
  // Row index (0-based): title 0, blank 1, note 2, blank 3, header 4, samples 5–6, blanks 7–14 (8 rows)
  // Excel rows: header row 5, data rows 6–15 (10 requirement rows). COUNTIF uses C6:C20 for room to extend.
  const gates: AOA = [
    ["02 — MUST-HAVE GATES"],
    [],
    [
      "Enter PASS, FAIL, or UNKNOWN in vendor columns. SAMPLE rows are examples only — replace or clear. Do not invent results.",
    ],
    [],
    [
      "Requirement",
      "Why mandatory",
      "Vendor A",
      "Vendor B",
      "Vendor C",
      "Vendor D",
      "Status quo",
    ],
    [
      "SAMPLE — Required CRM data export",
      "SAMPLE — Must export contacts, accounts, and history without lock-in",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "SAMPLE — Required API access",
      "SAMPLE — Must integrate with existing stack via documented API",
      "",
      "",
      "",
      "",
      "",
    ],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    [],
    ["COUNTS (formulas — update range if you add rows beyond row 20)"],
    [
      "Pass count",
      "",
      '=COUNTIF(C6:C20,"PASS")',
      '=COUNTIF(D6:D20,"PASS")',
      '=COUNTIF(E6:E20,"PASS")',
      '=COUNTIF(F6:F20,"PASS")',
      '=COUNTIF(G6:G20,"PASS")',
    ],
    [
      "Fail count",
      "",
      '=COUNTIF(C6:C20,"FAIL")',
      '=COUNTIF(D6:D20,"FAIL")',
      '=COUNTIF(E6:E20,"FAIL")',
      '=COUNTIF(F6:F20,"FAIL")',
      '=COUNTIF(G6:G20,"FAIL")',
    ],
    [
      "Unknown count",
      "",
      '=COUNTIF(C6:C20,"UNKNOWN")',
      '=COUNTIF(D6:D20,"UNKNOWN")',
      '=COUNTIF(E6:E20,"UNKNOWN")',
      '=COUNTIF(F6:F20,"UNKNOWN")',
      '=COUNTIF(G6:G20,"UNKNOWN")',
    ],
    [],
    ["QUALIFICATION STATUS"],
    [
      "Status",
      "",
      '=IF(C19>0,"DISQUALIFIED",IF(C20>0,"QUALIFIED PENDING",IF(C18>0,"QUALIFIED","—")))',
      '=IF(D19>0,"DISQUALIFIED",IF(D20>0,"QUALIFIED PENDING",IF(D18>0,"QUALIFIED","—")))',
      '=IF(E19>0,"DISQUALIFIED",IF(E20>0,"QUALIFIED PENDING",IF(E18>0,"QUALIFIED","—")))',
      '=IF(F19>0,"DISQUALIFIED",IF(F20>0,"QUALIFIED PENDING",IF(F18>0,"QUALIFIED","—")))',
      '=IF(G19>0,"DISQUALIFIED",IF(G20>0,"QUALIFIED PENDING",IF(G18>0,"QUALIFIED","—")))',
    ],
    [],
    [
      "Rule",
      "If Fail > 0 → DISQUALIFIED; else if Unknown > 0 → QUALIFIED PENDING; else if Pass > 0 → QUALIFIED; else —",
    ],
  ];

  // 03_CRITERIA_WEIGHTS — SAMPLE rows sum to 100. Replace with your own priorities.
  const weights: AOA = [
    ["03 — CRITERIA WEIGHTS"],
    [],
    [
      "SAMPLE WEIGHTS — REPLACE WITH YOUR OWN. Rows below sum to 100%. Leave unused criteria blank or set weight to 0 after reallocating.",
    ],
    [],
    ["Category", "Criterion", "Why it matters", "Weight %", "Owner"],
    [
      "SAMPLE — CORE CRM",
      "Pipeline",
      "SAMPLE — Visibility and stage hygiene for forecastable pipeline",
      15,
      "",
    ],
    [
      "SAMPLE — CORE CRM",
      "Contact / account",
      "SAMPLE — Reliable account and contact records",
      7,
      "",
    ],
    [
      "SAMPLE — CORE CRM",
      "Activity",
      "SAMPLE — Capture of calls, meetings, and tasks",
      5,
      "",
    ],
    [
      "SAMPLE — SALES EXECUTION",
      "Automation",
      "SAMPLE — Reduce manual sales admin",
      10,
      "",
    ],
    [
      "SAMPLE — SALES EXECUTION",
      "Lead management",
      "SAMPLE — Routing, scoring, and follow-up discipline",
      7,
      "",
    ],
    [
      "SAMPLE — SALES EXECUTION",
      "Forecasting",
      "SAMPLE — Credible forecast inputs and roll-up",
      5,
      "",
    ],
    [
      "SAMPLE — USABILITY",
      "Ease of use",
      "SAMPLE — Day-to-day usability for sellers",
      10,
      "",
    ],
    [
      "SAMPLE — USABILITY",
      "Mobile",
      "SAMPLE — Field / on-the-go access",
      3,
      "",
    ],
    [
      "SAMPLE — USABILITY",
      "Adoption",
      "SAMPLE — Likelihood teams will actually use it",
      4,
      "",
    ],
    [
      "SAMPLE — PLATFORM",
      "Integrations",
      "SAMPLE — Fit with email, calendar, marketing, support",
      8,
      "",
    ],
    [
      "SAMPLE — PLATFORM",
      "API",
      "SAMPLE — Extensibility and sync options",
      3,
      "",
    ],
    [
      "SAMPLE — PLATFORM",
      "Customization",
      "SAMPLE — Fields, workflows, and objects you need",
      5,
      "",
    ],
    [
      "SAMPLE — PLATFORM",
      "Admin",
      "SAMPLE — Administration overhead and control",
      4,
      "",
    ],
    [
      "SAMPLE — OPERATIONS",
      "Reporting",
      "SAMPLE — Operational and management reporting",
      5,
      "",
    ],
    [
      "SAMPLE — OPERATIONS",
      "Data management",
      "SAMPLE — Deduping, enrichment, governance",
      4,
      "",
    ],
    [
      "SAMPLE — COMMERCIAL",
      "Value",
      "SAMPLE — Fit vs commercial terms (not a price claim)",
      5,
      "",
    ],
    [],
    ["TOTAL weight %", "", "", "=SUM(D6:D21)", ""],
    [
      "Weight check",
      "",
      "",
      '=IF(D23=100,"WEIGHTS OK","WEIGHTS DO NOT TOTAL 100%")',
      "",
    ],
    [],
    [
      "Note",
      "Replace every SAMPLE weight with your committee’s priorities before treating totals as decision-ready.",
    ],
  ];

  // 04_VENDOR_SCORING — criteria rows 5–20 mirror weights D6:D21 / B6:B21
  // Header row 4 (Excel row 5); data Excel rows 6–21; totals Excel row 23
  const scoringHeader = [
    "Criterion",
    "Weight",
    "A Score",
    "A Conf",
    "A Wtd",
    "B Score",
    "B Conf",
    "B Wtd",
    "C Score",
    "C Conf",
    "C Wtd",
    "D Score",
    "D Conf",
    "D Wtd",
  ];

  const scoringRows: AOA = [];
  for (let i = 0; i < 16; i++) {
    const wr = 6 + i; // 03 sheet Excel row
    const scoreRow = 6 + i; // this sheet Excel row
    scoringRows.push([
      `='03_CRITERIA_WEIGHTS'!B${wr}`,
      `='03_CRITERIA_WEIGHTS'!D${wr}`,
      "",
      "",
      `=IF(OR(C${scoreRow}="",C${scoreRow}="N/E"),"",C${scoreRow}/5*B${scoreRow})`,
      "",
      "",
      `=IF(OR(F${scoreRow}="",F${scoreRow}="N/E"),"",F${scoreRow}/5*B${scoreRow})`,
      "",
      "",
      `=IF(OR(I${scoreRow}="",I${scoreRow}="N/E"),"",I${scoreRow}/5*B${scoreRow})`,
      "",
      "",
      `=IF(OR(L${scoreRow}="",L${scoreRow}="N/E"),"",L${scoreRow}/5*B${scoreRow})`,
    ]);
  }

  const scoring: AOA = [
    ["04 — VENDOR SCORING"],
    [],
    [
      "Enter Score as 1–5 or N/E. Confidence: HIGH / MEDIUM / LOW / UNKNOWN. Weighted = score/5 × weight% when score is entered. Leave scores blank until evidenced.",
    ],
    [],
    scoringHeader,
    ...scoringRows,
    [],
    [
      "TOTALS (weighted contribution)",
      "",
      "",
      "",
      "=SUM(E6:E21)",
      "",
      "",
      "=SUM(H6:H21)",
      "",
      "",
      "=SUM(K6:K21)",
      "",
      "",
      "=SUM(N6:N21)",
    ],
    [],
    [
      "Note",
      "Totals are only meaningful after weights total 100% and you enter scores. N/E and blank scores contribute nothing. No ranking is invented here.",
    ],
  ];

  const evidence: AOA = [
    ["05 — EVIDENCE LOG"],
    [],
    [
      "Evidence types (use in Evidence type column): Hands-on test; Trial; Vendor demo; Official documentation; Written vendor confirmation; Pricing documentation; Reference/customer evidence; Internal evaluation; Unknown",
    ],
    [],
    [
      "Criterion",
      "Vendor",
      "Evidence type",
      "Description",
      "Source/URL",
      "Date",
      "Evaluator",
      "Confidence",
      "Follow-up?",
    ],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    [],
    [
      "Note",
      "Do not invent evidence. Confidence must be HIGH, MEDIUM, LOW, or UNKNOWN.",
    ],
  ];

  // 06_COST_TCO
  // Excel: header row 5; cost lines 6–14; Year 1 row 15; blank 16; Annual recurring 17; 3-year 18
  const cost: AOA = [
    ["06 — COST / TCO"],
    [],
    [
      "Enter only known or estimated figures. Leave unknown costs blank — blank is not zero in the decision narrative. No sample prices.",
    ],
    [],
    ["Cost line", "Vendor A", "Vendor B", "Vendor C", "Vendor D"],
    ["Licences", "", "", "", ""],
    ["Add-ons", "", "", "", ""],
    ["Implementation", "", "", "", ""],
    ["Migration", "", "", "", ""],
    ["Integration", "", "", "", ""],
    ["Training", "", "", "", ""],
    ["Internal labour", "", "", "", ""],
    ["Support", "", "", "", ""],
    ["Other", "", "", "", ""],
    [
      "Year 1",
      "=SUM(B6:B14)",
      "=SUM(C6:C14)",
      "=SUM(D6:D14)",
      "=SUM(E6:E14)",
    ],
    [],
    ["Annual recurring", "", "", "", ""],
    [],
    [
      "3-year TCO",
      "=IF(AND(B15=\"\",B17=\"\"),\"\",IF(B15=\"\",0,B15)+2*IF(B17=\"\",0,B17))",
      "=IF(AND(C15=\"\",C17=\"\"),\"\",IF(C15=\"\",0,C15)+2*IF(C17=\"\",0,C17))",
      "=IF(AND(D15=\"\",D17=\"\"),\"\",IF(D15=\"\",0,D15)+2*IF(D17=\"\",0,D17))",
      "=IF(AND(E15=\"\",E17=\"\"),\"\",IF(E15=\"\",0,E15)+2*IF(E17=\"\",0,E17))",
    ],
    [],
    [
      "Assumption",
      "3-year TCO = Year 1 + 2 × Annual recurring (assumes Y2 and Y3 recurring equal annual recurring). Edit if years differ. If both Year 1 and Annual recurring are blank, TCO stays blank.",
    ],
  ];

  const risk: AOA = [
    ["07 — RISK"],
    [],
    ["Vendor", "Risk", "Likelihood", "Impact", "Mitigation", "Owner"],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    [],
    [
      "Note",
      "Likelihood / Impact: use your scale (e.g. High/Medium/Low). Do not invent residual risk ratings.",
    ],
  ];

  const results: AOA = [
    ["08 — RESULTS DASHBOARD"],
    [],
    [
      "Linked outputs only — enter data on other sheets. Do not invent rankings. Build charts in Excel from these cells if useful.",
    ],
    [],
    ["QUALIFICATION (from 02_MUST_HAVE_GATES)"],
    ["Vendor", "Name (from setup)", "Qualification status"],
    [
      "Vendor A",
      "='01_SETUP'!B9",
      "='02_MUST_HAVE_GATES'!C23",
    ],
    [
      "Vendor B",
      "='01_SETUP'!B10",
      "='02_MUST_HAVE_GATES'!D23",
    ],
    [
      "Vendor C",
      "='01_SETUP'!B11",
      "='02_MUST_HAVE_GATES'!E23",
    ],
    [
      "Vendor D",
      "='01_SETUP'!B12",
      "='02_MUST_HAVE_GATES'!F23",
    ],
    [
      "Status quo",
      "='01_SETUP'!B13",
      "='02_MUST_HAVE_GATES'!G23",
    ],
    [],
    ["WEIGHTED TOTALS (from 04_VENDOR_SCORING)"],
    ["Vendor", "Weighted total"],
    ["Vendor A", "='04_VENDOR_SCORING'!E23"],
    ["Vendor B", "='04_VENDOR_SCORING'!H23"],
    ["Vendor C", "='04_VENDOR_SCORING'!K23"],
    ["Vendor D", "='04_VENDOR_SCORING'!N23"],
    [],
    ["WEIGHT CHECK", "='03_CRITERIA_WEIGHTS'!D24"],
    [],
    ["TCO (from 06_COST_TCO)"],
    ["Vendor", "Year 1", "Annual recurring", "3-year TCO"],
    [
      "Vendor A",
      "='06_COST_TCO'!B15",
      "='06_COST_TCO'!B17",
      "='06_COST_TCO'!B19",
    ],
    [
      "Vendor B",
      "='06_COST_TCO'!C15",
      "='06_COST_TCO'!C17",
      "='06_COST_TCO'!C19",
    ],
    [
      "Vendor C",
      "='06_COST_TCO'!D15",
      "='06_COST_TCO'!D17",
      "='06_COST_TCO'!D19",
    ],
    [
      "Vendor D",
      "='06_COST_TCO'!E15",
      "='06_COST_TCO'!E17",
      "='06_COST_TCO'!E19",
    ],
    [],
    ["CHARTS"],
    [
      "Build charts in Excel (Insert → Charts) from the qualification, weighted total, and TCO ranges above after you enter real data. This template does not embed fabricated chart rankings.",
    ],
    [],
    ["Decision notes (optional)"],
    [""],
    [""],
  ];

  // 09_SENSITIVITY — SAMPLE alternate weight sets (sum 100). Totals use scores from 04.
  // Criteria rows Excel 6–21 mirror 03/04. Scenario weight columns C–G.
  // Contribution: score/5 × scenario_weight when score is numeric; blank/N/E excluded.
  const sensWeightHeader = [
    "Criterion",
    "BASE (from 03)",
    "COST-HEAVY (SAMPLE)",
    "USABILITY-HEAVY (SAMPLE)",
    "AUTOMATION-HEAVY (SAMPLE)",
    "INTEGRATIONS-HEAVY (SAMPLE)",
    "REPORTING-HEAVY (SAMPLE)",
  ];
  // SAMPLE redistributions (teaching only). Each column sums to 100.
  // Order matches criteria rows: Pipeline, Contact, Activity, Automation, Lead, Forecast,
  // Ease, Mobile, Adoption, Integrations, API, Customization, Admin, Reporting, Data, Value
  const sensCost = [10, 6, 4, 8, 6, 4, 8, 3, 3, 7, 3, 4, 4, 4, 3, 23];
  const sensUse = [12, 6, 4, 8, 6, 4, 18, 5, 8, 6, 2, 4, 3, 4, 3, 7];
  const sensAuto = [12, 6, 4, 20, 8, 5, 8, 3, 3, 7, 3, 4, 3, 4, 3, 7];
  const sensInt = [12, 6, 4, 8, 6, 4, 8, 3, 3, 18, 6, 5, 3, 4, 3, 7];
  const sensRep = [12, 6, 4, 8, 6, 4, 8, 3, 3, 7, 3, 4, 3, 16, 6, 7];

  const sensRows: AOA = [];
  for (let i = 0; i < 16; i++) {
    const r = 6 + i;
    sensRows.push([
      `='03_CRITERIA_WEIGHTS'!B${r}`,
      `='03_CRITERIA_WEIGHTS'!D${r}`,
      sensCost[i]!,
      sensUse[i]!,
      sensAuto[i]!,
      sensInt[i]!,
      sensRep[i]!,
    ]);
  }

  const wtd = (scoreCol: string, wtCol: string) =>
    `IF(COUNT('04_VENDOR_SCORING'!${scoreCol}6:${scoreCol}21)=0,"",SUMPRODUCT((--ISNUMBER('04_VENDOR_SCORING'!${scoreCol}6:${scoreCol}21))*('04_VENDOR_SCORING'!${scoreCol}6:${scoreCol}21/5)*${wtCol}6:${wtCol}21))`;

  const sensitivity: AOA = [
    ["09 — SENSITIVITY"],
    [],
    [
      "SAMPLE scenario weights below redistribute emphasis while still totaling 100%. Replace with your own scenarios. Weighted totals calculate from scores on 04_VENDOR_SCORING — blank until scores exist. Do not invent winners.",
    ],
    [],
    sensWeightHeader,
    ...sensRows,
    [],
    [
      "TOTAL weight %",
      "=SUM(B6:B21)",
      "=SUM(C6:C21)",
      "=SUM(D6:D21)",
      "=SUM(E6:E21)",
      "=SUM(F6:F21)",
      "=SUM(G6:G21)",
    ],
    [
      "Weight check",
      '=IF(B23=100,"OK","≠100")',
      '=IF(C23=100,"OK","≠100")',
      '=IF(D23=100,"OK","≠100")',
      '=IF(E23=100,"OK","≠100")',
      '=IF(F23=100,"OK","≠100")',
      '=IF(G23=100,"OK","≠100")',
    ],
    [],
    ["WEIGHTED FIT BY SCENARIO (from 04 scores × scenario weights)"],
    [
      "Vendor",
      "BASE",
      "COST-HEAVY",
      "USABILITY-HEAVY",
      "AUTOMATION-HEAVY",
      "INTEGRATIONS-HEAVY",
      "REPORTING-HEAVY",
    ],
    [
      "Vendor A",
      "='04_VENDOR_SCORING'!E23",
      `=${wtd("C", "C")}`,
      `=${wtd("C", "D")}`,
      `=${wtd("C", "E")}`,
      `=${wtd("C", "F")}`,
      `=${wtd("C", "G")}`,
    ],
    [
      "Vendor B",
      "='04_VENDOR_SCORING'!H23",
      `=${wtd("F", "C")}`,
      `=${wtd("F", "D")}`,
      `=${wtd("F", "E")}`,
      `=${wtd("F", "F")}`,
      `=${wtd("F", "G")}`,
    ],
    [
      "Vendor C",
      "='04_VENDOR_SCORING'!K23",
      `=${wtd("I", "C")}`,
      `=${wtd("I", "D")}`,
      `=${wtd("I", "E")}`,
      `=${wtd("I", "F")}`,
      `=${wtd("I", "G")}`,
    ],
    [
      "Vendor D",
      "='04_VENDOR_SCORING'!N23",
      `=${wtd("L", "C")}`,
      `=${wtd("L", "D")}`,
      `=${wtd("L", "E")}`,
      `=${wtd("L", "F")}`,
      `=${wtd("L", "G")}`,
    ],
    [],
    ["ROBUSTNESS (qualitative — fill after reviewing scenario totals)"],
    ["Indicator", ""],
    ["ROBUST / SENSITIVE / UNRESOLVED", ""],
    [
      "Guidance",
      "ROBUST = same leader across most scenarios with enough evidence. SENSITIVE = leader changes under reasonable reweights. UNRESOLVED = too many N/E, UNKNOWN gates, or blank costs.",
    ],
    [],
    [
      "Note",
      "Scenario columns are SAMPLE redistributions — replace before treating results as final. Totals stay blank until numeric scores exist on 04.",
    ],
  ];

  const recommendation: AOA = [
    ["10 — RECOMMENDATION"],
    [],
    ["We recommend", ""],
    ["Why", ""],
    ["Main trade-off", ""],
    ["Why not runner-up", ""],
    [],
    ["Open conditions (mark Yes/No or checkbox in Excel)"],
    ["[ ] Contract / commercial terms acceptable", ""],
    ["[ ] Security / privacy review complete", ""],
    ["[ ] Integration plan agreed", ""],
    ["[ ] Data migration plan agreed", ""],
    ["[ ] Implementation capacity confirmed", ""],
    ["[ ] Executive sponsor aligned", ""],
    [],
    ["Decision owner", ""],
    ["Approver", ""],
    ["Date", ""],
    [],
    ["Next step", "Build CRM Business Case"],
    [
      "Business Case resource",
      "https://softwareglimpse.com/resources/crm-business-case-template/",
    ],
  ];

  return [
    { name: "00_READ_ME", aoa: readme, cols: [{ wch: 42 }, { wch: 72 }] },
    {
      name: "01_SETUP",
      aoa: setup,
      cols: [{ wch: 48 }, { wch: 48 }],
    },
    {
      name: "02_MUST_HAVE_GATES",
      aoa: gates,
      cols: [
        { wch: 36 },
        { wch: 42 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
      ],
    },
    {
      name: "03_CRITERIA_WEIGHTS",
      aoa: weights,
      cols: [{ wch: 28 }, { wch: 22 }, { wch: 48 }, { wch: 12 }, { wch: 14 }],
    },
    {
      name: "04_VENDOR_SCORING",
      aoa: scoring,
      cols: [
        { wch: 22 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
      ],
    },
    {
      name: "05_EVIDENCE",
      aoa: evidence,
      cols: [
        { wch: 18 },
        { wch: 12 },
        { wch: 22 },
        { wch: 36 },
        { wch: 28 },
        { wch: 12 },
        { wch: 14 },
        { wch: 12 },
        { wch: 12 },
      ],
    },
    {
      name: "06_COST_TCO",
      aoa: cost,
      cols: [{ wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }],
    },
    {
      name: "07_RISK",
      aoa: risk,
      cols: [
        { wch: 14 },
        { wch: 32 },
        { wch: 12 },
        { wch: 12 },
        { wch: 36 },
        { wch: 14 },
      ],
    },
    {
      name: "08_RESULTS",
      aoa: results,
      cols: [{ wch: 16 }, { wch: 28 }, { wch: 22 }, { wch: 14 }],
    },
    {
      name: "09_SENSITIVITY",
      aoa: sensitivity,
      cols: [
        { wch: 22 },
        { wch: 16 },
        { wch: 20 },
        { wch: 22 },
        { wch: 22 },
        { wch: 22 },
        { wch: 22 },
      ],
    },
    {
      name: "10_RECOMMENDATION",
      aoa: recommendation,
      cols: [{ wch: 48 }, { wch: 48 }],
    },
  ];
}

export async function buildCrmDecisionMatrixXlsxBuffer(): Promise<Buffer> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const sheets = buildCrmDecisionMatrixWorkbookAoa();

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
