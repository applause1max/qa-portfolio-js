import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('TC-019: Complete checkout with valid information and items in cart', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  const cartPage = new CartPage(loggedInPage);
  const checkoutPage = new CheckoutPage(loggedInPage);

  await inventoryPage.addToCartByIndex(0);
  await cartPage.open();
  await cartPage.goToCheckout();
  await checkoutPage.fillInfo('Test', 'User', '90210');
  await checkoutPage.continue_();
  await checkoutPage.finish();

  await expect(loggedInPage).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
  const confirmationText = await checkoutPage.getConfirmationText();
  expect(confirmationText).toBe('Thank you for your order!');
});

test('TC-020: Checkout blocked with empty cart', async ({ loggedInPage }) => {
  test.fail(true, 'Known issue: checkout completes successfully even with zero items in cart, see BUG-002');
  const cartPage = new CartPage(loggedInPage);
  const checkoutPage = new CheckoutPage(loggedInPage);

  await cartPage.open();
  await cartPage.goToCheckout();
  await checkoutPage.fillInfo('Test', 'User', '90210');
  await checkoutPage.continue_();
  await checkoutPage.finish();

  await expect(loggedInPage.locator('[data-test="complete-header"]')).not.toBeVisible();
});

test('TC-021: Checkout fails with missing first name', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  const cartPage = new CartPage(loggedInPage);
  const checkoutPage = new CheckoutPage(loggedInPage);

  await inventoryPage.addToCartByIndex(0);
  await cartPage.open();
  await cartPage.goToCheckout();
  await checkoutPage.fillInfo('', 'User', '90210');
  await checkoutPage.continue_();

  await expect(loggedInPage.getByText('First Name is required')).toBeVisible();
});

test('TC-022: Checkout fails with missing last name', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  const cartPage = new CartPage(loggedInPage);
  const checkoutPage = new CheckoutPage(loggedInPage);

  await inventoryPage.addToCartByIndex(0);
  await cartPage.open();
  await cartPage.goToCheckout();
  await checkoutPage.fillInfo('Test', '', '90210');
  await checkoutPage.continue_();

  await expect(loggedInPage.getByText('Last Name is required')).toBeVisible();
});

test('TC-023: Checkout fails with missing zip/postal code', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  const cartPage = new CartPage(loggedInPage);
  const checkoutPage = new CheckoutPage(loggedInPage);

  await inventoryPage.addToCartByIndex(0);
  await cartPage.open();
  await cartPage.goToCheckout();
  await checkoutPage.fillInfo('Test', 'User', '');
  await checkoutPage.continue_();

  await expect(loggedInPage.getByText('Postal Code is required')).toBeVisible();
});

test('TC-024: Order summary reflects correct item total and pricing', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  const cartPage = new CartPage(loggedInPage);
  const checkoutPage = new CheckoutPage(loggedInPage);

  await inventoryPage.addToCartByIndex(0);
  await inventoryPage.addToCartByIndex(0);
  await cartPage.open();
  await cartPage.goToCheckout();
  await checkoutPage.fillInfo('Test', 'User', '90210');
  await checkoutPage.continue_();

  const { subtotal, tax, total } = await checkoutPage.getOrderTotals();
  expect(total).toBeCloseTo(subtotal + tax, 2);
});

test('TC-025: Cart emptied after successful order completion', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  const cartPage = new CartPage(loggedInPage);
  const checkoutPage = new CheckoutPage(loggedInPage);

  await inventoryPage.addToCartByIndex(0);
  await cartPage.open();
  await cartPage.goToCheckout();
  await checkoutPage.fillInfo('Test', 'User', '90210');
  await checkoutPage.continue_();
  await checkoutPage.finish();

  const confirmationText = await checkoutPage.getConfirmationText();
  expect(confirmationText).toBe('Thank you for your order!');
  await expect(loggedInPage).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
  await loggedInPage.getByRole('button', { name: 'Back Home' }).click();
  await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});

test('TC-026: Cancel checkout returns user to cart without losing items', async ({ loggedInPage }) => {
  const inventoryPage = new InventoryPage(loggedInPage);
  const cartPage = new CartPage(loggedInPage);
  const checkoutPage = new CheckoutPage(loggedInPage);

  await inventoryPage.addToCartByIndex(0);
  await cartPage.open();
  await cartPage.goToCheckout();
  await checkoutPage.fillInfo('Test', 'User', '90210');
  await checkoutPage.continue_();
  await checkoutPage.cancel();

  await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  await expect(loggedInPage).toHaveURL('https://www.saucedemo.com/inventory.html');
});