import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the Get in Touch form.
 *
 * This class contains the locators and reusable actions required to
 * interact with the form. Test cases remain responsible for defining
 * the scenarios and assertions.
 */
export class GetInTouchPage extends BasePage {
  // Page elements
  private readonly pageHeading: Locator;

  // Form fields
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly businessEmailField: Locator;
  private readonly phoneNumberField: Locator;
  private readonly jobFunctionDropdown: Locator;
  private readonly relationshipRadios: Locator;
  private readonly howDidYouHearField: Locator;
  private readonly messageField: Locator;

  // Form validation and submission
  private readonly submitButton: Locator;
  private readonly fieldErrorMessages: Locator;
  private readonly formLevelErrorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Page heading
    this.pageHeading = page.getByRole('heading', {
      name: 'Drop us a line',
    });

    // Form fields
    this.firstNameField = page.getByLabel('First Name');
    this.lastNameField = page.getByLabel('Last Name');
    this.businessEmailField = page.getByLabel('Business Email');
    this.phoneNumberField = page.getByLabel('Phone Number');

    // This is a native HTML select element, so selectOption() is used.
    this.jobFunctionDropdown = page.getByLabel('Job Function');

    this.relationshipRadios = page.getByRole('radio');

    this.howDidYouHearField = page.getByLabel(
      'How did you hear about us?'
    );

    this.messageField = page.getByLabel('Message');

    // Form controls
    this.submitButton = page.getByRole('button', {
      name: 'Submit',
    });
    
    this.fieldErrorMessages = page.locator('.hs-error-msg');

    this.formLevelErrorMessage = page.getByText(
      'Please complete all required fields.',
      { exact: true }
    );
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  /**
   * Opens the Get in Touch page directly.
   *
   * Direct navigation is used by form tests because those tests are focused
   * on form behavior rather than testing the site's navigation menu.
   */
  async gotoGetInTouchPage(): Promise<void> {
    await this.goto('/get-in-touch');
    await this.waitForPageLoad();
    await this.dismissCookieBanner();
  }

  /**
   * Navigates to the Get in Touch page through the Talk to an Expert link.
   *
   * This method is used by the navigation smoke test.
   */
  async navigateToGetInTouchFromHomePage(): Promise<void> {
  await this.goto('/');
  await this.waitForPageLoad();
  await this.dismissCookieBanner();

  // The "Speak to An Expert" link only appears after hovering
  // over the "Get in Touch" nav item, which opens a submenu.
  const getInTouchNavItem = this.page.getByRole('link', {
    name: 'Get in Touch',
    exact: true,
  });
  await getInTouchNavItem.hover();

  const speakToAnExpertLink = this.page.getByRole('link', {
    name: 'Speak to An Expert',
  });
  await speakToAnExpertLink.click();

  await this.waitForPageLoad();
  await this.dismissCookieBanner();
}

  // ---------------------------------------------------------------------------
  // Form actions
  // ---------------------------------------------------------------------------

  /**
   * Fills the text fields supplied by the test.
   *
   * Fields are only filled when a value is provided. This allows negative
   * tests to intentionally leave required fields empty.
   */
  async fillForm(data: {
    firstName?: string;
    lastName?: string;
    businessEmail?: string;
    phoneNumber?: string;
    howDidYouHear?: string;
    message?: string;
  }): Promise<void> {
    if (data.firstName !== undefined) {
      await this.firstNameField.fill(data.firstName);
    }

    if (data.lastName !== undefined) {
      await this.lastNameField.fill(data.lastName);
    }

    if (data.businessEmail !== undefined) {
      await this.businessEmailField.fill(data.businessEmail);
    }

    if (data.phoneNumber !== undefined) {
      await this.phoneNumberField.fill(data.phoneNumber);
    }

    if (data.howDidYouHear !== undefined) {
      await this.howDidYouHearField.fill(data.howDidYouHear);
    }

    if (data.message !== undefined) {
      await this.messageField.fill(data.message);
    }
  }

  /**
   * Selects a specific Job Function from the native HTML select element.
   */
  async selectJobFunction(jobFunction: string): Promise<void> {
    await this.jobFunctionDropdown.selectOption({
      label: jobFunction,
    });
  }

  /**
   * Selects a relationship option by its accessible name.
   *
   * The exact option label can be supplied by the test data.
   */
  async selectRelationship(optionLabel: string): Promise<void> {
  await this.page
    .getByRole('radio', { name: optionLabel })
    .check();
}

  /**
   * Submits the form.
   *
   * Tests should only call this when submission is intentionally part of
   * the scenario. Production tests should use a safety guard to avoid
   * creating a real submission.
   */
  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  // ---------------------------------------------------------------------------
  // Page and field accessors
  // ---------------------------------------------------------------------------

  getPageHeading(): Locator {
    return this.pageHeading;
  }

  getFirstNameField(): Locator {
    return this.firstNameField;
  }

  getLastNameField(): Locator {
    return this.lastNameField;
  }

  getBusinessEmailField(): Locator {
    return this.businessEmailField;
  }

  getPhoneNumberField(): Locator {
    return this.phoneNumberField;
  }

  getHowDidYouHearField(): Locator {
    return this.howDidYouHearField;
  }

  getMessageField(): Locator {
    return this.messageField;
  }

  // ---------------------------------------------------------------------------
  // Validation accessors
  // ---------------------------------------------------------------------------

  /**
   * Returns all field-level validation messages.
   */
  getFieldErrorMessages(): Locator {
    return this.fieldErrorMessages;
  }

  /**
   * Returns the number of field-level validation messages currently displayed.
   */
  async getFieldErrorCount(): Promise<number> {
    return this.fieldErrorMessages.count();
  }

  /**
   * Returns the form-level validation message.
   */
  getFormLevelErrorMessage(): Locator {
    return this.formLevelErrorMessage;
  }
  /**
 * Returns the specific validation message for an invalid email format.
 */
getEmailValidationMessage(): Locator {
  return this.page.getByText('Email must be formatted correctly.', { exact: true });
}

/**
 * Returns the specific validation message for an invalid phone number.
 */
getPhoneValidationMessage(): Locator {
  return this.page.getByText('The number you entered is not in range.', { exact: true });
}
}