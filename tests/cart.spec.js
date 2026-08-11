const { test, expect } = require('./fixtures');

/** @param {{ loggedInPage: import('@playwright/test').Page }} params */
test('TC-012: Add sigle item to cart', async ({loggedInPage}) => {
    await loggedInPage.getByRole('button', {name: 'Add to cart'}).first().click();
    expect(loggedInPage.getByRole('button', {name: 'Remove'}).first()).toBeVisible();
    expect(loggedInPage.locator('[data-test="shopping-cart-link"]')).toHaveText('1');
});
