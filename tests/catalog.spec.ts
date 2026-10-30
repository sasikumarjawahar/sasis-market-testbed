import { expect, test } from '@playwright/test';

test('loads the Sasi storefront with six products', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Sasi's Market/);
  await expect(page.getByRole('link', { name: "Sasi's Market home" })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(6);
  const productImages = page.locator('.product-image');
  await expect(productImages).toHaveCount(6);
  for (const productImage of await productImages.all()) {
    await productImage.scrollIntoViewIfNeeded();
    await expect(productImage).toHaveAttribute('alt', /.+/);
    await expect.poll(() => productImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  }
  await expect(page.getByRole('heading', { name: 'Shop the collection' })).toBeVisible();
});

test('searches by product name and shows an empty state for no matches', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search products' }).fill('watch');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card h3')).toHaveText('Field Notes Watch');

  await page.getByRole('searchbox', { name: 'Search products' }).fill('not-a-product');
  await expect(page.locator('.product-card')).toHaveCount(0);
  await expect(page.getByText(/No finds match that search/)).toBeVisible();
});

test('filters categories and sorts products by price', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Filter by category').selectOption('Home');
  await expect(page.locator('.product-card')).toHaveCount(2);
  await expect(page.locator('.product-category')).toHaveText(['Home', 'Home']);

  await page.getByLabel('Filter by category').selectOption('all');
  await page.getByLabel('Sort products').selectOption('price-low');
  const prices = await page.locator('.product-price').allTextContents();
  expect(prices).toEqual([...prices].sort((a, b) => Number(a.replace(/[^\d.]/g, '')) - Number(b.replace(/[^\d.]/g, ''))));
});
