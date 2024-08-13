import { expect, test } from '@playwright/test';

test.use({
  locale: 'en-EN',
});

test('Home Page Test - delete employee', async ({ page }) => {
  test.setTimeout(120000);
  // show homepage
  const response = await page.goto('http://localhost:3000/');
  // Test that the response did not fail
  expect(
    response?.status(),
    'should respond with correct status code',
  ).toBeLessThan(400);
  // delete employee
  await page.getByLabel('Action').click();
  await page.getByLabel('Delete Employee').locator('a').click();
  await expect(
    page.getByRole('heading', { name: 'Delete Employee' }),
  ).toBeVisible();

  await page.getByText('Select employee').click();
  await page.getByRole('option', { name: 'rui' }).first().click();
  setTimeout(async () => {
    await page.getByRole('button', { name: 'Submit' }).click();
    // show toast success
    await expect(page.getByText('Success delete employees')).toBeVisible();
    // close toast
    await page.getByRole('button').nth(1).click();
  }, 2000);

  setTimeout(async () => {
    await expect(page.getByText('Success delete employees')).toBeHidden();
  }, 5000);
});
