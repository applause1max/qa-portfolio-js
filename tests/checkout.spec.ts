import { test, expect } from './fixtures';

test('TC-019: Complete checkout with valid information and items in cart', async ({ loggedInPage }) => {
    await loggedInPage.getByRole('button', {name: "Add to cart"}).first().click();
    await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
    await loggedInPage.getByRole('button', {name: 'Checkout'}).click();
    await loggedInPage.getByRole('textbox', {name: 'First Name'}).fill('Test');
    await loggedInPage.getByRole('textbox', {name: 'Last Name'}).fill('User');
    await loggedInPage.getByRole('textbox', {name: "Zip/Postal Code"}).fill('90210');
    await loggedInPage.getByRole('button', {name: 'Continue'}).click();
    await loggedInPage.getByRole('button', {name: 'Finish'}).click();
    await expect(loggedInPage).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(loggedInPage.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
});

test('TC-020: Checkout blocked with empty cart', async ({ loggedInPage }) => {
  test.fail(true, 'Known issue: checkout completes successfully even with zero items in cart, see BUG-002');
  await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
  await loggedInPage.getByRole('button', { name: 'Checkout' }).click();
  await loggedInPage.getByRole('textbox', { name: 'First Name' }).fill('Test');
  await loggedInPage.getByRole('textbox', { name: 'Last Name' }).fill('User');
  await loggedInPage.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('90210');
  await loggedInPage.getByRole('button', { name: 'Continue' }).click();
  await loggedInPage.getByRole('button', { name: 'Finish' }).click();
  await expect(loggedInPage.locator('[data-test="complete-header"]')).not.toBeVisible();
});

test('TC-021: Checkout fails with missing first name', async ({ loggedInPage }) => {
    await loggedInPage.getByRole('button', {name: 'Add to cart' }).first().click();
    await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
    await loggedInPage.getByRole('button', {name: 'Checkout'}).click();
    await loggedInPage.getByRole('textbox', {name: 'Last Name'}).fill('User');
    await loggedInPage.getByRole('textbox', {name: 'Zip/Postal Code'}).fill('90210');
    await loggedInPage.getByRole('button', {name: 'Continue'}).click();
    await expect(loggedInPage.getByText('First Name is required')).toBeVisible();
});

test('TC-022: Checkout fails with missing last name', async ({ loggedInPage }) => {
    await loggedInPage.getByRole('button', {name: 'Add to cart' }).first().click();
    await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
    await loggedInPage.getByRole('button', {name: 'Checkout'}).click();
    await loggedInPage.getByRole('textbox', {name: 'First Name'}).fill('User');
    await loggedInPage.getByRole('textbox', {name: 'Zip/Postal Code'}).fill('90210');
    await loggedInPage.getByRole('button', {name: 'Continue'}).click();
    await expect(loggedInPage.getByText('Last Name is required')).toBeVisible();
});

test('TC-023: Checkout fails with missing ZIP/Postal Code code', async ({ loggedInPage }) => {
    await loggedInPage.getByRole('button', {name: 'Add to cart' }).first().click();
    await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
    await loggedInPage.getByRole('button', {name: 'Checkout'}).click();
    await loggedInPage.getByRole('textbox', {name: 'First Name'}).fill('User');
    await loggedInPage.getByRole('textbox', {name: 'Last Name'}).fill('Test');
    await loggedInPage.getByRole('button', {name: 'Continue'}).click();
    await expect(loggedInPage.getByText('Postal Code is required')).toBeVisible();
});

test('TC-024: Order summary reflects correct item total and pricing', async ({ loggedInPage }) => {
  await loggedInPage.getByRole('button', { name: 'Add to cart' }).nth(0).click();
  await loggedInPage.getByRole('button', { name: 'Add to cart' }).nth(0).click();
  await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
  await loggedInPage.getByRole('button', { name: 'Checkout' }).click();
  await loggedInPage.getByRole('textbox', { name: 'First Name' }).fill('Test');
  await loggedInPage.getByRole('textbox', { name: 'Last Name' }).fill('User');
  await loggedInPage.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('90210');
  await loggedInPage.getByRole('button', { name: 'Continue' }).click();

  const subtotalText = await loggedInPage.locator('[data-test="subtotal-label"]').textContent();
  const taxText = await loggedInPage.locator('[data-test="tax-label"]').textContent();
  const totalText = await loggedInPage.locator('[data-test="total-label"]').textContent();

  const subtotal = parseFloat(subtotalText!.match(/\$([\d.]+)/)![1]);
  const tax = parseFloat(taxText!.match(/\$([\d.]+)/)![1]);
  const total = parseFloat(totalText!.match(/\$([\d.]+)/)![1]);

  expect(total).toBeCloseTo(subtotal + tax, 2);
});

test ('TC-025:Cart emptied after successful order completion.', async ({ loggedInPage }) =>{
    await loggedInPage.getByRole('button', {name: 'Add to cart'}).first().click();
    await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
    await loggedInPage.getByRole('button', {name: 'Checkout'}).click();
    await loggedInPage.getByRole('textbox', {name: 'First Name'}).fill('Test');
    await loggedInPage.getByRole('textbox', {name: 'Last Name'}).fill('User');
    await loggedInPage.getByRole('textbox', {name: 'Zip/Postal Code'}).fill('90210');
    await loggedInPage.getByRole('button', {name: 'Continue'}).click();
    await loggedInPage.getByRole('button', {name: 'Finish'}).click();
    await expect(loggedInPage.getByText('Thank you for your order!')).toBeVisible();
    await expect (loggedInPage).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await loggedInPage.getByRole('button', {name: 'Back Home'}).click();
    await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});

test('TC-026: Cancel checkout returns user to cart without losing items.', async ({ loggedInPage }) => {
    await loggedInPage.getByRole('button', {name: 'Add to cart'}).first().click();
    await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
    await loggedInPage.getByRole('button', {name: 'Checkout'}).click();
    await loggedInPage.getByRole('textbox', {name: 'First Name'}).fill('Test');
    await loggedInPage.getByRole('textbox', {name: 'Last Name'}).fill('User');
    await loggedInPage.getByRole('textbox', {name: 'Zip/Postal Code'}).fill('90210');
    await loggedInPage.getByRole('button', {name: 'Continue'}).click();
    await loggedInPage.getByRole('button', {name: 'Cancel'}).click();
    await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await expect(loggedInPage).toHaveURL('https://www.saucedemo.com/inventory.html');
});
