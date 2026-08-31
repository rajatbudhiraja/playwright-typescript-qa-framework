import { test, expect } from '../fixtures/pageFixtures';
import { getInTouchTestData } from '../data/testData';

/**
 * Get in Touch form test suite.
 *
 * Production safety:
 * These tests run against the live production website.
 *
 * The Submit button is intentionally NEVER clicked.
 * Instead, a reporting step is added to clearly show that submission
 * was skipped to avoid creating real contact requests in production.
 *
 * Coverage:
 * - page availability
 * - valid field entry
 * - optional fields
 * - required-field presence
 * - invalid input entry
 * - field correction
 */
test.describe('Get in Touch form', () => {

  test.beforeEach(async ({ getInTouchPage }) => {
    await test.step('Open the Get in Touch page', async () => {
      await getInTouchPage.gotoGetInTouchPage();
    });
  });


  // ===========================================================================
  // Test 1 - Smoke
  // ===========================================================================

  test(
    'loads the Get in Touch page successfully',
    { tag: '@smoke' },
    async ({ getInTouchPage }) => {

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
  // Test 2 - Positive
  // ===========================================================================

  test(
    'allows valid data to be entered and retained in the form fields',
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

      await test.step(
        'Production safety - submission intentionally skipped',
        async () => {
          console.log(
            'Production safety: Submit button was intentionally not clicked.'
          );
        }
      );
    }
  );


  // ===========================================================================
  // Test 3 - Optional fields
  // ===========================================================================

  test(
    'allows required field data while optional fields remain empty',
    { tag: '@positive' },
    async ({ getInTouchPage }) => {

      await test.step(
        'Enter data without filling optional fields',
        async () => {
          await getInTouchPage.fillForm({
            firstName: getInTouchTestData.valid.firstName,
            lastName: getInTouchTestData.valid.lastName,
            businessEmail: getInTouchTestData.valid.businessEmail,
            phoneNumber: getInTouchTestData.valid.phoneNumber,
          });

          await getInTouchPage.selectJobFunction(
            getInTouchTestData.valid.jobFunction
          );
        }
      );

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

      await test.step(
        'Production safety - submission intentionally skipped',
        async () => {
          console.log(
            'Production safety: Submit button was intentionally not clicked.'
          );
        }
      );
    }
  );


  // ===========================================================================
  // Test 4 - Required fields
  // ===========================================================================

  test(
    'shows required fields on the form',
    { tag: '@negative' },
    async ({ getInTouchPage }) => {

      await test.step(
        'Verify required fields are visible',
        async () => {
          await expect(
            getInTouchPage.getFirstNameField()
          ).toBeVisible();

          await expect(
            getInTouchPage.getLastNameField()
          ).toBeVisible();

          await expect(
            getInTouchPage.getBusinessEmailField()
          ).toBeVisible();

          await expect(
            getInTouchPage.getPhoneNumberField()
          ).toBeVisible();
        }
      );

      await test.step(
        'Production safety - validation submission intentionally skipped',
        async () => {
          console.log(
            'Production safety: Submit was not clicked, so server/form submission validation was not triggered.'
          );
        }
      );
    }
  );


  // ===========================================================================
  // Test 5 - Job Function
  // ===========================================================================

  test(
    'allows a Job Function option to be selected',
    { tag: '@positive' },
    async ({ getInTouchPage }) => {

      await test.step('Select a Job Function', async () => {
        await getInTouchPage.selectJobFunction(
          getInTouchTestData.valid.jobFunction
        );
      });

      await test.step(
        'Verify the selected Job Function is retained',
        async () => {
          await expect(
            getInTouchPage.getJobFunctionDropdown()
            .locator('option:checked')
              ).toHaveText(getInTouchTestData.valid.jobFunction);
        }
      );

      await test.step(
        'Production safety - submission intentionally skipped',
        async () => {
          console.log(
            'Production safety: Submit button was intentionally not clicked.'
          );
        }
      );
    }
  );


  // ===========================================================================
  // Test 6 - Invalid input
  // ===========================================================================

  test(
    'allows invalid email and phone values to be entered for validation testing',
    { tag: '@negative' },
    async ({ getInTouchPage }) => {

      await test.step(
        'Enter invalid email and phone values',
        async () => {
          await getInTouchPage.fillForm({
            businessEmail: getInTouchTestData.invalid.businessEmail,
            phoneNumber: getInTouchTestData.invalid.phoneNumber,
          });
        }
      );

      await test.step(
        'Verify invalid values are present in the fields',
        async () => {
          await expect(
            getInTouchPage.getBusinessEmailField()
          ).toHaveValue(
            getInTouchTestData.invalid.businessEmail
          );

          await expect(
            getInTouchPage.getPhoneNumberField()
          ).toHaveValue(
            getInTouchTestData.invalid.phoneNumber
          );
        }
      );

      await test.step(
        'Production safety - validation submission intentionally skipped',
        async () => {
          console.log(
            'Production safety: Submit was not clicked. Validation after submission is intentionally outside this production-safe test.'
          );
        }
      );
    }
  );


  // ===========================================================================
  // Test 7 - Field correction
  // ===========================================================================

  test(
    'allows invalid field values to be corrected with valid data',
    { tag: '@negative' },
    async ({ getInTouchPage }) => {

      await test.step(
        'Enter invalid email and phone values',
        async () => {
          await getInTouchPage.fillForm({
            businessEmail: getInTouchTestData.invalid.businessEmail,
            phoneNumber: getInTouchTestData.invalid.phoneNumber,
          });
        }
      );

      await test.step(
        'Correct the invalid values',
        async () => {
          await getInTouchPage.fillForm({
            businessEmail: getInTouchTestData.valid.businessEmail,
            phoneNumber: getInTouchTestData.valid.phoneNumber,
          });
        }
      );

      await test.step(
        'Verify corrected values are retained',
        async () => {
          await expect(
            getInTouchPage.getBusinessEmailField()
          ).toHaveValue(
            getInTouchTestData.valid.businessEmail
          );

          await expect(
            getInTouchPage.getPhoneNumberField()
          ).toHaveValue(
            getInTouchTestData.valid.phoneNumber
          );
        }
      );

      await test.step(
        'Production safety - submission intentionally skipped',
        async () => {
          console.log(
            'Production safety: Submit button was intentionally not clicked.'
          );
        }
      );
    }
  );
});