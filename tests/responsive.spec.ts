import { expect, test } from '@playwright/test';

test('keeps catalog and checkout usable at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Good finds, everyday.' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(6);
  await expect(page.getByLabel('Search products')).toBeVisible();
  await expect(page.getByRole('button', { name: /complete demo order/i })).toBeVisible();
  await expect(page.locator('html')).toHaveJSProperty('scrollWidth', 375);
});
