# Orchestry Playwright Framework

A Playwright + TypeScript automation framework using the Page Object
Model, testing real features on orchestry.com. Built as a focused,
fully-understood reference implementation for junior-level UI test
automation, rather than a large-scale enterprise framework.

## Features

- **Page Object Model** — clean separation of locators from test logic;
  `BasePage` holds shared behavior (navigation, load waits, cookie
  banner dismissal) that every page object inherits
- **Custom fixtures** — page objects are handed directly to tests via
  `{ caseStudiesPage }` / `{ getInTouchPage }`, removing repeated setup
- **Soft and hard assertions** — used deliberately depending on whether
  checks read multiple outcomes off the same action, or represent
  genuinely different scenarios
- **`test.step` throughout** — every test breaks its actions into named
  steps, so a failing test's report shows exactly which step broke, not
  just that the test failed overall
- **Dual reporting** — Playwright's built-in HTML reporter plus Allure,
  for richer step-level detail and screenshots on failure
- **Real, defect-driven test coverage** — one test documents a genuine
  UX bug (BUG-001) found and reported on Orchestry's live site, and is
  expected to fail until the fix ships

## Project Structure

orchestry-playwright-framework/
├── tests/
│ ├── pages/ # Page Object classes
│ │ ├── BasePage.ts
│ │ ├── CaseStudiesPage.ts
│ │ └── GetInTouchPage.ts
│ ├── fixtures/ # Custom Playwright fixtures
│ │ └── pageFixtures.ts
│ ├── data/ # Test input values, kept out of test logic
│ │ └── testData.ts
│ └── specs/ # Test files
│ ├── caseStudiesFilter.spec.ts
│ └── getInTouchFormValidation.spec.ts
├── playwright.config.ts # Main config: baseURL, timeouts, reporters, retries
├── tsconfig.json
├── package.json
└── README.md

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Install
```bash
git clone <repo-url>
cd orchestry-playwright-framework
npm install
npx playwright install
```

### Run tests
```bash
# All tests
npm test

# Watch the browser while it runs
npm run test:headed
```

## Reports

```bash
npm run report              # Playwright's built-in HTML report
npm run allure:generate     # Generate Allure HTML report
npm run allure:open         # Open the Allure report in browser
```

## Test cases included

1. **Case Studies filter** (`specs/caseStudiesFilter.spec.ts`)
   - Valid filter combination (Case Study + Higher Education) returns
     visible results
   - Invalid filter combination (Case Study + Microsoft 365 Copilot)
     returns zero results and should show a friendly explanatory message
     — this test currently fails on the live site, since that message
     doesn't exist yet. It documents the fix needed for BUG-001, a real
     issue found and reported during interview prep. Kept as two
     separate tests, since each represents a genuinely different
     scenario with different filter data.

2. **Get in Touch form validation** (`specs/getInTouchFormValidation.spec.ts`)
   - Submitting the form with all required fields empty shows an error
     on each of the 6 required fields, and shows the form-level summary
     message. Both checks run in one test using soft assertions, since
     they read two outcomes off the same submit action rather than
     representing separate scenarios.

## Design notes

- Locators favor accessible, resilient options first — `getByRole`,
  `getByLabel` — over raw CSS classes or auto-generated ids, so tests
  are less likely to break from unrelated markup or styling changes.
- Navigation uses direct URLs (`goto('/get-in-touch')`,
  `goto('/resources#case-study')`) rather than clicking through the nav
  menu, since neither test is actually testing navigation — this keeps
  each test focused on one behavior.
- `trace: 'on-first-retry'`, plus screenshots and video on failure,
  means a failed test's report includes visual evidence automatically.
- Field locators for individual Get in Touch inputs (name, email, etc.)
  exist in `GetInTouchPage.ts` but aren't used by the current test,
  which only checks empty-submission validation. Kept ready for a
  possible future test that fills in and submits real data.
- Not included on purpose: cross-browser cloud execution (e.g.
  BrowserStack) and a CI pipeline (e.g. Azure DevOps YAML). Both are
  reasonable additions at team scale, but weren't built here since
  there's no real infrastructure behind them yet, and an unused config
  file is worse than no config file.

## Stack

- **Playwright** — browser automation and test runner
- **TypeScript** — type-safe test code
- **Allure** — HTML test reporting with step-level detail

## Author

Rajat Budhiraja — QA / SDET