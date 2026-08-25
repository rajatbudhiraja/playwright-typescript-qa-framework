import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the Case Studies filters on the Resources page.
 */
export class CaseStudiesPage extends BasePage {
  private readonly typeDropdown: Locator;
  private readonly categoryDropdown: Locator;
  private readonly emptyStateMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.typeDropdown = page.getByRole('combobox').first();
    this.categoryDropdown = page.getByRole('combobox').nth(1);

    this.emptyStateMessage = page.getByText(
      /no .* found|no results|check back|stay tuned/i
    );
  }

  /**
   * Opens the Resources page and waits until the filters are ready.
   */
  async gotoCaseStudies(): Promise<void> {
    await this.goto('/resources');

    await this.dismissCookieBannerIfPresent();

    await this.typeDropdown.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    await this.typeDropdown.scrollIntoViewIfNeeded();
  }

  /**
   * Applies the Type and Category filters.
   */
  async applyFilters(
    type: string,
    category: string
  ): Promise<void> {
    await this.typeDropdown.selectOption({
      label: type,
    });

    await this.categoryDropdown.selectOption({
      label: category,
    });
  }

  /**
   * Returns the visible text of the currently selected Type option.
   */
  async getSelectedType(): Promise<string> {
    return this.typeDropdown
      .locator('option:checked')
      .innerText();
  }

  /**
   * Returns the visible text of the currently selected Category option.
   */
  async getSelectedCategory(): Promise<string> {
    return this.categoryDropdown
      .locator('option:checked')
      .innerText();
  }

  /**
   * Checks whether a friendly empty-state message is visible.
   */
  async hasEmptyStateMessage(): Promise<boolean> {
    return this.emptyStateMessage
      .isVisible()
      .catch(() => false);
  }
}