import { Page } from '@playwright/test';

/**
 * Base page for functionality shared by page objects.
 *
 * Common browser-level behavior such as navigation and cookie handling
 * is kept here so it does not need to be repeated in every page object.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a relative application path.
   *
   * DOMContentLoaded is used instead of networkidle because modern websites
   * can continue making background network requests after the page is usable.
   */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path, {
      waitUntil: 'domcontentloaded',
    });
  }

  /**
   * Waits for the cookie banner to appear before test interaction begins.
   *
   * The banner sometimes appears several seconds after the initial page load.
   * If it appears, it is dismissed before any form data is entered.
   *
   * If it does not appear within the expected period, the test continues.
   */
  async dismissCookieBannerIfPresent(): Promise<void> {
    const optOutButton = this.page.getByRole('button', {
      name: 'Opt Out',
    });

    try {
      await optOutButton.waitFor({
        state: 'visible',
        timeout: 8000,
      });

      await optOutButton.click();

      // The website may refresh/re-render after cookie consent is saved.
      // Waiting for the button to disappear ensures that process has started
      // before the test proceeds to the form.
      await optOutButton
        .waitFor({
          state: 'hidden',
          timeout: 5000,
        })
        .catch(() => {
          // The element may disappear because the page itself was replaced.
        });
    } catch {
      // The banner did not appear within the expected time.
      // Continue without failing the test.
    }
  }
}