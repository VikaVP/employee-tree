import { expect, test } from '@playwright/test';

test.use({
  locale: 'en-EN',
});

test('Home Page Test', async ({ page }) => {
  test.setTimeout(120000);
  // show homepage
  const response = await page.goto('http://localhost:3000/');
  // Test that the response did not fail
  expect(
    response?.status(),
    'should respond with correct status code',
  ).toBeLessThan(400);
  const navbarTitle = page.getByRole('link', { name: 'Employee Tree' });
  await expect(navbarTitle).toBeVisible();
  const emptyState = page.getByText('Please choose employee to');
  await expect(emptyState).toBeVisible();

  // search employee
  await page.getByPlaceholder('Select an employee to see').fill('ev');
  const option = page.getByRole('option', { name: 'evelina' });
  await expect(option).toBeVisible();
  // click option in search dropdown
  await option.click();
  // show hierarchy of evelina
  setTimeout(async () => {
    await expect(
      page
        .getByRole('cell', { name: 'EVELINA EVELINA' })
        .locator('div')
        .first(),
    ).toBeVisible();
    // show total direct reports
    await expect(page.getByText('Total of Direct Reports :')).toBeVisible();
    await expect(page.getByText('2', { exact: true })).toBeVisible();
    // show total indirect reports
    await expect(page.getByText('Total Indirect Reports :')).toBeVisible();
    await expect(page.getByText('11')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'evelina' })).toBeVisible();
    // show hierarchy tree
    await expect(
      page
        .getByRole('cell', { name: 'RAELYNN RAELYNN' })
        .locator('div')
        .first(),
    ).toBeVisible();
    await expect(
      page
        .getByRole('cell', { name: 'KACIE KACIE', exact: true })
        .locator('div')
        .first(),
    ).toBeVisible();
    await expect(
      page
        .getByRole('cell', { name: 'EVELEEN EVELEEN', exact: true })
        .locator('div')
        .first(),
    ).toBeVisible();
  }, 3000);

  // choose employee which has 2 manager
  await page.getByPlaceholder('Select an employee to see').fill('linton');
  await page.getByRole('option', { name: 'linton' }).first().click();
  setTimeout(async () => {
    await expect(page.getByText('"Unable to process employee')).toBeVisible();
  }, 3000);

  // choose employee which doesn't have hierarchy
  await page.getByPlaceholder('Select an employee to see').fill('kea');
  await page.getByRole('option', { name: 'keane' }).click();
  setTimeout(async () => {
    await expect(page.getByText('"Unable to process employeee')).toBeVisible();
  }, 3000);
});
