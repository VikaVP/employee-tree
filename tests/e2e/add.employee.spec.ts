import { expect, test } from '@playwright/test';

test.use({
  locale: 'en-EN',
});

test('Home Page Test - add employee', async ({ page }) => {
  test.setTimeout(120000);
  // show homepage
  const response = await page.goto('http://localhost:3000/');
  // Test that the response did not fail
  expect(
    response?.status(),
    'should respond with correct status code',
  ).toBeLessThan(400);

  // add employee
  const action = page.getByLabel('Action');
  await action.click();
  await expect(page.getByLabel('New Employee').locator('a')).toBeVisible();
  await page.getByLabel('New Employee').locator('a').click();

  await expect(page.getByLabel('Add New Employee')).toBeVisible();

  await page.getByPlaceholder('Entry employee name').fill('sari');
  await page.getByText('Select a manager').click();
  await page.getByRole('option', { name: 'raelynn' }).click();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();
  // show toast success
  await expect(page.getByText('Success add employee')).toBeVisible();
  // close toast
  await page.getByRole('button').nth(1).click();
  setTimeout(async () => {
    await expect(page.getByText('Success add employee')).toBeHidden();
  }, 5000);
});
