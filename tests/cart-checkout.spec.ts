import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function addTote(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Add Everyday Canvas Tote to bag' }).click();
}

async function fillCustomer(page: import('@playwright/test').Page) {
  await page.locator('#customer-name').fill('Sasi Demo');
  await page.getByLabel('Email').fill('sasi@example.test');
  await fillDummyCard(page);
}

async function fillDummyCard(page: import('@playwright/test').Page, cardNumber = '4242 4242 4242 4242') {
  await page.getByLabel('Name on card').fill('Sasi Demo');
  await page.getByLabel('Dummy card number').fill(cardNumber);
  await page.getByLabel('Expiry (MM/YY)').fill('12/30');
  await page.getByLabel('CVC').fill('123');
}

test('updates cart quantity, subtotal, shipping, and total', async ({ page }) => {
  await addTote(page);
  await expect(page.locator('#header-cart-count')).toHaveText('1');
  await expect(page.locator('#cart-subtotal')).toHaveText('$32.00');
  await expect(page.locator('#shipping-cost')).toHaveText('$6.95');
  await expect(page.locator('#cart-total')).toHaveText('$38.95');

  await page.getByRole('button', { name: 'Increase Everyday Canvas Tote quantity' }).click();
  await expect(page.locator('#checkout-item-count')).toHaveText('2 items');
  await expect(page.locator('#cart-total')).toHaveText('$70.95');
});

test('validates required name and valid email', async ({ page }) => {
  await addTote(page);
  const checkout = page.getByRole('button', { name: /complete demo order/i });
  await expect(checkout).toBeDisabled();

  await page.locator('#customer-name').fill('Sasi Demo');
  await page.getByLabel('Email').fill('not-an-email');
  await fillDummyCard(page);
  await expect(checkout).toBeDisabled();

  await page.getByLabel('Email').fill('sasi@example.test');
  await page.getByLabel('Dummy card number').fill('4242 4242 4242 4241');
  await expect(checkout).toBeDisabled();

  await page.getByLabel('Dummy card number').fill('4242 4242 4242 4242');
  await page.getByLabel('Expiry (MM/YY)').fill('01/20');
  await expect(checkout).toBeDisabled();

  await page.getByLabel('Expiry (MM/YY)').fill('12/30');
  await page.getByLabel('CVC').fill('12');
  await expect(checkout).toBeDisabled();

  await page.getByLabel('CVC').fill('123');
  await expect(checkout).toBeEnabled();
});

test('approved demo checkout confirms an order and clears the cart', async ({ page }) => {
  await addTote(page);
  await fillCustomer(page);
  await page.getByRole('button', { name: /complete demo order/i }).click();

  await expect(page.locator('#checkout-message')).toContainText('1 item confirmed for $38.95');
  await expect(page.locator('#order-confirmation')).toBeVisible();
  await expect(page.locator('#confirmation-id')).toHaveText(/^SM-\d{8}$/);
  await expect(page.locator('.empty-cart')).toBeVisible();
  await expect(page.locator('#header-cart-count')).toHaveText('0');
  await expect(page.locator('#card-number')).toHaveValue('');
  await expect(page.locator('#card-cvc')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test('declined payment and timeout preserve cart for retry', async ({ page }) => {
  await addTote(page);
  await fillCustomer(page);
  const checkout = page.getByRole('button', { name: /complete demo order/i });

  await page.getByLabel('Dummy card number').fill('4000 0000 0000 0002');
  await checkout.click();
  await expect(page.locator('#checkout-message')).toContainText('Sandbox payment declined');
  await expect(page.locator('#checkout-item-count')).toHaveText('1 item');

  await page.getByLabel('Dummy card number').fill('4000 0000 0000 9995');
  await checkout.click();
  await expect(page.locator('#checkout-message')).toContainText('Sandbox payment timed out');
  await expect(page.locator('#checkout-item-count')).toHaveText('1 item');
  await expect(page.locator('#order-confirmation')).toBeHidden();
});

test('rejects invalid and unsupported card numbers without creating an order', async ({ page }) => {
  await addTote(page);
  await fillCustomer(page);
  const checkout = page.getByRole('button', { name: /complete demo order/i });

  await page.getByLabel('Dummy card number').fill('4242 4242 4242 4241');
  await expect(checkout).toBeDisabled();

  await page.getByLabel('Dummy card number').fill('4111 1111 1111 1111');
  await expect(checkout).toBeEnabled();
  await checkout.click();
  await expect(page.locator('#checkout-message')).toContainText('not in the local sandbox test set');
  await expect(page.locator('#checkout-item-count')).toHaveText('1 item');
  await expect(page.locator('#order-confirmation')).toBeHidden();
});

test('removing the only cart item restores the empty state', async ({ page }) => {
  await addTote(page);
  await page.getByRole('button', { name: 'Remove Everyday Canvas Tote' }).click();

  await expect(page.locator('#checkout-item-count')).toHaveText('0 items');
  await expect(page.locator('.empty-cart')).toBeVisible();
  await expect(page.getByRole('button', { name: /complete demo order/i })).toBeDisabled();
});
