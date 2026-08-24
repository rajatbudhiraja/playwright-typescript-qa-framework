import { test as base } from '@playwright/test';
import { GetInTouchPage } from '../pages/GetInTouchPage';
import { CaseStudiesPage } from '../pages/CaseStudiesPage';

/**
 * Extends Playwright's base test so every test file can request a ready
 * to use page object directly, for example { getInTouchPage }, instead
 * of creating a new one by hand in every single test.
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