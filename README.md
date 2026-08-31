# Orchestry Playwright Framework

A Playwright + TypeScript automation framework testing real features on `orchestry.com`.

The project demonstrates practical UI automation, test design, defect validation, reporting, and Azure DevOps CI/CD using a focused Page Object Model structure.

It is intentionally kept lean and understandable as a Junior SDET reference implementation rather than a large enterprise framework.

## Features

- **Page Object Model (POM)** — separates reusable page interactions from test logic
- **Custom Playwright fixtures** — provides page objects directly to tests and reduces repeated setup
- **Structured test data** — keeps reusable test input values separate from test logic
- **Test categorization** — uses tags such as `@smoke`, `@positive`, and `@negative`
- **Readable execution steps** — uses `test.step()` to make reports easier to understand and debug
- **Multiple reporters** — Playwright HTML, list, Allure, and JSON reporting
- **Failure evidence** — screenshots and video are retained automatically for failed tests
- **Cross-browser configuration** — Chromium, Firefox, and WebKit projects are configured
- **Azure DevOps CI/CD** — Playwright tests run through an Azure DevOps YAML pipeline
- **Self-hosted Windows agent** — pipeline execution runs through a locally configured Azure DevOps agent
- **Quality gate demonstration** — a failed test stage prevents the later deployment stage from running
- **Defect-driven coverage** — includes an automated test for a real UX issue found on the Orchestry website

## Project Structure

```text
playwright-typescript-qa-framework/
├── tests/
│   ├── api/
│   ├── data/
│   │   ├── testData.ts
│   │   └── users.json
│   ├── fixtures/
│   │   └── pageFixtures.ts
│   ├── helpers/
│   │   └── apiClient.ts
│   ├── pages/
│   │   ├── components/
│   │   ├── BasePage.ts
│   │   ├── CaseStudiesPage.ts
│   │   └── GetInTouchPage.ts
│   └── specs/
│       ├── caseStudiesFilterValidation.spec.ts
│       └── getInTouchFormValidation.spec.ts
├── azure-pipelines.yml
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

Quick Start
Prerequisites
Node.js 18+
npm
Installation

git clone <repo-url>
cd playwright-typescript-qa-framework
npm install
npx playwright install

Run Tests

# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run smoke tests only
npx playwright test --grep @smoke

Test Reporting
Playwright HTML Report
npm run report

Allure Report
npm run allure:generate
npm run allure:open

The framework also retains screenshots and video automatically when tests fail.

Test Coverage
### Get in Touch Form

The Get in Touch suite contains focused smoke, positive, and negative scenarios.

Current automated test cases include:

1. Loads the Get in Touch page successfully
2. Allows valid data to be entered and retained in the form fields
3. Allows required field data while optional fields remain empty
4. Shows required fields on the form
5. Allows a Job Function option to be selected
6. Allows invalid email and phone values to be entered for validation testing
7. Allows invalid field values to be corrected with valid data

### Production Safety

The Get in Touch tests run against the public production website.

To prevent accidental creation of real contact requests, the automation does not click the Submit button.

Where a submission would normally occur, the test uses a named `test.step()` and log message to make the intentional production-safety decision visible in the Playwright report.

For example:

```ts
await test.step(
  'Production safety - submission intentionally skipped',
  async () => {
    console.log(
      'Production safety: Submit button was intentionally not clicked.'
    );
  }
);

Case Studies Filter

Current automated test cases include:

Applies valid Case Study filters successfully
Shows a friendly message when no Case Studies match (BUG-001)

The valid scenario applies:

Type: Case Study
Category: Higher Education

and verifies that the expected filter values are selected correctly.

The BUG-001 scenario applies:

Type: Case Study
Category: Microsoft 365 Copilot

The current website returns no matching Case Studies but does not display a user-friendly empty-state message.

The test remains in the suite to document and reproduce the issue until the expected behavior is implemented.

Framework Design
Page Object Model

The framework separates test scenarios from application interaction logic.

Test Spec
   ↓
Fixture
   ↓
Page Object
   ↓
Application
Spec files describe what is being tested
Page objects define how the application is interacted with
Fixtures prepare and provide page objects to tests
Test data files provide reusable input values
BasePage contains shared page behavior
BasePage

BasePage.ts contains common functionality used by multiple page objects, including:

page navigation
shared page-load handling
cookie-banner dismissal
reusable common page behavior

Feature-specific page objects inherit or reuse this common functionality.

Custom Fixtures

pageFixtures.ts creates page-object instances and provides them directly to tests.

Example:
async ({ getInTouchPage }) => {
  // test logic
}

This reduces repeated setup code inside individual tests.

Test Data

Reusable test values are stored in:
tests/data/testData.ts

This keeps test data separate from test logic and makes future updates easier to maintain.

Locators

The framework favors Playwright's user-facing and accessible locators where suitable.

Examples:
getByRole()
getByLabel()
getByText()

These are generally preferred over fragile CSS selectors or generated element IDs because they are less tightly coupled to implementation details.

Test Steps

Tests use test.step() to make execution easier to understand in reports.

Example:
await test.step('Open the Get in Touch page', async () => {
  await getInTouchPage.gotoGetInTouchPage();
});

If a test fails, the report can show which logical step failed rather than only reporting the overall test failure.

Test Automation Approach

The framework does not attempt to automate every possible manual test case.

Automation is prioritized for scenarios that are:

Repeatable
Stable
Business-critical
Frequently executed
Useful for regression testing
Suitable for consistent automated validation

Manual and exploratory testing remain appropriate for areas such as:

subjective usability
visual review
exploratory discovery
rapidly changing functionality
one-time validation

Tests are designed to remain independent and should not depend on another test running successfully first.

Browser Coverage

The Playwright configuration currently includes:

Chromium
Firefox
WebKit

The Azure DevOps pipeline currently runs Chromium to keep CI execution focused and reasonably fast.

Cross-browser CI execution can be expanded based on supported-browser requirements and product risk.

Failure Handling and Debugging

The Playwright configuration includes failure evidence such as:
trace: 'on-first-retry',
screenshot: 'only-on-failure',
video: 'retain-on-failure',

These provide additional information when a test fails.

The framework also favors condition-based waits and Playwright's built-in auto-waiting rather than unnecessary fixed delays.

Azure DevOps CI/CD

The project includes an azure-pipelines.yml file connected to Azure DevOps.

The pipeline demonstrates the following flow:
Compile
   ↓
Build
   ↓
Playwright Test
   ↓
Deploy

Compile Stage

Placeholder stage representing application compilation.

Build Stage

Placeholder stage representing an application build.

Playwright Test Stage

Functional pipeline stage that:

installs project dependencies
installs the required Playwright browser
runs the automated Playwright test suite
returns a failed pipeline result when tests fail
Deploy Stage

Placeholder stage representing application deployment.

The Compile, Build, and Deploy stages are placeholders because this repository contains the QA automation project only and does not contain Orchestry's application source code or deployment infrastructure.

The Playwright Test stage is fully functional.

If automated tests fail, the Deploy stage does not run, demonstrating a basic automated quality gate.

Self-Hosted Azure DevOps Agent

The pipeline currently executes using a self-hosted Windows Azure DevOps agent.

The agent is started locally when pipeline execution is required:
.\run.cmd

The agent remains available while the PowerShell session is running.

It can be stopped using:
Ctrl + C

API and Integration Testing

The framework contains areas reserved for future API and integration automation:
tests/api/
tests/helpers/apiClient.ts

These can be expanded to cover:

REST API validation
backend business rules
authentication and authorization
negative API scenarios
integration workflows
response validation
test-data setup and cleanup

The intended approach is to keep a smaller number of critical end-to-end UI tests while moving suitable validation and data combinations to faster API-level tests.

CI/CD Quality Gate

The pipeline demonstrates a basic quality-gate concept.
Playwright Tests Pass
        ↓
Deploy Stage Can Run

If the automated test stage fails:
Playwright Tests Fail
        ↓
Pipeline Fails
        ↓
Deploy Stage Is Blocked

BUG-001 can be used to demonstrate this behavior because the automated test currently detects an actual unresolved UX issue.

Technology Stack
| Technology                    | Purpose                            |
| ----------------------------- | ---------------------------------- |
| **Playwright**                | Browser automation and test runner |
| **TypeScript**                | Test implementation                |
| **Page Object Model**         | Reusable page abstraction          |
| **Playwright Fixtures**       | Reusable test setup                |
| **Allure**                    | Detailed test reporting            |
| **Git**                       | Version control                    |
| **GitHub**                    | Repository hosting                 |
| **Azure DevOps**              | CI/CD pipeline                     |
| **Windows Self-Hosted Agent** | Pipeline execution environment     |

Future Improvements

Possible future enhancements include:

API test implementation
deeper integration testing
reusable authentication state
additional test-data management
accessibility automation
expanded cross-browser CI execution
cloud execution using services such as BrowserStack
environment-based configuration
parallel CI execution where appropriate

Author

Rajat Budhiraja
QA / SDET
