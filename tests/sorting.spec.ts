import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';

test('TC-007: Verify sorting in ascending order', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.sortBy('az');
  const products = await inventoryPage.getProductNames();
  expect(products).toEqual([...products].sort());
});

test('TC-008: Verify sorting in descending order', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.sortBy('za');
  const products = await inventoryPage.getProductNames();
  expect(products).toEqual([...products].sort().reverse());
});

test('TC-009: Verify sorting from lowest price', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.sortBy('lohi');
  const prices = await inventoryPage.getProductPrices();
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('TC-010: Verify sorting from highest price', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.sortBy('hilo');
  const prices = await inventoryPage.getProductPrices();
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
});

test('TC-011: Verify sorting applied when navigating back from product page', async ({ loggedInPage }) => {
  test.fail();
  const inventoryPage = new InventoryPage(loggedInPage);
  await inventoryPage.sortBy('lohi');
  await loggedInPage.locator('[data-test="inventory-item-name"]').first().click();
  await loggedInPage.getByRole('button', { name: 'Back to products' }).click();
  const prices = await inventoryPage.getProductPrices();
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});