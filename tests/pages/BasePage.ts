import { Page } from '@playwright/test';

/**
 * Parent class for all page objects. Holds behavior every page needs,
 * like navigating and waiting for load, plus dismissing the cookie
 * banner, so this logic exists in one place instead of being repeated
 * in every page object.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
  await this.page.goto(path, { waitUntil: 'domcontentloaded' });
}

async waitForPageLoad() {
  await this.page.waitForLoadState('domcontentloaded');
}

  async dismissCookieBanner() {
    const declineButton = this.page.locator('#hs-eu-decline-button');
    if (await declineButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await declineButton.click();
    }
  }
}