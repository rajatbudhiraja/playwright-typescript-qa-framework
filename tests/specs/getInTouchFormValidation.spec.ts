import { test, expect } from '../fixtures/pageFixtures';
import { getInTouchTestData } from '../data/testData';

/**
 * Get in Touch form test suite.
 *
 * Coverage:
 * - page availability
 * - valid input
 * - optional fields
 * - required-field validation
 * - invalid formats
 * - robustness
 *
 * Tests run against the production website.
 * The required Relationship field is intentionally left empty in scenarios
 * that enter user data, which prevents accidental successful submission.
 */
test.describe('Get in Touch form', () => {

  // ===========================================================================
  // Smoke
  // ===========================================================================

  test(
    'loads the Get in Touch page successfully',
    { tag: '@smoke' },
    async ({ getInTouchPage }) => {

      await test.step('Open the Get in Touch page', async () => {
        await getInTouchPage.gotoGetInTouchPage();
      });

      await test.step('Verify the expected page is displayed', async () => {
        await expect(getInTouchPage.page).toHaveURL(
          /\/get-in-touch\/?$/
        );

        await expect(
          getInTouchPage.getPageHeading()
        ).toBeVisible();
      });
    }
  );


  // ===========================================================================
  // Positive scenarios
  // ===========================================================================

  test.describe('Positive scenarios', () => {

    test.beforeEach(async ({ getInTouchPage }) => {
      await test.step('Open the Get in Touch page', async () => {
        await getInTouchPage.gotoGetInTouchPage();
      });
    });


    // -------------------------------------------------------------------------
    // Test 2
    // -------------------------------------------------------------------------

    test(
      'accepts valid data in the form fields',
      { tag: '@positive' },
      async ({ getInTouchPage }) => {

        await test.step('Enter valid form data', async () => {
          await getInTouchPage.fillForm({
            firstName: getInTouchTestData.valid.firstName,
            lastName: getInTouchTestData.valid.lastName,
            businessEmail: getInTouchTestData.valid.businessEmail,
            phoneNumber: getInTouchTestData.valid.phoneNumber,
            howDidYouHear: getInTouchTestData.valid.howDidYouHear,
            message: getInTouchTestData.valid.message,
          });

          await getInTouchPage.selectJobFunction(
            getInTouchTestData.valid.jobFunction
          );

          // Relationship is intentionally not selected.
        });

        await test.step('Verify entered values are retained', async () => {
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

        console.log(
          'Production safety: Relationship intentionally not selected. Form submission skipped.'
        );
      }
    );


    // -------------------------------------------------------------------------
    // Test 3
    // -------------------------------------------------------------------------

    test(
      'accepts valid data when optional fields are empty',
      { tag: '@positive' },
      async ({ getInTouchPage }) => {

        await test.step('Enter valid required-field data', async () => {
          await getInTouchPage.fillForm({
            firstName: getInTouchTestData.valid.firstName,
            lastName: getInTouchTestData.valid.lastName,
            businessEmail: getInTouchTestData.valid.businessEmail,
            phoneNumber: getInTouchTestData.valid.phoneNumber,
          });

          await getInTouchPage.selectJobFunction(
            getInTouchTestData.valid.jobFunction
          );

          // Relationship intentionally remains empty.
        });

        await test.step('Verify optional fields remain empty', async () => {
          await expect(
            getInTouchPage.getHowDidYouHearField()
          ).toHaveValue('');

          await expect(
            getInTouchPage.getMessageField()
          ).toHaveValue('');
        });

        await test.step('Verify entered values are retained', async () => {
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
        });

        console.log(
          'Production safety: Relationship intentionally not selected. Form submission skipped.'
        );
      }
    );

  });


  // ===========================================================================
  // Negative scenarios
  // ===========================================================================

  test.describe('Negative scenarios', () => {

    test.beforeEach(async ({ getInTouchPage }) => {
      await test.step('Open the Get in Touch page', async () => {
        await getInTouchPage.gotoGetInTouchPage();
      });
    });


    // -------------------------------------------------------------------------
    // Test 4
    // -------------------------------------------------------------------------

    test(
      'displays validation errors when all required fields are empty',
      { tag: '@negative' },
      async ({ getInTouchPage }) => {

        await test.step('Submit the empty form', async () => {
          await getInTouchPage.submitForm();
        });

        await test.step(
          'Verify all six required-field validation messages are displayed',
          async () => {
            await expect(
              getInTouchPage.getRequiredFieldErrorMessages()
            ).toHaveCount(6);
          }
        );

        await test.step(
          'Verify the form-level validation message is displayed',
          async () => {
            await expect(
              getInTouchPage.getFormLevelErrorMessage()
            ).toBeVisible();
          }
        );
      }
    );


    // -------------------------------------------------------------------------
    // Test 5
    // -------------------------------------------------------------------------

    test(
      'displays validation when Relationship is missing',
      { tag: '@negative' },
      async ({ getInTouchPage }) => {

        await test.step(
          'Complete the form while leaving Relationship empty',
          async () => {
            await getInTouchPage.fillForm({
              firstName: getInTouchTestData.valid.firstName,
              lastName: getInTouchTestData.valid.lastName,
              businessEmail: getInTouchTestData.valid.businessEmail,
              phoneNumber: getInTouchTestData.valid.phoneNumber,
              howDidYouHear: getInTouchTestData.valid.howDidYouHear,
              message: getInTouchTestData.valid.message,
            });

            await getInTouchPage.selectJobFunction(
              getInTouchTestData.valid.jobFunction
            );

            // Relationship intentionally remains empty.
          }
        );

        await test.step('Submit the incomplete form', async () => {
          await getInTouchPage.submitForm();
        });

        await test.step(
          'Verify Relationship required-field validation is displayed',
         async () => {
            await expect(
              getInTouchPage.getRelationshipValidationMessage()
          ).toHaveText('Please complete this required field.');
     }
    );

        await test.step(
          'Verify the form-level validation message is displayed',
          async () => {
            await expect(
              getInTouchPage.getFormLevelErrorMessage()
            ).toBeVisible();
          }
        );
      }
    );


    // -------------------------------------------------------------------------
    // Test 6
    // -------------------------------------------------------------------------

    test(
      'displays validation for invalid email and phone number',
      { tag: '@negative' },
      async ({ getInTouchPage }) => {

        await test.step(
          'Enter invalid email and phone values',
          async () => {
            await getInTouchPage.fillForm({
              firstName: getInTouchTestData.valid.firstName,
              lastName: getInTouchTestData.valid.lastName,
              businessEmail: getInTouchTestData.invalid.businessEmail,
              phoneNumber: getInTouchTestData.invalid.phoneNumber,
            });

            await getInTouchPage.selectJobFunction(
              getInTouchTestData.valid.jobFunction
            );

            // Relationship intentionally remains empty.
          }
        );

        await test.step(
          'Submit the intentionally invalid form',
          async () => {
            await getInTouchPage.submitForm();
          }
        );

        await test.step(
          'Verify the email validation message',
          async () => {
            await expect(
              getInTouchPage.getEmailValidationMessage()
            ).toBeVisible();
          }
        );

        await test.step(
          'Verify the phone validation message',
          async () => {
            await expect(
              getInTouchPage.getPhoneValidationMessage()
            ).toBeVisible();
          }
        );

        console.log(
          'Production safety: Relationship intentionally left empty. reCAPTCHA validation is outside this test scope.'
        );
      }
    );

  });


  // ===========================================================================
  // Edge scenario
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Test 7
  // ---------------------------------------------------------------------------

  test(
    'accepts long input in optional text fields',
    { tag: '@edge' },
    async ({ getInTouchPage }) => {

      await test.step('Open the Get in Touch page', async () => {
        await getInTouchPage.gotoGetInTouchPage();
      });

      await test.step(
        'Enter long values into optional fields',
        async () => {
          await getInTouchPage.fillForm({
            howDidYouHear: getInTouchTestData.longText,
            message: getInTouchTestData.longText,
          });
        }
      );

      await test.step(
        'Verify long values are retained',
        async () => {
          await expect(
            getInTouchPage.getHowDidYouHearField()
          ).toHaveValue(getInTouchTestData.longText);

          await expect(
            getInTouchPage.getMessageField()
          ).toHaveValue(getInTouchTestData.longText);
        }
      );

      // No submission is required for this robustness scenario.
    }
  );

});