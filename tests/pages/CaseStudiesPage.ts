import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the Case Studies filter section on orchestry.com/resources.
 * Covers selecting the two filter dropdowns and reading back the results,
 * including checking whether a friendly message appears when a filter
 * combination has zero matches.
 */
export class CaseStudiesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators

  private get typeDropdown(): Locator {
    return this.page.getByRole('combobox').first();
  }

  private get categoryDropdown(): Locator {
    return this.page.getByRole('combobox').nth(1);
  }

  private get resultCards(): Locator {
    return this.page.locator('a.link-wrap');
  }

  private get emptyStateMessage(): Locator {
    return this.page.getByText(/no .* found|check back|stay tuned/i);
  }

  // Navigation

  async gotoCaseStudies() {
    await this.goto('/resources#case-study');
    await this.waitForPageLoad();
    await this.dismissCookieBanner();
  }

  // Actions

  async filterByType(value: string) {
    await this.typeDropdown.selectOption({ value });
  }

  async filterByCategory(value: string) {
    await this.categoryDropdown.selectOption({ value });
  }

  // Reads and checks

  async hasEmptyStateMessage(): Promise<boolean> {
    return this.emptyStateMessage.isVisible().catch(() => false);
  }

  async getResultCount(): Promise<number> {
    return this.resultCards.count();
  }
}