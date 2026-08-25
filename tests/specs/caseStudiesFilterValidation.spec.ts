import { test, expect } from '../fixtures/pageFixtures';
import { caseStudyFilters } from '../data/testData';

/**
 * Case Studies filter tests.
 *
 * The suite verifies:
 * 1. A valid filter combination can be applied successfully.
 * 2. A known zero-result combination should display a friendly
 *    empty-state message.
 *
 * BUG-001 documents the current missing empty-state behavior.
 */
test.describe('Case Studies filter', () => {

  test.beforeEach(async ({ caseStudiesPage }) => {
    await test.step('Open the Resources page', async () => {
      await caseStudiesPage.gotoCaseStudies();
    });
  });


  // ===========================================================================
  // Test 1 - Valid filter combination
  // ===========================================================================

  test(
    'applies valid Case Study filters successfully',
    async ({ caseStudiesPage }) => {

      await test.step(
        'Apply Case Study and Higher Education filters',
        async () => {
          await caseStudiesPage.applyFilters(
            caseStudyFilters.type,
            caseStudyFilters.validCategoryWithResults
          );
        }
      );

      await test.step(
        'Verify the selected filters',
        async () => {
          expect(
            await caseStudiesPage.getSelectedType()
          ).toBe(caseStudyFilters.type);

          expect(
            await caseStudiesPage.getSelectedCategory()
          ).toBe(caseStudyFilters.validCategoryWithResults);
        }
      );
    }
  );


  // ===========================================================================
  // Test 2 - Known defect
  // ===========================================================================

  test(
    'shows a friendly message when no Case Studies match (BUG-001)',
    async ({ caseStudiesPage }) => {

      await test.step(
        'Apply Case Study and Microsoft 365 Copilot filters',
        async () => {
          await caseStudiesPage.applyFilters(
            caseStudyFilters.type,
            caseStudyFilters.categoryWithNoResults
          );
        }
      );

      await test.step(
        'Verify the expected filters are selected',
        async () => {
          expect(
            await caseStudiesPage.getSelectedType()
          ).toBe(caseStudyFilters.type);

          expect(
            await caseStudiesPage.getSelectedCategory()
          ).toBe(caseStudyFilters.categoryWithNoResults);
        }
      );

      await test.step(
        'Verify a friendly empty-state message is displayed',
        async () => {
          const hasMessage =
            await caseStudiesPage.hasEmptyStateMessage();

          expect(hasMessage).toBe(true);
        }
      );
    }
  );

});