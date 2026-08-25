import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the Get in Touch form.
 *
 * This class contains the page locators and reusable interactions.
 * Test scenarios and assertions remain inside the spec file.
 */
export class GetInTouchPage extends BasePage {
  // Page
  private readonly pageHeading: Locator;

  // Form fields
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly businessEmailField: Locator;
  private readonly phoneNumberField: Locator;
  private readonly jobFunctionDropdown: Locator;
  private readonly howDidYouHearField: Locator;
  private readonly messageField: Locator;

  // Form controls and validation
  private readonly submitButton: Locator;
  private readonly requiredFieldErrorMessages: Locator;
  private readonly formLevelErrorMessage: Locator;
  private readonly emailValidationMessage: Locator;
  private readonly phoneValidationMessage: Locator;
  private readonly relationshipValidationMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Page heading
    this.pageHeading = page.getByRole('heading', {
      name: 'Drop us a line',
    });

    // Required fields
    this.firstNameField = page.getByLabel('First Name');
    this.lastNameField = page.getByLabel('Last Name');
    this.businessEmailField = page.getByLabel('Business Email');
    this.phoneNumberField = page.getByLabel('Phone Number');
    this.jobFunctionDropdown = page.getByLabel('Job Function');
    this.relationshipValidationMessage = page
    .getByRole('radio', { name: 'Microsoft customer.' })
    .locator(
    'xpath=ancestor::*[contains(@class,"hs-form-field")][1]'
    )
    .locator('.hs-error-msg');

    // Optional fields
    this.howDidYouHearField = page.getByLabel(
      'How did you hear about us?'
    );

    this.messageField = page.getByLabel('Message');

    // Submit button
    this.submitButton = page.getByRole('button', {
      name: 'Submit',
    });

    /**
     * We locate required-field errors using their exact text instead of
     * counting every error on the page.
     *
     * This prevents unrelated validation, such as reCAPTCHA validation,
     * from affecting the required-field error count.
     */
    this.requiredFieldErrorMessages = page.getByText(
      'Please complete this required field.',
      { exact: true }
    );

    this.formLevelErrorMessage = page.getByText(
      'Please complete all required fields.',
      { exact: true }
    );

    this.emailValidationMessage = page.getByText(
      'Email must be formatted correctly.',
      { exact: true }
    );

    this.phoneValidationMessage = page.getByText(
      'The number you entered is not in range.',
      { exact: true }
    );
  }

  // ===========================================================================
  // Navigation
  // ===========================================================================

  /**
   * Opens the Get in Touch page directly.
   *
   * Cookie consent is handled before tests interact with the form because
   * the consent process can cause the page or embedded form to refresh.
   */
  async gotoGetInTouchPage(): Promise<void> {
    await this.goto('/get-in-touch');

    await this.dismissCookieBannerIfPresent();

    /**
     * First Name is used as the form-readiness signal.
     *
     * This wait happens after cookie handling so any consent-related refresh
     * has a chance to complete before the test starts entering data.
     */
    await this.firstNameField.waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }

  // ===========================================================================
  // Form actions
  // ===========================================================================

  /**
   * Fills only the fields provided by the calling test.
   *
   * This allows tests to intentionally leave individual fields empty.
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
   * Selects a Job Function from the native HTML dropdown.
   */
  async selectJobFunction(jobFunction: string): Promise<void> {
    await this.jobFunctionDropdown.selectOption({
      label: jobFunction,
    });
  }

  
  /**
   * Clicks the form Submit button.
   *
   * Tests only call this when the form is intentionally invalid or incomplete,
   * preventing a successful production submission.
   */
  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  // ===========================================================================
  // Field accessors used by assertions
  // ===========================================================================

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

  // ===========================================================================
  // Validation accessors
  // ===========================================================================

  getRequiredFieldErrorMessages(): Locator {
    return this.requiredFieldErrorMessages;
  }

  getFormLevelErrorMessage(): Locator {
    return this.formLevelErrorMessage;
  }

  getEmailValidationMessage(): Locator {
    return this.emailValidationMessage;
  }

  getPhoneValidationMessage(): Locator {
    return this.phoneValidationMessage;
  }
 
  getRelationshipValidationMessage(): Locator {
  return this.relationshipValidationMessage;
}
}