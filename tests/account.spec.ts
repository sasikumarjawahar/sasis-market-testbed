import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login.html');
});

test('shows known customer demo credentials and signs in to the storefront', async ({ page }) => {
  await expect(page).toHaveTitle(/Sign in \| Sasi's Market/);
  await expect(page.getByText('customer@sasis.market')).toBeVisible();
  await expect(page.getByText('shopper-demo')).toBeVisible();
  await expect(page.getByRole('button', { name: /continue as customer/i })).toBeVisible();

  await page.getByRole('button', { name: /continue as customer/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Shop the collection' })).toBeVisible();
});

test('switches role and signs in to the staff demo dashboard', async ({ page }) => {
  await page.getByRole('button', { name: 'Staff' }).click();
  await expect(page.getByText('staff@sasis.market')).toBeVisible();
  await expect(page.getByText('market-admin-demo')).toBeVisible();
  await page.getByRole('button', { name: /continue as staff/i }).click();

  await expect(page).toHaveURL(/\/staff\.html$/);
  await expect(page.getByRole('heading', { name: 'Good morning, Sasi.' })).toBeVisible();
  await expect(page.getByText('No real transactions')).toBeVisible();
});

test('rejects credentials that do not match the selected role', async ({ page }) => {
  await page.getByLabel('Email').fill('wrong@example.test');
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: /continue as customer/i }).click();

  await expect(page.getByRole('alert')).toContainText('Those demo credentials do not match');
  await expect(page).toHaveURL(/\/login\.html$/);
});

test('redirects unauthenticated visitors from the staff dashboard', async ({ page }) => {
  await page.goto('/staff.html');

  await expect(page).toHaveURL(/\/login\.html\?role=staff$/);
  await expect(page.locator('.role-option[data-role="staff"]')).toHaveAttribute('aria-pressed', 'true');
});

test('signs staff out and removes the demo session', async ({ page }) => {
  await page.getByRole('button', { name: 'Staff' }).click();
  await page.getByRole('button', { name: /continue as staff/i }).click();
  await expect(page).toHaveURL(/\/staff\.html$/);

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/login\.html$/);
  await expect(page.locator('.role-option[data-role="customer"]')).toHaveAttribute('aria-pressed', 'true');
});
