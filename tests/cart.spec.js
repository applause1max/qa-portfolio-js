const { log } = require('node:console');
const { test, expect } = require('./fixtures');

/** @param {{ loggedInPage: import('@playwright/test').Page }} params */
test('TC-012: Add sigle item to cart', async ({loggedInPage}) => {
    await loggedInPage.getByRole('button', {name: 'Add to cart'}).first().click();
    await expect(loggedInPage.getByRole('button', {name: 'Remove'}).first()).toBeVisible();
    await expect(loggedInPage.locator('[data-test="shopping-cart-link"]')).toHaveText('1');
});

/** @param {{ loggedInPage: import('@playwright/test').Page }} params */
test('TC-013: Add multiple items to cart', async ({ loggedInPage }) => {
    const addButtons = await loggedInPage.getByRole('button', {name: 'Add to cart'}).all();
    await addButtons[0].click();
    await addButtons[1].click();
    await addButtons[2].click();
    await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');

    const removeButtons = await loggedInPage.getByRole('button', {name: 'Remove'}).all();
    expect(removeButtons.length).toBe(3);
});

/** @param {{ loggedInPage: import('@playwright/test').Page }} params */
test('TC-014: Remove item from cart reverts button state and clears badge', async ({ loggedInPage }) => {
    await loggedInPage.getByRole('button', {name: "Add to cart"}).first().click();
    await expect(loggedInPage.getByRole('button', {name: 'Remove'}).first()).toBeVisible();
    await loggedInPage.getByRole('button', {name: 'Remove'}).first().click();
    await expect(loggedInPage.getByRole('button', {name: "Add to cart"}).first()).toBeVisible();
    await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});

/** @param {{ loggedInPage: import('@playwright/test').Page }} params */
test('TC-015:Remove item from cart via cart page', async ({ loggedInPage }) =>{
    await loggedInPage.getByRole('button', {name: 'Add to cart'}).first().click();
    await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
    await loggedInPage.getByRole('button', {name: 'Remove'}).click();
    await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    await expect(loggedInPage.locator('[data-test="inventory-item"]')).toHaveCount(0);
});


test('TC-016: Cart contents persist across navigation.', async({ loggedInPage }) =>{
    await loggedInPage.getByRole('button', {name: 'Add to cart'}).first().click();
    await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await loggedInPage.locator('[data-test="inventory-item-name"]').first().click();
    await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await expect(loggedInPage.getByRole('button', {name: 'Remove'}).first()).toBeVisible();
    await loggedInPage.getByRole('button', {name: 'Back to products'}).click();
    await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await expect(loggedInPage.getByRole('button', {name: 'Remove'}).first()).toBeVisible();
});

test('TC-017: Cart displays correct item count with zero items.', async ({ loggedInPage }) =>{
    await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
    await expect(loggedInPage.locator('[data-test="inventory-item"]')).toHaveCount(0);
    await expect(loggedInPage.locator('[data-test="error"]')).toHaveCount(0);
});

test('TC-018: "Continue Shopping" from cart returns to inventory.', async ({ loggedInPage }) =>{
    await loggedInPage.getByRole('button', {name: 'Add to cart'}).first().click();
    await loggedInPage.locator('[data-test="shopping-cart-link"]').click();
    await loggedInPage.getByRole('button', {name: "Continue Shopping"}).click();
    await expect(loggedInPage).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
});
