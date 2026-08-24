import { test, expect } from '../fixtures/pageFixtures';
import { caseStudyFilters } from '../data/testData';

// This file checks the Case Studies filter on two different scenarios.
// These stay as separate tests because each one uses different filter
// values and represents a genuinely different situation, one where
// results should appear, and one where they should not.
test.describe('Case Studies filter', () => {
  test.beforeEach(async ({ caseStudiesPage }) => {
    await test.step('Navigate to Case Studies page', async () => {
      await caseStudiesPage.gotoCaseStudies();
    });
  });

  test('returns visible case study results for a valid category', async ({ caseStudiesPage }) => {
    await test.step('Apply Case Study and Higher Education filters', async () => {
      await caseStudiesPage.filterByType(caseStudyFilters.type);
      await caseStudiesPage.filterByCategory(caseStudyFilters.validCategoryWithResults);
    });

    await test.step('Check that at least one result is shown', async () => {
      const resultCount = await caseStudiesPage.getResultCount();
      expect(resultCount).toBeGreaterThan(0);
    });
  });

  // This test documents the fix needed for BUG-001. It currently fails
  // on the live site because no friendly message shows up yet when a
  // filter has no matching results.
  test('shows a friendly message when a filter has no matches (BUG-001)', async ({ caseStudiesPage }) => {
    await test.step('Apply Case Study and Microsoft 365 Copilot filters', async () => {
      await caseStudiesPage.filterByType(caseStudyFilters.type);
      await caseStudiesPage.filterByCategory(caseStudyFilters.categoryWithNoResults);
    });

    await test.step('Check that zero results are returned', async () => {
      const resultCount = await caseStudiesPage.getResultCount();
      expect(resultCount).toBe(0);
    });

    await test.step('Check that a friendly message appears instead of a blank page', async () => {
      const hasMessage = await caseStudiesPage.hasEmptyStateMessage();
      expect(hasMessage).toBe(true);
    });
  });
});