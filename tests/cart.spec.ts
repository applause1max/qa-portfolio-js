import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test('TC-012: Add single item to cart', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCartByIndex(0);
  await expect(loggedInPage.getByRole('button', { name: 'Remove' }).first()).toBeVisible();
  const badge = await inventoryPage.getCartBadgeCount();
  expect(badge).toBe('1');
});

test('TC-013: Add multiple items to cart', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCartByIndex(0);
  await inventoryPage.addToCartByIndex(0);
  await inventoryPage.addToCartByIndex(0);
  const badge = await inventoryPage.getCartBadgeCount();
  expect(badge).toBe('3');

  const removeButtons = await loggedInPage.getByRole('button', { name: 'Remove' }).all();
  expect(removeButtons.length).toBe(3);
});

test('TC-014: Remove item from cart reverts button state and clears badge', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCartByIndex(0);
  await expect(loggedInPage.getByRole('button', { name: 'Remove' }).first()).toBeVisible();
  await loggedInPage.getByRole('button', { name: 'Remove' }).first().click();
  await expect(loggedInPage.getByRole('button', { name: 'Add to cart' }).first()).toBeVisible();
  await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});

test('TC-015: Remove item from cart via cart page', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  const cartPage = new CartPage(loggedInPage);
  await inventoryPage.addToCartByIndex(0);
  await cartPage.open();
  await cartPage.removeFirstItem();
  await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
  const count = await cartPage.getItemCount();
  expect(count).toBe(0);
});

test('TC-016: Cart contents persist across navigation', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.addToCartByIndex(0);
  expect(await inventoryPage.getCartBadgeCount()).toBe('1');
  await loggedInPage.locator('[data-test="inventory-item-name"]').first().click();
  expect(await inventoryPage.getCartBadgeCount()).toBe('1');
  await expect(loggedInPage.getByRole('button', { name: 'Remove' }).first()).toBeVisible();
  await loggedInPage.getByRole('button', { name: 'Back to products' }).click();
  expect(await inventoryPage.getCartBadgeCount()).toBe('1');
  await expect(loggedInPage.getByRole('button', { name: 'Remove' }).first()).toBeVisible();
});

test('TC-017: Cart displays correct item count with zero items', async ({ loggedInPage }) => {
  const cartPage = new CartPage(loggedInPage);
  await cartPage.open();
  const count = await cartPage.getItemCount();
  expect(count).toBe(0);
  await expect(loggedInPage.locator('[data-test="error"]')).toHaveCount(0);
});

test('TC-018: "Continue Shopping" from cart returns to inventory', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  const cartPage = new CartPage(loggedInPage);
  await inventoryPage.addToCartByIndex(0);
  await cartPage.open();
  await cartPage.continueShopping();
  await expect(loggedInPage).toHaveURL('https://www.saucedemo.com/inventory.html');
  expect(await inventoryPage.getCartBadgeCount()).toBe('1');
});