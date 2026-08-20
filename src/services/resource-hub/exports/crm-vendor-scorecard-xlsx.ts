/**
 * CRM Vendor Scorecard — Excel scoring engine (slug: crm-vendor-scorecard).
 * Primary scoring workbook: weighted criteria + must-have gates + evidence.
 * Blank inputs + SAMPLE-marked teaching rows only. Formulas compute when opened in Excel.
 * Do not invent vendor scores, rankings, or evidence.
 */

type AOA = (string | number | null)[][];

/** Criteria data rows on 02 / mirrored on 03: Excel rows 6–19 (14 SAMPLE criteria). */
const CRITERIA_FIRST = 6;
const CRITERIA_LAST = 19;
const CRITERIA_COUNT = CRITERIA_LAST - CRITERIA_FIRST + 1;

type SheetSpec = {
  name: string;
  aoa: AOA;
  cols?: { wch: number }[];
  autofilter?: string;
};

/** Build all sheets as array-of-arrays; formulas as Excel formula strings. */
export function buildCrmVendorScorecardWorkbookAoa(): SheetSpec[] {
  const readme: AOA = [
    ["SoftwareGlimpse — CRM Vendor Scorecard (Excel)"],
    ["Updated", new Date().toISOString().slice(0, 10)],
    ["Stable slug", "crm-vendor-scorecard"],
    [],
    ["Purpose"],
    [
      "This workbook is the PRIMARY SCORING ENGINE for CRM vendor evaluation. Weight your criteria, score finalists 1–5 (or N/E), apply must-have gates, and log evidence. It is not a Pass/Partial/Fail checklist.",
    ],
    [],
    ["How to use"],
    ["1. Complete 01_SETUP (project, evaluator, team, dates, vendor names)."],
    [
      "2. Replace SAMPLE weights on 02_CRITERIA_WEIGHTS so Weight % totals 100. Mark must-haves Yes/No.",
    ],
    [
      "3. Score vendors 1–5 or N/E on 03_VENDOR_SCORING; weighted contributions calculate automatically. Leave scores blank until evidenced.",
    ],
    [
      "4. Enter PASS / FAIL / UNKNOWN on 04_MUST_HAVE_GATES — FAIL disqualifies (do not average gates into the score).",
    ],
    [
      "5. Log evidence on 05_EVIDENCE with confidence (HIGH / MEDIUM / LOW / UNKNOWN).",
    ],
    ["6. Review linked totals and gate status on 06_RESULTS — no fabricated rankings."],
    [
      "7. Record the recommendation on 07_DECISION; next step is often Decision Matrix or Business Case.",
    ],
    [
      "8. SAMPLE rows are teaching examples only — replace or clear them. Do not invent scores or vendor winners.",
    ],
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
    ["Gate rules"],
    ["Must-have gates are binary: FAIL disqualifies; do not average gates into the weighted score."],
    ["If Fail > 0 → DISQUALIFIED; else if Unknown > 0 → QUALIFIED PENDING; else if Pass > 0 → QUALIFIED."],
    ["Weighted scoring only applies to criteria that are scored (not blank or N/E)."],
    ["Weights must total 100% before comparing weighted totals."],
    [],
    ["Differentiation"],
    [
      "vs Decision Matrix",
      "Decision Matrix is the broader finalist decision package (gates + weights + cost/TCO + risk + sensitivity). This Scorecard is the Excel-first scoring engine — criteria, scores, gates, evidence.",
    ],
    [
      "vs Evaluation Checklist",
      "Evaluation Checklist uses Pass / Partial / Fail row results for coverage. This Scorecard uses weighted 1–5 / N/E scoring with must-have PASS/FAIL/UNKNOWN gates — not a checklist dump.",
    ],
    [],
    ["Sheet map"],
    ["00_README", "Purpose, instructions, keys, differentiation (this sheet)"],
    ["01_SETUP", "Project metadata and vendor names"],
    ["02_CRITERIA_WEIGHTS", "Weighted criteria (must total 100%) + must-have flags"],
    ["03_VENDOR_SCORING", "1–5 / N/E scores and weighted contributions"],
    ["04_MUST_HAVE_GATES", "Pass/Fail/Unknown gates + qualification status"],
    ["05_EVIDENCE", "Evidence log by criterion and vendor"],
    ["06_RESULTS", "Dashboard links — no fabricated rankings"],
    ["07_DECISION", "Recommendation record and next step"],
    [],
    ["Related SoftwareGlimpse resources"],
    [
      "CRM Vendor Scorecard (this resource)",
      "https://softwareglimpse.com/resources/crm-vendor-scorecard/",
    ],
    [
      "CRM Vendor Scorecard (interactive tool)",
      "https://softwareglimpse.com/tools/crm-vendor-scorecard/",
    ],
    [
      "CRM Evaluation Checklist",
      "https://softwareglimpse.com/resources/crm-evaluation-checklist/",
    ],
    [
      "CRM Decision Matrix",
      "https://softwareglimpse.com/resources/crm-comparison-worksheet/",
    ],
    [
      "CRM Requirements Template",
      "https://softwareglimpse.com/resources/crm-requirements-template/",
    ],
  ];

  const setup: AOA = [
    ["01 — SETUP"],
    [],
    ["Project", ""],
    ["Evaluator", ""],
    ["Team", ""],
    ["Date", ""],
    ["Version", ""],
    ["Weight freeze date", ""],
    ["Decision deadline", ""],
    [],
    ["VENDOR NAMES (enter finalists — leave unused columns blank)"],
    ["Vendor A name", ""],
    ["Vendor B name", ""],
    ["Vendor C name", ""],
    ["Vendor D name", ""],
    ["Status quo (optional)", ""],
  ];

  // 02_CRITERIA_WEIGHTS — SAMPLE rows sum to 100. Replace with your own priorities.
  // Header Excel row 5; data Excel rows 6–19; TOTAL row 21; check row 22.
  const weights: AOA = [
    ["02 — CRITERIA WEIGHTS"],
    [],
    [
      "SAMPLE WEIGHTS — REPLACE WITH YOUR OWN. Rows below sum to 100%. Mark Must-have Yes/No. Leave unused criteria blank or set weight to 0 after reallocating.",
    ],
    [],
    [
      "Category",
      "Criterion",
      "Description",
      "Weight %",
      "Must-have",
      "Owner",
    ],
    [
      "SAMPLE — CORE CRM",
      "Pipeline",
      "SAMPLE — Visibility and stage hygiene for forecastable pipeline",
      12,
      "Yes",
      "",
    ],
    [
      "SAMPLE — CORE CRM",
      "Contact / account",
      "SAMPLE — Reliable account and contact records",
      8,
      "Yes",
      "",
    ],
    [
      "SAMPLE — CORE CRM",
      "Activity capture",
      "SAMPLE — Capture of calls, meetings, and tasks",
      5,
      "No",
      "",
    ],
    [
      "SAMPLE — SALES",
      "Automation",
      "SAMPLE — Reduce manual sales admin",
      10,
      "No",
      "",
    ],
    [
      "SAMPLE — SALES",
      "Lead management",
      "SAMPLE — Routing, scoring, and follow-up discipline",
      8,
      "No",
      "",
    ],
    [
      "SAMPLE — SALES",
      "Forecasting",
      "SAMPLE — Credible forecast inputs and roll-up",
      5,
      "No",
      "",
    ],
    [
      "SAMPLE — USABILITY",
      "Ease of use",
      "SAMPLE — Day-to-day usability for sellers",
      10,
      "No",
      "",
    ],
    [
      "SAMPLE — USABILITY",
      "Mobile",
      "SAMPLE — Field / on-the-go access",
      3,
      "No",
      "",
    ],
    [
      "SAMPLE — USABILITY",
      "Adoption likelihood",
      "SAMPLE — Likelihood teams will actually use it",
      5,
      "No",
      "",
    ],
    [
      "SAMPLE — PLATFORM",
      "Integrations",
      "SAMPLE — Fit with email, calendar, marketing, support",
      8,
      "Yes",
      "",
    ],
    [
      "SAMPLE — PLATFORM",
      "API / extensibility",
      "SAMPLE — Extensibility and sync options",
      4,
      "No",
      "",
    ],
    [
      "SAMPLE — PLATFORM",
      "Admin / security",
      "SAMPLE — Administration overhead, roles, and control",
      5,
      "Yes",
      "",
    ],
    [
      "SAMPLE — REPORTING",
      "Reporting & dashboards",
      "SAMPLE — Operational and management reporting",
      7,
      "No",
      "",
    ],
    [
      "SAMPLE — COMMERCIAL",
      "Commercial fit",
      "SAMPLE — Fit vs commercial terms (not a price claim)",
      10,
      "No",
      "",
    ],
    [],
    ["TOTAL weight %", "", "", `=SUM(D${CRITERIA_FIRST}:D${CRITERIA_LAST})`, "", ""],
    [
      "Weight check",
      "",
      "",
      '=IF(D21=100,"WEIGHTS OK","WEIGHTS DO NOT TOTAL 100%")',
      "",
      "",
    ],
    [],
    [
      "Note",
      "Replace every SAMPLE weight with your committee’s priorities before treating totals as decision-ready. Must-have Yes rows should also appear as requirements on 04_MUST_HAVE_GATES.",
    ],
  ];

  // 03_VENDOR_SCORING — criteria rows 6–19 mirror 02 B/D/E
  const scoringHeader = [
    "Criterion",
    "Weight",
    "Must-have",
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
  for (let i = 0; i < CRITERIA_COUNT; i++) {
    const wr = CRITERIA_FIRST + i;
    const r = CRITERIA_FIRST + i;
    scoringRows.push([
      `='02_CRITERIA_WEIGHTS'!B${wr}`,
      `='02_CRITERIA_WEIGHTS'!D${wr}`,
      `='02_CRITERIA_WEIGHTS'!E${wr}`,
      "",
      "",
      `=IF(OR(D${r}="",D${r}="N/E"),"",D${r}/5*B${r})`,
      "",
      "",
      `=IF(OR(G${r}="",G${r}="N/E"),"",G${r}/5*B${r})`,
      "",
      "",
      `=IF(OR(J${r}="",J${r}="N/E"),"",J${r}/5*B${r})`,
      "",
      "",
      `=IF(OR(M${r}="",M${r}="N/E"),"",M${r}/5*B${r})`,
    ]);
  }

  const scoring: AOA = [
    ["03 — VENDOR SCORING"],
    [],
    [
      "Enter Score as 1–5 or N/E. Confidence: HIGH / MEDIUM / LOW / UNKNOWN. Weighted = score/5 × weight% when score is entered. Leave scores blank until evidenced — do not invent vendor scores.",
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
      "",
      `=SUM(F${CRITERIA_FIRST}:F${CRITERIA_LAST})`,
      "",
      "",
      `=SUM(I${CRITERIA_FIRST}:I${CRITERIA_LAST})`,
      "",
      "",
      `=SUM(L${CRITERIA_FIRST}:L${CRITERIA_LAST})`,
      "",
      "",
      `=SUM(O${CRITERIA_FIRST}:O${CRITERIA_LAST})`,
    ],
    [],
    [
      "Note",
      "Totals are only meaningful after weights total 100% and you enter scores. N/E and blank scores contribute nothing. No ranking is invented here.",
    ],
  ];

  // 04_MUST_HAVE_GATES — header Excel row 5; data 6–15; counts 18–20; status 23
  const gates: AOA = [
    ["04 — MUST-HAVE GATES"],
    [],
    [
      "Enter PASS, FAIL, or UNKNOWN in vendor columns. SAMPLE rows are examples only — replace or clear. Do not invent results. FAIL disqualifies.",
    ],
    [],
    [
      "Requirement",
      "Why mandatory",
      "Vendor A",
      "Vendor B",
      "Vendor C",
      "Vendor D",
    ],
    [
      "SAMPLE — Required CRM data export",
      "SAMPLE — Must export contacts, accounts, and history without lock-in",
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
    ],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    [],
    ["COUNTS (formulas — update range if you add rows beyond row 20)"],
    [
      "Pass count",
      "",
      '=COUNTIF(C6:C20,"PASS")',
      '=COUNTIF(D6:D20,"PASS")',
      '=COUNTIF(E6:E20,"PASS")',
      '=COUNTIF(F6:F20,"PASS")',
    ],
    [
      "Fail count",
      "",
      '=COUNTIF(C6:C20,"FAIL")',
      '=COUNTIF(D6:D20,"FAIL")',
      '=COUNTIF(E6:E20,"FAIL")',
      '=COUNTIF(F6:F20,"FAIL")',
    ],
    [
      "Unknown count",
      "",
      '=COUNTIF(C6:C20,"UNKNOWN")',
      '=COUNTIF(D6:D20,"UNKNOWN")',
      '=COUNTIF(E6:E20,"UNKNOWN")',
      '=COUNTIF(F6:F20,"UNKNOWN")',
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
    ],
    [],
    [
      "Rule",
      "If Fail > 0 → DISQUALIFIED; else if Unknown > 0 → QUALIFIED PENDING; else if Pass > 0 → QUALIFIED; else —",
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

  // 06_RESULTS — totals row on 03 is Excel 21; gate status Excel 23; setup names B12–B15
  const results: AOA = [
    ["06 — RESULTS DASHBOARD"],
    [],
    [
      "Linked outputs only — enter data on other sheets. Do not invent rankings. Build charts in Excel from these cells if useful.",
    ],
    [],
    ["QUALIFICATION (from 04_MUST_HAVE_GATES)"],
    ["Vendor", "Name (from setup)", "Qualification status"],
    [
      "Vendor A",
      "='01_SETUP'!B12",
      "='04_MUST_HAVE_GATES'!C23",
    ],
    [
      "Vendor B",
      "='01_SETUP'!B13",
      "='04_MUST_HAVE_GATES'!D23",
    ],
    [
      "Vendor C",
      "='01_SETUP'!B14",
      "='04_MUST_HAVE_GATES'!E23",
    ],
    [
      "Vendor D",
      "='01_SETUP'!B15",
      "='04_MUST_HAVE_GATES'!F23",
    ],
    [],
    ["WEIGHTED TOTALS (from 03_VENDOR_SCORING)"],
    ["Vendor", "Weighted total"],
    ["Vendor A", "='03_VENDOR_SCORING'!F21"],
    ["Vendor B", "='03_VENDOR_SCORING'!I21"],
    ["Vendor C", "='03_VENDOR_SCORING'!L21"],
    ["Vendor D", "='03_VENDOR_SCORING'!O21"],
    [],
    ["WEIGHT CHECK", "='02_CRITERIA_WEIGHTS'!D22"],
    [],
    ["CHARTS"],
    [
      "Build charts in Excel (Insert → Charts) from the qualification and weighted total ranges above after you enter real data. This template does not embed fabricated chart rankings.",
    ],
    [],
    ["Decision notes (optional)"],
    [""],
    [""],
  ];

  const decision: AOA = [
    ["07 — DECISION"],
    [],
    ["We recommend", ""],
    ["Why", ""],
    ["Why not runner-up", ""],
    ["Residual risks", ""],
    [],
    ["Conditions (mark Yes/No or checkbox in Excel)"],
    ["[ ] Must-have gates cleared (or exceptions approved)", ""],
    ["[ ] Weights frozen and totals 100%", ""],
    ["[ ] Evidence confidence acceptable for recommendation", ""],
    ["[ ] Security / privacy review complete", ""],
    ["[ ] Commercial terms acceptable", ""],
    ["[ ] Executive sponsor aligned", ""],
    [],
    ["Sign-off — Evaluator", ""],
    ["Sign-off — Decision owner", ""],
    ["Sign-off — Approver", ""],
    ["Date", ""],
    [],
    ["Next step", "Decision Matrix and/or Business Case"],
    [
      "CRM Decision Matrix",
      "https://softwareglimpse.com/resources/crm-comparison-worksheet/",
    ],
    [
      "CRM Business Case Template",
      "https://softwareglimpse.com/resources/crm-business-case-template/",
    ],
  ];

  return [
    { name: "00_README", aoa: readme, cols: [{ wch: 42 }, { wch: 72 }] },
    {
      name: "01_SETUP",
      aoa: setup,
      cols: [{ wch: 48 }, { wch: 48 }],
    },
    {
      name: "02_CRITERIA_WEIGHTS",
      aoa: weights,
      cols: [
        { wch: 28 },
        { wch: 22 },
        { wch: 52 },
        { wch: 12 },
        { wch: 12 },
        { wch: 14 },
      ],
    },
    {
      name: "03_VENDOR_SCORING",
      aoa: scoring,
      cols: [
        { wch: 22 },
        { wch: 10 },
        { wch: 12 },
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
      autofilter: `A5:O${CRITERIA_LAST}`,
    },
    {
      name: "04_MUST_HAVE_GATES",
      aoa: gates,
      cols: [
        { wch: 36 },
        { wch: 42 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
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
      name: "06_RESULTS",
      aoa: results,
      cols: [{ wch: 16 }, { wch: 28 }, { wch: 22 }],
    },
    {
      name: "07_DECISION",
      aoa: decision,
      cols: [{ wch: 52 }, { wch: 48 }],
    },
  ];
}

export async function buildCrmVendorScorecardXlsxBuffer(): Promise<Buffer> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const sheets = buildCrmVendorScorecardWorkbookAoa();

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

    if (s.autofilter) {
      ws["!autofilter"] = { ref: s.autofilter };
    }

    XLSX.utils.book_append_sheet(wb, ws, s.name);
  }

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
