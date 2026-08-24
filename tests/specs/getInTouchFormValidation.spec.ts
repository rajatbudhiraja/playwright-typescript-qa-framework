import { test, expect } from '../fixtures/pageFixtures';
import { getInTouchTestData } from '../data/testData';

/**
 * Get in Touch form test suite.
 *
 * Coverage is organized into four areas:
 * 1. Navigation
 * 2. Positive scenarios
 * 3. Negative scenarios
 * 4. Edge scenarios
 *
 * The suite intentionally focuses on high-value scenarios rather than
 * creating a large number of repetitive test cases.
 *
 * The tests run against the production website, so successful form
 * submission is intentionally avoided.
 */
test.describe('Get in Touch form', () => {

  // ===========================================================================
  // Navigation
  // ===========================================================================

  /**
   * Smoke test for the primary user journey into the Get in Touch form.
   *
   * Both the URL and a meaningful page element are verified. The URL confirms
   * that navigation occurred, while the heading confirms that the expected
   * page content loaded.
   */
  test(
    'navigates to the Get in Touch page when clicking Talk to an Expert',
    { tag: '@smoke' },
    async ({ getInTouchPage }) => {
      await test.step('Navigate from the home page to Get in Touch', async () => {
        await getInTouchPage.navigateToGetInTouchFromHomePage();
      });

      await test.step('Verify the expected URL is displayed', async () => {
        await expect(getInTouchPage.page).toHaveURL(/\/get-in-touch\/?$/);
      });

      await test.step('Verify the Get in Touch page heading is visible', async () => {
        await expect(
          getInTouchPage.getPageHeading()
        ).toBeVisible();
      });
    }
  );

  // ===========================================================================
  // Positive scenarios
  // ===========================================================================

  /**
   * Positive scenarios verify that valid user input is accepted.
   *
   * Successful submission is intentionally not performed because the tests
   * run against the production website.
   */
  test.describe('Positive scenarios', () => {

    test.beforeEach(async ({ getInTouchPage }) => {
      await test.step('Open the Get in Touch page', async () => {
        await getInTouchPage.gotoGetInTouchPage();
      });
    });

    test(
      'accepts valid data when all form fields are populated',
      { tag: '@positive' },
      async ({ getInTouchPage }) => {

        await test.step('Enter valid data into all text fields', async () => {
          await getInTouchPage.fillForm(
            getInTouchTestData.valid
          );
        });

        await test.step('Select a valid Job Function', async () => {
          await getInTouchPage.selectJobFunction(
            getInTouchTestData.valid.jobFunction
          );
        });

        /*
         * Relationship is intentionally not selected.
         *
         * This keeps the form incomplete and prevents an accidental
         * production submission while still allowing us to verify that
         * the other fields accept valid input.
         */

        await test.step('Verify the entered text values are retained', async () => {
          await expect(
            getInTouchPage.getFirstNameField()
          ).toHaveValue(getInTouchTestData.valid.firstName);

          await expect(
            getInTouchPage.getLastNameField()
          ).toHaveValue(getInTouchTestData.valid.lastName);

          await expect(
            getInTouchPage.getBusinessEmailField()
          ).toHaveValue(getInTouchTestData.valid.businessEmail);

          await expect(
            getInTouchPage.getPhoneNumberField()
          ).toHaveValue(getInTouchTestData.valid.phoneNumber);

          await expect(
            getInTouchPage.getHowDidYouHearField()
          ).toHaveValue(getInTouchTestData.valid.howDidYouHear);

          await expect(
            getInTouchPage.getMessageField()
          ).toHaveValue(getInTouchTestData.valid.message);
        });

        await test.step('Verify no field validation errors are displayed', async () => {
          await expect(
            getInTouchPage.getFieldErrorMessages()
          ).toHaveCount(0);
        });

        /*
         * In a test or staging environment, this is where the form would
         * normally be submitted and the confirmation message verified.
         *
         * Submission is intentionally skipped for production safety.
         */
      }
    );

    test(
      'accepts valid data when optional fields are left empty',
      { tag: '@positive' },
      async ({ getInTouchPage }) => {

        await test.step('Enter valid data into required text fields', async () => {
          await getInTouchPage.fillForm({
            firstName: getInTouchTestData.valid.firstName,
            lastName: getInTouchTestData.valid.lastName,
            businessEmail: getInTouchTestData.valid.businessEmail,
            phoneNumber: getInTouchTestData.valid.phoneNumber,
          });
        });

        await test.step('Select a valid Job Function', async () => {
          await getInTouchPage.selectJobFunction(
            getInTouchTestData.valid.jobFunction
          );
        });

        /*
         * Relationship is intentionally left empty as a production
         * submission safety guard.
         */

        await test.step('Verify optional text fields remain empty', async () => {
          await expect(
            getInTouchPage.getHowDidYouHearField()
          ).toHaveValue('');

          await expect(
            getInTouchPage.getMessageField()
          ).toHaveValue('');
        });

        await test.step('Verify entered required values are retained', async () => {
          await expect(
            getInTouchPage.getFirstNameField()
          ).toHaveValue(getInTouchTestData.valid.firstName);

          await expect(
            getInTouchPage.getBusinessEmailField()
          ).toHaveValue(getInTouchTestData.valid.businessEmail);
        });

        /*
         * Submission is intentionally skipped because this test runs
         * against production.
         */
      }
    );
  });

  // ===========================================================================
  // Negative scenarios
  // ===========================================================================

  /**
   * Negative scenarios verify that invalid or incomplete input is rejected
   * and appropriate validation feedback is displayed.
   */
  test.describe('Negative scenarios', () => {

    test.beforeEach(async ({ getInTouchPage }) => {
      await test.step('Open the Get in Touch page', async () => {
        await getInTouchPage.gotoGetInTouchPage();
      });
    });

    test(
      'displays validation errors when all required fields are empty',
      { tag: '@negative' },
      async ({ getInTouchPage }) => {

        await test.step('Submit the empty form', async () => {
          await getInTouchPage.submitForm();
        });

        await test.step('Verify all six required fields display validation errors', async () => {
          await expect(
            getInTouchPage.getFieldErrorMessages()
          ).toHaveCount(6);
        });

        await test.step('Verify the form-level validation message is displayed', async () => {
          await expect(
            getInTouchPage.getFormLevelErrorMessage()
          ).toBeVisible();
        });
      }
    );

    test(
      'displays validation errors when required fields are left empty',
      { tag: '@negative' },
      async ({ getInTouchPage }) => {

        await test.step(
          'Enter valid data while intentionally leaving required fields empty',
          async () => {

            await getInTouchPage.fillForm({
              firstName: getInTouchTestData.valid.firstName,
              lastName: getInTouchTestData.valid.lastName,
              businessEmail: getInTouchTestData.valid.businessEmail,
              phoneNumber: getInTouchTestData.valid.phoneNumber,
              howDidYouHear: getInTouchTestData.valid.howDidYouHear,
              message: getInTouchTestData.valid.message,
            });

            /*
             * Job Function and Relationship are intentionally left empty.
             * This prevents the form from being successfully submitted
             * against the production environment.
             */
          }
        );

        await test.step('Submit the incomplete form', async () => {
          await getInTouchPage.submitForm();
        });

        await test.step('Verify validation errors are displayed', async () => {
          await expect(
            getInTouchPage.getFieldErrorMessages()
          ).toHaveCount(2);
        });

        await test.step('Verify the form-level validation message is displayed', async () => {
          await expect(
            getInTouchPage.getFormLevelErrorMessage()
          ).toBeVisible();
        });
      }
    );

    test(
      'displays the correct validation messages for invalid email and phone number',
      { tag: '@negative' },
      async ({ getInTouchPage }) => {

        await test.step('Enter an invalid email and phone number', async () => {
          await getInTouchPage.fillForm({
            firstName: getInTouchTestData.valid.firstName,
            lastName: getInTouchTestData.valid.lastName,
            businessEmail: getInTouchTestData.invalid.businessEmail,
            phoneNumber: getInTouchTestData.invalid.phoneNumber,
            howDidYouHear: getInTouchTestData.valid.howDidYouHear,
            message: getInTouchTestData.valid.message,
          });

          /*
           * Required Job Function and Relationship fields are intentionally
           * left empty to prevent accidental production submission.
           */
        });

        await test.step('Submit the intentionally incomplete form', async () => {
          await getInTouchPage.submitForm();
        });

        await test.step('Verify the email validation message', async () => {
          await expect(getInTouchPage.getEmailValidationMessage()).toBeVisible();
        });

        await test.step('Verify the phone validation message', async () => {
          await expect(getInTouchPage.getPhoneValidationMessage()).toBeVisible();
        });
      }
    );
  });

  // ===========================================================================
  // Edge scenarios
  // ===========================================================================

  /**
   * No character limit has been identified for the "How did you hear about
   * us?" and "Message" fields. This test therefore uses long input to verify
   * that reasonably large values are handled without unexpected validation.
   */
  test.describe('Edge scenarios', () => {

    test.beforeEach(async ({ getInTouchPage }) => {
      await test.step('Open the Get in Touch page', async () => {
        await getInTouchPage.gotoGetInTouchPage();
      });
    });

    test(
      'accepts long input in optional text fields',
      { tag: '@edge' },
      async ({ getInTouchPage }) => {

        await test.step('Enter valid data into required fields', async () => {
          await getInTouchPage.fillForm({
            firstName: getInTouchTestData.valid.firstName,
            lastName: getInTouchTestData.valid.lastName,
            businessEmail: getInTouchTestData.valid.businessEmail,
            phoneNumber: getInTouchTestData.valid.phoneNumber,
          });

          await getInTouchPage.selectJobFunction(
            getInTouchTestData.valid.jobFunction
          );

          /*
           * Relationship is intentionally left empty to prevent
           * accidental production submission.
           */
        });

        await test.step('Enter long input into optional text fields', async () => {
          await getInTouchPage.fillForm({
            howDidYouHear: getInTouchTestData.longText,
            message: getInTouchTestData.longText,
          });
        });

        await test.step('Verify the long input is retained', async () => {
          await expect(
            getInTouchPage.getHowDidYouHearField()
          ).toHaveValue(getInTouchTestData.longText);

          await expect(
            getInTouchPage.getMessageField()
          ).toHaveValue(getInTouchTestData.longText);
        });

        /*
         * Submission is intentionally skipped because this test runs
         * against production.
         */
      }
    );
  });
});