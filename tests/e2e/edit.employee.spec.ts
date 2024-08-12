import { expect, test } from '@playwright/test';

test.use({
  locale: 'en-EN',
});

test('Home Page Test - edit employee', async ({ page }) => {
  test.setTimeout(120000);
  // show homepage
  const response = await page.goto('http://localhost:3000/');
  // Test that the response did not fail
  expect(
    response?.status(),
    'should respond with correct status code',
  ).toBeLessThan(400);

  // edit employee
  await page.getByLabel('Action').click();
  await expect(page.getByLabel('Edit Employee').locator('a')).toBeVisible();
  await page.getByLabel('Edit Employee').locator('a').click();
  await expect(page.getByLabel('Edit Employee').first()).toBeVisible();

  // choose employee => hugh
  await page.getByText('Select employee name').click();
  await page.getByRole('option', { name: 'hugh1' }).first().click();
  // choose manager => darin
  await page.getByText('Select a manager').click();
  await page.getByRole('option', { name: 'darin' }).first().click();

  await page.getByRole('button', { name: 'Submit' }).click();
  // close toast
  setTimeout(async () => {
    // show toast success
    await expect(page.getByText('Success edit employee')).toBeVisible();
    await page.getByRole('button').nth(1).click();
  }, 2000);

  setTimeout(async () => {
    await expect(page.getByText('Success edit employee')).toBeHidden();
  }, 5000);
});
