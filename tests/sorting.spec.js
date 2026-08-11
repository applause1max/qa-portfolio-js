const {test, expect} = require('./fixtures');

/** @param {{ loggedInPage: import('@playwright/test').Page }} params */
test('TC-007: Verify sorting in ascending order', async ({loggedInPage}) => {
    await loggedInPage.locator('[data-test="product-sort-container"]').selectOption('az');
    const products = await loggedInPage.locator('[data-test="inventory-item-name"]').allTextContents();
    
    expect(products).toEqual([...products].sort());
});