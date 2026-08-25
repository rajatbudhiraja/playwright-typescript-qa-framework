import { test as base } from '@playwright/test';
import { GetInTouchPage } from '../pages/GetInTouchPage';
import { CaseStudiesPage } from '../pages/CaseStudiesPage';

/**
 * Extends Playwright's built-in test fixture with reusable page objects.
 *
 * Tests can request these page objects directly instead of creating
 * a new instance inside every test.
 */
type PageFixtures = {
  getInTouchPage: GetInTouchPage;
  caseStudiesPage: CaseStudiesPage;
};

export const test = base.extend<PageFixtures>({
  getInTouchPage: async ({ page }, use) => {
    await use(new GetInTouchPage(page));
  },

  caseStudiesPage: async ({ page }, use) => {
    await use(new CaseStudiesPage(page));
  },
});

export { expect } from '@playwright/test';