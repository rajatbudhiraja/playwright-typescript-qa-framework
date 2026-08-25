/**
 * Test data used by the Get in Touch form test suite.
 *
 * Values are intentionally generic and do not contain real personal
 * information because the test suite runs against a production website.
 */
export const getInTouchTestData = {
  valid: {
    firstName: 'Test',
    lastName: 'User',
    businessEmail: 'test.user@example.com',
    phoneNumber: '6135551234',
    jobFunction: 'IT Management',
    relationship: 'Microsoft customer.',
    howDidYouHear: 'Search engine',
    message: 'This is a test message for UI validation.',
  },

  invalid: {
    businessEmail: 'invalid-email',
    phoneNumber: '5625',
  },

  longText:
    'This is intentionally long test data used to verify that the optional text fields can handle reasonably large input without unexpected validation errors.',
};


/**
 * Test data used by the Case Studies filter tests.
 */
export const caseStudyFilters = {
  type: 'Case Study',
  validCategoryWithResults: 'Higher Education',
  categoryWithNoResults: 'Microsoft 365 Copilot',
};